import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { User } from './entities/user.entity';

/**
 * Token service — handles JWT access tokens and refresh token generation.
 *
 * Section 4 rules:
 * - Access token: 15-minute expiry, contains userId, roleIds, dataScope, tokenVersion
 * - Refresh token: 7-day expiry, rotated on use, stored hashed, revocable
 * - Never put sensitive PII in the token payload
 */

export interface AccessTokenPayload {
  sub: string;          // userId
  email: string;
  roleIds: string[];    // role codes
  dataScope: {
    type: string;
    entityIds: string[];
  };
  tokenVersion: number;
}

@Injectable()
export class TokenService {
  private readonly accessSecret: string;
  private readonly refreshSecret: string;
  private readonly accessExpiry: string;
  private readonly refreshExpiryMs: number;

  constructor(private readonly configService: ConfigService) {
    this.accessSecret = configService.get<string>('JWT_ACCESS_SECRET', 'dev_access_secret_do_not_use_in_prod_32chars');
    this.refreshSecret = configService.get<string>('JWT_REFRESH_SECRET', 'dev_refresh_secret_do_not_use_in_prod_32chars');
    this.accessExpiry = configService.get<string>('JWT_ACCESS_EXPIRY', '15m');

    // Parse refresh expiry (default 7 days)
    const refreshExpiryStr = configService.get<string>('JWT_REFRESH_EXPIRY', '7d');
    this.refreshExpiryMs = this.parseDuration(refreshExpiryStr);
  }

  /**
   * Generate a short-lived JWT access token.
   */
  generateAccessToken(user: User): string {
    const roleCodes = (user.userRoles || [])
      .filter((ur) => {
        // Only include currently-effective roles
        const now = new Date();
        if (ur.effectiveFrom && ur.effectiveFrom > now) return false;
        if (ur.effectiveTo && ur.effectiveTo < now) return false;
        return true;
      })
      .map((ur) => ur.role?.code)
      .filter(Boolean) as string[];

    const scopeType = (user.dataScopes || [])[0]?.scopeType || 'self';
    const scopeEntityIds = (user.dataScopes || [])
      .filter((ds) => ds.scopeEntityId)
      .map((ds) => ds.scopeEntityId as string);

    const payload: AccessTokenPayload = {
      sub: user.id,
      email: user.email,
      roleIds: roleCodes,
      dataScope: {
        type: scopeType,
        entityIds: scopeEntityIds,
      },
      tokenVersion: user.tokenVersion,
    };

    return jwt.sign(payload, this.accessSecret, {
      expiresIn: this.accessExpiry as any,
      issuer: 'pharma-hrms',
      audience: 'pharma-hrms-api',
    });
  }

  /**
   * Verify and decode an access token.
   * Returns null if invalid/expired.
   */
  verifyAccessToken(token: string): AccessTokenPayload | null {
    try {
      const decoded = jwt.verify(token, this.accessSecret, {
        issuer: 'pharma-hrms',
        audience: 'pharma-hrms-api',
      }) as AccessTokenPayload;
      return decoded;
    } catch {
      return null;
    }
  }

  /**
   * Generate a random refresh token + its bcrypt hash for storage.
   * Also generates a family ID for rotation tracking.
   */
  async generateRefreshToken(): Promise<{ token: string; hash: string; familyId: string }> {
    const token = crypto.randomBytes(48).toString('base64url');
    const hash = await bcrypt.hash(token, 10);
    const familyId = crypto.randomUUID();

    return { token, hash, familyId };
  }

  /**
   * Get refresh token expiry date from now.
   */
  getRefreshExpiry(): Date {
    return new Date(Date.now() + this.refreshExpiryMs);
  }

  /**
   * Parse duration string like '15m', '7d', '1h' into milliseconds.
   */
  private parseDuration(str: string): number {
    const match = str.match(/^(\d+)([smhd])$/);
    if (!match) return 7 * 24 * 60 * 60 * 1000; // default 7 days

    const value = parseInt(match[1], 10);
    switch (match[2]) {
      case 's': return value * 1000;
      case 'm': return value * 60 * 1000;
      case 'h': return value * 60 * 60 * 1000;
      case 'd': return value * 24 * 60 * 60 * 1000;
      default: return 7 * 24 * 60 * 60 * 1000;
    }
  }
}
