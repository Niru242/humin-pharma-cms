import {
  Entity,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';
import { WorkflowInstance } from './workflow-instance.entity';

/**
 * Workflow Task — a single action/decision point assigned to a user.
 *
 * Section 7 states: "Pending → Completed/Rejected/Returned/Reassigned/Escalated"
 *
 * This is what appears in the "My Task Inbox" screen.
 * Each step in a workflow creates a task for the assigned person.
 */
@Entity('workflow_tasks')
@Index('idx_workflow_task_assignee', ['assigneeId', 'status'])
@Index('idx_workflow_task_instance', ['instanceId'])
@Index('idx_workflow_task_deadline', ['slaDeadline'])
export class WorkflowTask extends BaseEntity {
  @Column({ type: 'varchar', length: 36, name: 'instance_id' })
  instanceId: string;

  @Column({ type: 'varchar', length: 50, name: 'step_name' })
  stepName: string; // Which step this task belongs to

  @Column({ type: 'varchar', length: 36, name: 'assignee_id' })
  assigneeId: string; // Who needs to act

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'assignee_name' })
  assigneeName: string | null;

  /**
   * Task status:
   * - pending: awaiting action
   * - completed: approved/acted on
   * - rejected: declined
   * - returned: sent back with comment
   * - reassigned: transferred to another user
   * - escalated: SLA breach, moved to escalation contact
   * - cancelled: workflow was cancelled
   */
  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  action: string | null; // The action taken: 'approve', 'reject', 'return', 'reassign'

  @Column({ type: 'text', nullable: true })
  comment: string | null; // Comment/reason for the action

  @Column({ type: 'varchar', length: 36, nullable: true, name: 'acted_by_id' })
  actedById: string | null; // Who actually performed the action (may differ from assignee if delegated)

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'acted_by_name' })
  actedByName: string | null;

  @Column({ type: 'timestamptz', nullable: true, name: 'acted_at' })
  actedAt: Date | null;

  @Column({ type: 'timestamptz', nullable: true, name: 'sla_deadline' })
  slaDeadline: Date | null;

  @Column({ type: 'boolean', default: false, name: 'is_overdue' })
  isOverdue: boolean;

  @Column({ type: 'varchar', length: 36, nullable: true, name: 'reassigned_to_id' })
  reassignedToId: string | null;

  @Column({ type: 'varchar', length: 36, nullable: true, name: 'delegated_from_id' })
  delegatedFromId: string | null; // If this task was received via delegation

  // Display fields for the inbox
  @Column({ type: 'varchar', length: 100, name: 'entity_type' })
  entityType: string; // Denormalized from instance

  @Column({ type: 'varchar', length: 36, name: 'entity_id' })
  entityId: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  title: string | null; // Human-readable task title: "Approve leave request for John Doe"

  @Column({ type: 'varchar', length: 20, nullable: true })
  priority: string | null; // 'low', 'normal', 'high', 'urgent'

  @Column({ type: 'json', nullable: true, name: 'allowed_actions' })
  allowedActions: string[] | null; // What the assignee can do: ['approve','reject','return']

  // --- Relations ---
  @ManyToOne(() => WorkflowInstance, (wi) => wi.tasks)
  @JoinColumn({ name: 'instance_id' })
  instance: WorkflowInstance;
}
