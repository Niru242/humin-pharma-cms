import {
  Entity,
  Column,
  Index,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';
import { RolePermission } from './role-permission.entity';

/**
 * Permission entity — granular action permissions (Section 4).
 *
 * Format: <domain>.<action> (e.g. 'employee.create', 'attendance.lock')
 * Permissions are seeded from the Permission enum in shared package.
 *
 * Three layers of access control:
 * 1. Role → action permission (this table + role_permissions)
 * 2. Data scope (user_data_scopes)
 * 3. Field-level sensitivity (handled in code per data tier)
 */
@Entity('permissions')
export class Permission extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  @Index('idx_permissions_code', { unique: true })
  code: string; // e.g. 'employee.create'

  @Column({ type: 'varchar', length: 50 })
  domain: string; // e.g. 'employee', 'attendance', 'leave'

  @Column({ type: 'varchar', length: 50 })
  action: string; // e.g. 'create', 'read', 'update', 'lock'

  @Column({ type: 'varchar', length: 200, nullable: true })
  description: string | null;

  // --- Relations ---
  @OneToMany(() => RolePermission, (rp) => rp.permission)
  rolePermissions: RolePermission[];
}
