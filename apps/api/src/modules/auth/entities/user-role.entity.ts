import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';
import { User } from './user.entity';
import { Role } from './role.entity';

/**
 * Junction table: which roles are assigned to which users.
 *
 * A user can have multiple roles (e.g. HR Admin + Time Office for a small site).
 * Effective-from/to supports time-bound role assignments (Section 4, R15 Auditor).
 */
@Entity('user_roles')
@Index('idx_user_roles_unique', ['userId', 'roleId'], { unique: true })
export class UserRole extends BaseEntity {
  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @Column({ type: 'uuid', name: 'role_id' })
  roleId: string;

  @Column({ type: 'timestamptz', nullable: true, name: 'effective_from' })
  effectiveFrom: Date | null; // null = immediately effective

  @Column({ type: 'timestamptz', nullable: true, name: 'effective_to' })
  effectiveTo: Date | null; // null = no expiry (except for time-bound roles like Auditor)

  @Column({ type: 'uuid', nullable: true, name: 'assigned_by' })
  assignedBy: string | null;

  // --- Relations ---
  @ManyToOne(() => User, (user) => user.userRoles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Role, (role) => role.userRoles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role_id' })
  role: Role;
}
