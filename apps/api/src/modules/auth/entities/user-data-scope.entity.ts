import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';
import { User } from './user.entity';

/**
 * Data scope assignment — controls WHAT organizational data a user can access.
 *
 * Section 4, Layer 2: Data scope is applied at the QUERY level,
 * not just the response. This means unauthorized data never even
 * hits the application layer.
 *
 * Scope types:
 * - 'all'        → full access (Super Admin)
 * - 'company'    → specific legal entities
 * - 'plant'      → specific plants within a company
 * - 'department' → specific departments within a plant
 * - 'self'       → own records only (Employee role)
 */
@Entity('user_data_scopes')
@Index('idx_user_data_scopes_user', ['userId'])
export class UserDataScope extends BaseEntity {
  @Column({ type: 'char', length: 36, name: 'user_id' })
  userId: string;

  @Column({
    type: 'enum',
    enum: ['all', 'company', 'plant', 'department', 'self'],
    name: 'scope_type',
  })
  scopeType: 'all' | 'company' | 'plant' | 'department' | 'self';

  /**
   * The ID of the entity this scope refers to.
   * - For 'all' and 'self': null
   * - For 'company': company UUID
   * - For 'plant': plant UUID
   * - For 'department': department UUID
   */
  @Column({ type: 'char', length: 36, nullable: true, name: 'scope_entity_id' })
  scopeEntityId: string | null;

  /**
   * Human-readable label for admin display
   * e.g. "Vadodara Plant", "Production Department"
   */
  @Column({ type: 'varchar', length: 200, nullable: true, name: 'scope_entity_label' })
  scopeEntityLabel: string | null;

  @Column({ type: 'char', length: 36, nullable: true, name: 'assigned_by' })
  assignedBy: string | null;

  // --- Relations ---
  @ManyToOne(() => User, (user) => user.dataScopes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
