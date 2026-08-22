import {
  Entity,
  Column,
  Index,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';
import { UserRole } from './user-role.entity';
import { RefreshToken } from './refresh-token.entity';
import { UserDataScope } from './user-data-scope.entity';

/**
 * User entity — represents a login identity in the system.
 *
 * Section 4 rules:
 * - Passwords hashed with bcrypt/argon2 (never plaintext, never logged)
 * - MFA (TOTP) mandatory for Super Admin
 * - Account locks after repeated failed attempts with exponential backoff
 * - Token version incremented on password change / forced logout
 */
@Entity('users')
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  @Index('idx_users_email', { unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, name: 'password_hash' })
  passwordHash: string;

  @Column({ type: 'varchar', length: 100, name: 'first_name' })
  firstName: string;

  @Column({ type: 'varchar', length: 100, name: 'last_name' })
  lastName: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'employee_code' })
  @Index('idx_users_employee_code')
  employeeCode: string | null;

  // --- MFA ---
  @Column({ type: 'tinyint', width: 1, default: 0, name: 'mfa_enabled' })
  mfaEnabled: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'mfa_secret' })
  mfaSecret: string | null; // Encrypted TOTP secret

  // --- Account security ---
  @Column({ type: 'int', default: 0, name: 'failed_login_attempts' })
  failedLoginAttempts: number;

  @Column({ type: 'datetime', precision: 6, nullable: true, name: 'locked_until' })
  lockedUntil: Date | null;

  @Column({ type: 'datetime', precision: 6, nullable: true, name: 'last_login_at' })
  lastLoginAt: Date | null;

  @Column({ type: 'varchar', length: 45, nullable: true, name: 'last_login_ip' })
  lastLoginIp: string | null;

  // --- Token version: incremented on password change / force logout ---
  @Column({ type: 'int', default: 1, name: 'token_version' })
  tokenVersion: number;

  // --- Password management ---
  @Column({ type: 'datetime', precision: 6, nullable: true, name: 'password_changed_at' })
  passwordChangedAt: Date | null;

  @Column({ type: 'tinyint', width: 1, default: 1, name: 'must_change_password' })
  mustChangePassword: boolean;

  // --- Privacy policy acceptance ---
  @Column({ type: 'varchar', length: 50, nullable: true, name: 'privacy_policy_version_accepted' })
  privacyPolicyVersionAccepted: string | null;

  @Column({ type: 'datetime', precision: 6, nullable: true, name: 'privacy_policy_accepted_at' })
  privacyPolicyAcceptedAt: Date | null;

  // --- Relations ---
  @OneToMany(() => UserRole, (ur) => ur.user, { eager: true })
  userRoles: UserRole[];

  @OneToMany(() => RefreshToken, (rt) => rt.user)
  refreshTokens: RefreshToken[];

  @OneToMany(() => UserDataScope, (ds) => ds.user, { eager: true })
  dataScopes: UserDataScope[];
}
