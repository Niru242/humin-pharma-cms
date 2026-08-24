import {
  Entity,
  Column,
  Index,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';
import { WorkflowDefinition } from './workflow-definition.entity';
import { WorkflowTask } from './workflow-task.entity';

/**
 * Workflow Instance — a running instance of a workflow definition.
 *
 * Each leave request, attendance regularization, etc. creates one instance.
 * The instance tracks the current status and links to the originating record.
 */
@Entity('workflow_instances')
@Index('idx_workflow_inst_entity', ['entityType', 'entityId'])
@Index('idx_workflow_inst_status', ['currentStatus'])
@Index('idx_workflow_inst_requester', ['requesterId'])
export class WorkflowInstance extends BaseEntity {
  @Column({ type: 'varchar', length: 36, name: 'definition_id' })
  definitionId: string;

  @Column({ type: 'varchar', length: 100, name: 'entity_type' })
  entityType: string; // 'LeaveRequest', 'AttendanceRegularization', etc.

  @Column({ type: 'varchar', length: 36, name: 'entity_id' })
  entityId: string; // UUID of the record this workflow is for

  @Column({ type: 'varchar', length: 50, name: 'current_status' })
  currentStatus: string; // Current step name or terminal status

  @Column({ type: 'varchar', length: 36, name: 'requester_id' })
  requesterId: string; // Who initiated this workflow

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'requester_name' })
  requesterName: string | null; // Denormalized for display

  @Column({ type: 'varchar', length: 36, nullable: true, name: 'current_assignee_id' })
  currentAssigneeId: string | null; // Who needs to act next

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'current_assignee_name' })
  currentAssigneeName: string | null;

  @Column({ type: 'int', default: 0, name: 'current_step_index' })
  currentStepIndex: number; // Index into the definition's steps array

  @Column({ type: 'timestamptz', nullable: true, name: 'sla_deadline' })
  slaDeadline: Date | null; // When the current step's SLA expires

  @Column({ type: 'boolean', default: false, name: 'is_escalated' })
  isEscalated: boolean;

  @Column({ type: 'boolean', default: false, name: 'is_completed' })
  isCompleted: boolean;

  @Column({ type: 'timestamptz', nullable: true, name: 'completed_at' })
  completedAt: Date | null;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, unknown> | null; // Extra context from the domain

  // --- Relations ---
  @ManyToOne(() => WorkflowDefinition, (wd) => wd.instances)
  @JoinColumn({ name: 'definition_id' })
  definition: WorkflowDefinition;

  @OneToMany(() => WorkflowTask, (t) => t.instance, { cascade: true })
  tasks: WorkflowTask[];
}
