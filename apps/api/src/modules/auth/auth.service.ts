import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { User } from './entities/user.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { TokenService } from './token.service';
import { MfaService } from './mfa.service';
import { LoginDto, RefreshDto, ChangePasswordDto } from './dto';

/**
 * Auth service — implements the full auth flow from Section 4:
 * - Login with bcrypt verification → JWT + refresh token
 * - Refresh with rotation (old token invalidated)
 * - Logout (revoke refresh token)
 * - Forced logout / session revocation by admin
 * - Account lockout after 5 failed attempts (exponential backoff)
 * - MFA (TOTP) — mandatory for Super Admin
 * - Password change with token version increment
 */

const MAX_FAILED_ATTEMPTS = 5;
const BASE_LOCKOUT_MINUTES = 5; // Exponential: 5, 10, 20, 40, 80...

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepo: Repository<RefreshToken>,
    private readonly tokenService: TokenService,
    private readonly mfaService: MfaService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Login — verify credentials, check lockout, validate MFA if required,
   * issue access + refresh tokens.
   */
  async login(dto: LoginDto, ip: string, userAgent: string) {
    const user = await this.userRepo.findOne({
      where: { email: dto.email.toLowerCase().trim(), isActive: true },
      relations: ['userRoles', 'userRoles.role', 'dataScopes'],
    });

    if (!user) {
      // Don't reveal whether email exists
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check account lockout
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const remainingMs = user.lockedUntil.getTime() - Date.now();
      const remainingMin = Math.ceil(remainingMs / 60000);
      throw new ForbiddenException(
        `Account locked. Try again in ${remainingMin} minute(s).`,
      );
    }

    // Verify password
    const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordValid) {
      await this.handleFailedAttempt(user);
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if MFA is required
    const requiresMfa = this.userRequiresMfa(user);
    if (requiresMfa) {
      if (!dto.mfaCode) {
        // Return a partial response indicating MFA is needed
        return {
          requiresMfa: true,
          mfaRequired: true,
          message: 'MFA code required',
        };
      }

      // Validate MFA code
      if (!user.mfaSecret) {
        throw new BadRequestException(
          'MFA is required but not configured. Contact admin.',
        );
      }

      const mfaValid = this.mfaService.verifyToken(user.mfaSecret, dto.mfaCode);
      if (!mfaValid) {
        await this.handleFailedAttempt(user);
        throw new UnauthorizedException('Invalid MFA code');
      }
    }

    // Success — reset failed attempts
    await this.userRepo.update(user.id, {
      failedLoginAttempts: 0,
      lockedUntil: null,
      lastLoginAt: new Date(),
      lastLoginIp: ip,
    });

    // Generate tokens
    const accessToken = this.tokenService.generateAccessToken(user);
    const { token: refreshToken, hash: refreshHash, familyId } =
      await this.tokenService.generateRefreshToken();

    // Store refresh token (hashed)
    await this.refreshTokenRepo.save({
      userId: user.id,
      tokenHash: refreshHash,
      familyId,
      issuedFromIp: ip,
      userAgent,
      expiresAt: this.tokenService.getRefreshExpiry(),
    });

    return {
      accessToken,
      refreshToken,
      user: this.sanitizeUserResponse(user),
    };
  }

  /**
   * Refresh — validate refresh token, rotate (issue new, revoke old).
   * If a revoked token is reused, invalidate the entire family (theft detection).
   */
  async refresh(dto: RefreshDto, ip: string, userAgent: string) {
    // Find token by iterating (we store hashes, not plaintext)
    const activeTokens = await this.refreshTokenRepo.find({
      where: {
        isRevoked: false,
        expiresAt: MoreThan(new Date()),
      },
      relations: ['user'],
    });

    let matchedToken: RefreshToken | null = null;
    for (const token of activeTokens) {
      const isMatch = await bcrypt.compare(dto.refreshToken, token.tokenHash);
      if (isMatch) {
        matchedToken = token;
        break;
      }
    }

    if (!matchedToken) {
      // Check if this is a reused (already-revoked) token — indicates theft
      const allTokens = await this.refreshTokenRepo.find({
        where: { isRevoked: true },
        order: { issuedAt: 'DESC' },
        take: 100,
      });

      for (const revokedToken of allTokens) {
        const isReuse = await bcrypt.compare(dto.refreshToken, revokedToken.tokenHash);
        if (isReuse && revokedToken.familyId) {
          // Token reuse detected — revoke entire family
          await this.revokeTokenFamily(revokedToken.familyId, 'suspicious_reuse');
          throw new UnauthorizedException('Session compromised. Please login again.');
        }
      }

      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    // Load the user
    const user = await this.userRepo.findOne({
      where: { id: matchedToken.userId, isActive: true },
      relations: ['userRoles', 'userRoles.role', 'dataScopes'],
    });

    if (!user) {
      throw new UnauthorizedException('User account is inactive');
    }

    // Revoke old token (rotation)
    const { token: newRefreshToken, hash: newHash, familyId: newFamilyId } =
      await this.tokenService.generateRefreshToken();

    const newTokenEntity = await this.refreshTokenRepo.save({
      userId: user.id,
      tokenHash: newHash,
      familyId: matchedToken.familyId, // Same family
      issuedFromIp: ip,
      userAgent,
      expiresAt: this.tokenService.getRefreshExpiry(),
    });

    // Mark old as revoked, link to replacement
    await this.refreshTokenRepo.update(matchedToken.id, {
      isRevoked: true,
      revokedAt: new Date(),
      revokedReason: 'rotation',
      replacedById: newTokenEntity.id,
    });

    // Generate new access token
    const accessToken = this.tokenService.generateAccessToken(user);

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  /**
   * Logout — revoke the specific refresh token.
   */
  async logout(dto: RefreshDto) {
    const activeTokens = await this.refreshTokenRepo.find({
      where: { isRevoked: false, expiresAt: MoreThan(new Date()) },
    });

    for (const token of activeTokens) {
      const isMatch = await bcrypt.compare(dto.refreshToken, token.tokenHash);
      if (isMatch) {
        await this.refreshTokenRepo.update(token.id, {
          isRevoked: true,
          revokedAt: new Date(),
          revokedReason: 'logout',
        });
        return { message: 'Logged out successfully' };
      }
    }

    // Don't error on logout with invalid token — just acknowledge
    return { message: 'Logged out successfully' };
  }

  /**
   * Force logout — admin revokes all sessions for a user (Section 4).
   * Used on role change, offboarding, or security incident.
   */
  async forceLogout(targetUserId: string, reason: string) {
    await this.refreshTokenRepo.update(
      { userId: targetUserId, isRevoked: false },
      {
        isRevoked: true,
        revokedAt: new Date(),
        revokedReason: `admin_force: ${reason}`,
      },
    );

    // Increment token version so existing access tokens fail on next verification
    await this.userRepo.increment({ id: targetUserId }, 'tokenVersion', 1);

    return { message: `All sessions revoked for user ${targetUserId}` };
  }

  /**
   * Change password — verify current, set new, increment token version.
   */
  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const currentValid = await bcrypt.compare(dto.currentPassword, user.passwordHash);
    if (!currentValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Ensure new password is different
    const sameAsOld = await bcrypt.compare(dto.newPassword, user.passwordHash);
    if (sameAsOld) {
      throw new ConflictException('New password must be different from current password');
    }

    const newHash = await bcrypt.hash(dto.newPassword, 12);

    await this.userRepo.update(userId, {
      passwordHash: newHash,
      passwordChangedAt: new Date(),
      mustChangePassword: false,
      tokenVersion: user.tokenVersion + 1, // Invalidate all existing tokens
    });

    // Revoke all refresh tokens
    await this.refreshTokenRepo.update(
      { userId, isRevoked: false },
      { isRevoked: true, revokedAt: new Date(), revokedReason: 'password_change' },
    );

    return { message: 'Password changed. Please login again.' };
  }

  /**
   * Setup MFA — generate secret and QR code for the user.
   */
  async setupMfa(userId: string) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) throw new UnauthorizedException('User not found');

    if (user.mfaEnabled) {
      throw new ConflictException('MFA is already enabled');
    }

    const { secret, otpauthUrl } = this.mfaService.generateSecret(user.email);
    const qrCodeDataUrl = await this.mfaService.generateQrCode(otpauthUrl);

    // Store secret (will be confirmed on verify)
    await this.userRepo.update(userId, { mfaSecret: secret });

    return {
      secret,
      qrCode: qrCodeDataUrl,
      message: 'Scan QR code with authenticator app, then verify with a code',
    };
  }

  /**
   * Verify MFA setup — user provides a code to confirm setup works.
   */
  async verifyMfaSetup(userId: string, code: string) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user || !user.mfaSecret) {
      throw new BadRequestException('MFA setup not initiated');
    }

    const valid = this.mfaService.verifyToken(user.mfaSecret, code);
    if (!valid) {
      throw new UnauthorizedException('Invalid MFA code');
    }

    await this.userRepo.update(userId, { mfaEnabled: true });
    return { message: 'MFA enabled successfully' };
  }

  /**
   * Disable MFA — admin action or self (with password confirmation).
   */
  async disableMfa(userId: string) {
    await this.userRepo.update(userId, {
      mfaEnabled: false,
      mfaSecret: null,
    });
    return { message: 'MFA disabled' };
  }

  // --- Private helpers ---

  private async handleFailedAttempt(user: User): Promise<void> {
    const attempts = user.failedLoginAttempts + 1;
    const updateData: Partial<User> = { failedLoginAttempts: attempts } as any;

    if (attempts >= MAX_FAILED_ATTEMPTS) {
      // Exponential backoff: 5min, 10min, 20min, 40min...
      const lockoutRounds = Math.floor(attempts / MAX_FAILED_ATTEMPTS);
      const lockoutMinutes = BASE_LOCKOUT_MINUTES * Math.pow(2, lockoutRounds - 1);
      const lockedUntil = new Date(Date.now() + lockoutMinutes * 60 * 1000);
      (updateData as any).lockedUntil = lockedUntil;
    }

    await this.userRepo.update(user.id, updateData);
  }

  private userRequiresMfa(user: User): boolean {
    // MFA required if: user has it enabled, or any assigned role requires it
    if (user.mfaEnabled) return true;

    for (const ur of user.userRoles || []) {
      if (ur.role?.requiresMfa) return true;
    }
    return false;
  }

  private sanitizeUserResponse(user: User) {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      employeeCode: user.employeeCode,
      roles: (user.userRoles || []).map((ur) => ur.role?.code).filter(Boolean),
      mfaEnabled: user.mfaEnabled,
      mustChangePassword: user.mustChangePassword,
      dataScopes: (user.dataScopes || []).map((ds) => ({
        type: ds.scopeType,
        entityId: ds.scopeEntityId,
        label: ds.scopeEntityLabel,
      })),
    };
  }

  /**
   * Revoke all tokens in a family — used when token reuse (theft) is detected.
   */
  private async revokeTokenFamily(familyId: string, reason: string): Promise<void> {
    await this.refreshTokenRepo.update(
      { familyId, isRevoked: false },
      { isRevoked: true, revokedAt: new Date(), revokedReason: reason },
    );
  }
}
