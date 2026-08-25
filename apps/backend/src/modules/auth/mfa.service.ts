import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { authenticator } from 'otplib';
import * as QRCode from 'qrcode';

/**
 * MFA service — TOTP-based multi-factor authentication.
 *
 * Section 4: MFA is mandatory for Super Admin role.
 * Uses standard TOTP (RFC 6238) compatible with Google Authenticator,
 * Authy, Microsoft Authenticator, etc.
 */
@Injectable()
export class MfaService {
  private readonly issuer: string;

  constructor(private readonly configService: ConfigService) {
    this.issuer = configService.get<string>('MFA_ISSUER', 'PharmaHRMS');

    // Configure TOTP parameters
    authenticator.options = {
      step: 30,      // 30-second window
      window: 1,     // Allow 1 step tolerance (prev/next)
      digits: 6,
    };
  }

  /**
   * Generate a new TOTP secret and the corresponding otpauth URL.
   */
  generateSecret(userEmail: string): { secret: string; otpauthUrl: string } {
    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(userEmail, this.issuer, secret);
    return { secret, otpauthUrl };
  }

  /**
   * Verify a TOTP code against the stored secret.
   */
  verifyToken(secret: string, token: string): boolean {
    try {
      return authenticator.verify({ token, secret });
    } catch {
      return false;
    }
  }

  /**
   * Generate a QR code as a data URL for easy scanning.
   */
  async generateQrCode(otpauthUrl: string): Promise<string> {
    return QRCode.toDataURL(otpauthUrl);
  }
}
