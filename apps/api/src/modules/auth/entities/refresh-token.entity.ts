import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

/**
 * Refresh token entity — stored hashed, revocable (Section 4).
 *
 * Rules:
 * - Long-lived (7 days), rotated on every use
 * - Stored as a hash (never plaintext in DB)
 * - Revocable by admin (forced logout) or on password change
 * - Checked against revocation on every refresh attempt
 * - Old token invalidated when a new one is issued (rotation)
 */
@Entity('refresh_tokens')
@Index('idx_refresh_tokens_user', ['userId'])
@Index('idx_refresh_tokens_hash', ['tokenHash'])
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'char', length: 36, name: 'user_id' })
  userId: string;

  @Column({ type: 'varchar', length: 255, name: 'token_hash' })
  tokenHash: string; // bcrypt hash of the actual token

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'family_id' })
  familyId: string | null; // Token family for rotation detection (reuse = compromise)

  @Column({ type: 'varchar', length: 45, nullable: true, name: 'issued_from_ip' })
  issuedFromIp: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true, name: 'user_agent' })
  userAgent: string | null;

  @CreateDateColumn({ type: 'datetime', precision: 6, name: 'issued_at' })
  issuedAt: Date;

  @Column({ type: 'datetime', precision: 6, name: 'expires_at' })
  expiresAt: Date;

  @Column({ type: 'tinyint', width: 1, default: 0, name: 'is_revoked' })
  isRevoked: boolean;

  @Column({ type: 'datetime', precision: 6, nullable: true, name: 'revoked_at' })
  revokedAt: Date | null;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'revoked_reason' })
  revokedReason: string | null; // 'logout', 'password_change', 'admin_force', 'rotation', 'suspicious_reuse'

  @Column({ type: 'char', length: 36, nullable: true, name: 'replaced_by_id' })
  replacedById: string | null; // Points to the new token that replaced this one

  // --- Relations ---
  @ManyToOne(() => User, (user) => user.refreshTokens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
