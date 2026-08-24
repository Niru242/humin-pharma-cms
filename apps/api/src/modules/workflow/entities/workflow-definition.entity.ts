import {
  Entity,
  Column,
  Index,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';
import { WorkflowInstance } from './workflow-instance.entity';

/**
 * Workflow Definition — a reusable workflow template.
 *
 * Section 7: "Build a generic workflow engine that supports sequential
 * approvals, reject/return-with-comment, reassignment, and SLA-based escalation."
 *
 * Each domain state machine (leave request, attendance regularization, etc.)
 * is defined as a WorkflowDefinition with its steps and transitions.
 */
@Entity('workflow_definitions')
export class WorkflowDefinition extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  @Index('idx_workflow_def_code', { unique: true })
  code: string; // e.g. 'leave_request', 'attendance_regularization', 'employee_lifecycle'

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', length: 50 })
  module: string; // Which module owns this: 'leave', 'attendance', 'employee', etc.

  /**
   * Steps define the ordered stages of the workflow.
   * Each step has: name, assigneeType, SLA, actions available.
   *
   * Example:
   * [
   *   { "name": "pending_manager", "assigneeType": "reporting_manager", "slaHours": 48, "actions": ["approve","reject","return"] },
   *   { "name": "pending_hr", "assigneeType": "role:hr_admin", "slaHours": 24, "actions": ["approve","reject"] }
   * ]
   */
  @Column({ type: 'json' })
  steps: WorkflowStep[];

  /**
   * Initial status when a workflow instance is created.
   */
  @Column({ type: 'varchar', length: 50, name: 'initial_status', default: 'draft' })
  initialStatus: string;

  /**
   * Terminal statuses — when the workflow is considered complete.
   */
  @Column({ type: 'json', name: 'terminal_statuses' })
  terminalStatuses: string[]; // e.g. ['approved', 'rejected', 'cancelled']

  @OneToMany(() => WorkflowInstance, (wi) => wi.definition)
  instances: WorkflowInstance[];
}

/**
 * A single step in the workflow.
 */
export interface WorkflowStep {
  name: string;              // Status name: 'pending_manager', 'pending_hr'
  assigneeType: string;      // How to determine assignee: 'reporting_manager', 'role:hr_admin', 'specific_user'
  assigneeId?: string;       // Specific user ID (for 'specific_user' type)
  slaHours?: number;         // Hours before escalation triggers
  escalateToRole?: string;   // Role to escalate to on SLA breach
  actions: string[];         // Allowed actions: 'approve', 'reject', 'return', 'reassign'
  onApprove?: string;        // Next step name or terminal status
  onReject?: string;         // Status on rejection
  onReturn?: string;         // Status on return-with-comment
}
