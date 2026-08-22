import {
  Entity,
  Column,
  Index,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';
import { RolePermission } from './role-permission.entity';
import { UserRole } from './user-role.entity';

/**
 * Role entity — one of the 16 predefined roles (Section 4).
 *
 * Roles are seeded, not user-created. Each role maps to a set
 * of permissions via the role_permissions junction table.
 */
@Entity('roles')
export class Role extends BaseEntity {
  @Column({ type: 'varchar', length: 50 })
  @Index('idx_roles_code', { unique: true })
  code: string; // e.g. 'super_admin', 'hr_admin' — matches the Role enum

  @Column({ type: 'varchar', length: 100 })
  name: string; // Human-readable: 'Super Admin', 'HR Admin'

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'boolean', default: false, name: 'requires_mfa' })
  requiresMfa: boolean; // true for Super Admin

  @Column({ type: 'int', default: 0, name: 'hierarchy_level' })
  hierarchyLevel: number; // Lower = more privileged (0 = Super Admin)

  // --- Relations ---
  @OneToMany(() => RolePermission, (rp) => rp.role, { eager: true })
  rolePermissions: RolePermission[];

  @OneToMany(() => UserRole, (ur) => ur.role)
  userRoles: UserRole[];
}
