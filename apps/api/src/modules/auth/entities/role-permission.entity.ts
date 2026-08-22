import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';
import { Role } from './role.entity';
import { Permission } from './permission.entity';

/**
 * Junction table: which permissions are granted to which roles.
 *
 * This is the permission matrix — controls role → action mapping.
 * Enforced server-side on every API call (Section 4).
 */
@Entity('role_permissions')
@Index('idx_role_permissions_unique', ['roleId', 'permissionId'], { unique: true })
export class RolePermission extends BaseEntity {
  @Column({ type: 'uuid', name: 'role_id' })
  roleId: string;

  @Column({ type: 'uuid', name: 'permission_id' })
  permissionId: string;

  // --- Relations ---
  @ManyToOne(() => Role, (role) => role.rolePermissions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @ManyToOne(() => Permission, (perm) => perm.rolePermissions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'permission_id' })
  permission: Permission;
}
