import {
  Entity,
  Column,
  Index,
} from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';

/**
 * Delegation / Out-of-office — allows a user to hand off pending
 * approval tasks to a substitute for a date range.
 *
 * Section 10, Stage 1 item 6: "Delegation / Out-of-office feature so a user
 * can hand off pending approval tasks to a substitute for a date range
 * (with the delegation itself audited)."
 *
 * Rules:
 * - Delegation is time-bound (from/to dates)
 * - Can be for all tasks or specific workflow types
 * - The delegation itself is audited (who delegated to whom, when)
 * - Delegatee acts on behalf of delegator — both IDs recorded in the task
 * - A user can only have one active delegation at a time
 */
@Entity('delegations')
@Index('idx_delegations_delegator', ['delegatorId'])
@Index('idx_delegations_delegatee', ['delegateeId'])
@Index('idx_delegations_active', ['delegatorId', 'isActive', 'effectiveFrom', 'effectiveTo'])
export class Delegation extends BaseEntity {
  @Column({ type: 'varchar', length: 36, name: 'delegator_id' })
  delegatorId: string; // The person going out-of-office

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'delegator_name' })
  delegatorName: string | null;

  @Column({ type: 'varchar', length: 36, name: 'delegatee_id' })
  delegateeId: string; // The substitute who will handle tasks

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'delegatee_name' })
  delegateeName: string | null;

  @Column({ type: 'timestamptz', name: 'effective_from' })
  effectiveFrom: Date;

  @Column({ type: 'timestamptz', name: 'effective_to' })
  effectiveTo: Date;

  @Column({ type: 'text', nullable: true })
  reason: string | null; // "Annual leave", "Business travel", etc.

  /**
   * Scope of delegation:
   * - 'all': all workflow tasks
   * - specific workflow codes: ['leave_request', 'attendance_regularization']
   */
  @Column({ type: 'json', nullable: true, name: 'workflow_codes' })
  workflowCodes: string[] | null; // null = all workflows

  @Column({ type: 'boolean', default: false, name: 'is_revoked' })
  isRevoked: boolean;

  @Column({ type: 'timestamptz', nullable: true, name: 'revoked_at' })
  revokedAt: Date | null;

  @Column({ type: 'varchar', length: 36, nullable: true, name: 'revoked_by' })
  revokedBy: string | null;
}
