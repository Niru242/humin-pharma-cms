import { DataSource } from 'typeorm';
import { WorkflowDefinition } from '../../modules/workflow/entities/workflow-definition.entity';

/**
 * Seed standard workflow definitions from Section 7.
 */

const WORKFLOW_DEFINITIONS = [
  {
    code: 'leave_request',
    name: 'Leave Request Approval',
    module: 'leave',
    description: 'Draft → Pending Approval → Approved/Rejected → Cancellation Pending/Cancelled',
    initialStatus: 'draft',
    terminalStatuses: ['approved', 'rejected', 'cancelled'],
    steps: [
      {
        name: 'pending_manager',
        assigneeType: 'reporting_manager',
        slaHours: 48,
        escalateToRole: 'hr_admin',
        actions: ['approve', 'reject', 'return'],
        onApprove: 'approved',
        onReject: 'rejected',
        onReturn: 'draft',
      },
    ],
  },
  {
    code: 'attendance_regularization',
    name: 'Attendance Regularization',
    module: 'attendance',
    description: 'Draft → Pending Manager → Approved/Rejected → Applied (triggers recalculation)',
    initialStatus: 'draft',
    terminalStatuses: ['approved', 'rejected'],
    steps: [
      {
        name: 'pending_manager',
        assigneeType: 'reporting_manager',
        slaHours: 72,
        escalateToRole: 'hr_executive',
        actions: ['approve', 'reject', 'return'],
        onApprove: 'approved',
        onReject: 'rejected',
        onReturn: 'draft',
      },
    ],
  },
  {
    code: 'employee_lifecycle',
    name: 'Employee Lifecycle',
    module: 'employee',
    description: 'Draft → Preboarding → Active/Probation → Confirmed → Notice → Separated',
    initialStatus: 'draft',
    terminalStatuses: ['separated'],
    steps: [
      {
        name: 'pending_hr_review',
        assigneeType: 'role:hr_admin',
        slaHours: 24,
        actions: ['approve', 'reject', 'return'],
        onApprove: 'active',
        onReject: 'rejected',
        onReturn: 'draft',
      },
    ],
  },
  {
    code: 'attendance_period_lock',
    name: 'Attendance Period Lock/Unlock',
    module: 'attendance',
    description: 'Open → Ready to Lock → Locked → Unlock Pending → Open with Unlock Scope → Relocked',
    initialStatus: 'open',
    terminalStatuses: ['locked', 'relocked'],
    steps: [
      {
        name: 'pending_lock_approval',
        assigneeType: 'role:hr_admin',
        slaHours: 24,
        actions: ['approve', 'reject'],
        onApprove: 'locked',
        onReject: 'open',
      },
    ],
  },
  {
    code: 'policy_version',
    name: 'Policy Version Publish',
    module: 'configuration',
    description: 'Draft → Published (immutable) → Retired',
    initialStatus: 'draft',
    terminalStatuses: ['published', 'retired'],
    steps: [
      {
        name: 'pending_management_approval',
        assigneeType: 'role:mgmt_approver',
        slaHours: 72,
        actions: ['approve', 'reject', 'return'],
        onApprove: 'published',
        onReject: 'rejected',
        onReturn: 'draft',
      },
    ],
  },
  {
    code: 'generic_approval',
    name: 'Generic Single-Step Approval',
    module: 'general',
    description: 'A reusable single-approver workflow for any domain entity',
    initialStatus: 'pending',
    terminalStatuses: ['approved', 'rejected'],
    steps: [
      {
        name: 'pending_approval',
        assigneeType: 'specific_user',
        slaHours: 48,
        actions: ['approve', 'reject', 'return', 'reassign'],
        onApprove: 'approved',
        onReject: 'rejected',
        onReturn: 'pending',
      },
    ],
  },
];

export async function seedWorkflowDefinitions(dataSource: DataSource): Promise<void> {
  const repo = dataSource.getRepository(WorkflowDefinition);

  console.log('[Seed] Seeding workflow definitions...');

  for (const defData of WORKFLOW_DEFINITIONS) {
    const existing = await repo.findOneBy({ code: defData.code });
    if (!existing) {
      const def = repo.create(defData);
      await repo.save(def);
    }
  }

  console.log(`[Seed] ${WORKFLOW_DEFINITIONS.length} workflow definitions ready`);
}
