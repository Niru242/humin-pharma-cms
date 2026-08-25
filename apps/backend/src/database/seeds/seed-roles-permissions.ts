import { DataSource } from 'typeorm';
import { Role } from '../../modules/auth/entities/role.entity';
import { Permission } from '../../modules/auth/entities/permission.entity';
import { RolePermission } from '../../modules/auth/entities/role-permission.entity';

/**
 * Seed the 16 roles and all permissions from the master spec (Section 4).
 * Also creates the role → permission mappings.
 */

const ROLES_DATA = [
  { code: 'super_admin', name: 'Super Admin', description: 'Full system access, all plants. MFA required.', requiresMfa: true, hierarchyLevel: 0 },
  { code: 'hr_admin', name: 'HR Admin', description: 'Assigned company/plants. Maker/checker for critical changes.', requiresMfa: false, hierarchyLevel: 1 },
  { code: 'hr_executive', name: 'HR Executive', description: 'Assigned plant/departments. No payroll approval, no role changes.', requiresMfa: false, hierarchyLevel: 2 },
  { code: 'time_office', name: 'Time Office', description: 'Assigned plants. Cannot edit raw punches; cannot approve own adjustments.', requiresMfa: false, hierarchyLevel: 3 },
  { code: 'payroll_maker', name: 'Payroll Maker', description: 'Assigned payroll groups. Cannot final-approve or change bank details after lock.', requiresMfa: false, hierarchyLevel: 3 },
  { code: 'payroll_approver', name: 'Payroll Approver / Finance', description: 'Assigned legal entity. Read-only HR details beyond payroll need.', requiresMfa: false, hierarchyLevel: 2 },
  { code: 'hod_manager', name: 'HOD / Manager', description: 'Direct/indirect reports only. No access to unrelated employee records.', requiresMfa: false, hierarchyLevel: 4 },
  { code: 'mgmt_approver', name: 'Management Approver', description: 'Company/business scope. Approval only, no operational editing.', requiresMfa: false, hierarchyLevel: 1 },
  { code: 'qa_compliance', name: 'QA / Compliance', description: 'GMP-relevant population. No payroll values unless authorized.', requiresMfa: false, hierarchyLevel: 3 },
  { code: 'ld_trainer', name: 'L&D / Trainer', description: 'Assigned training scope. Cannot alter approved course version history.', requiresMfa: false, hierarchyLevel: 4 },
  { code: 'ehs_medical', name: 'EHS / Medical', description: 'Assigned site. Medical data restricted from normal HR users.', requiresMfa: false, hierarchyLevel: 4 },
  { code: 'recruiter', name: 'Recruiter', description: 'Assigned requisitions. No active-employee salary/performance access.', requiresMfa: false, hierarchyLevel: 4 },
  { code: 'employee', name: 'Employee', description: 'Self only. Cannot alter approved records.', requiresMfa: false, hierarchyLevel: 10 },
  { code: 'contractor_admin', name: 'Contractor Admin', description: 'Own contract/work order. No employee workforce access.', requiresMfa: false, hierarchyLevel: 8 },
  { code: 'auditor', name: 'Auditor / Read-only', description: 'Time-bound assigned scope. No create/update/delete, ever.', requiresMfa: false, hierarchyLevel: 2 },
  { code: 'it_support', name: 'IT Support', description: 'System scope. No business record content by default.', requiresMfa: false, hierarchyLevel: 5 },
];

const PERMISSIONS_DATA = [
  // Auth & Users
  { code: 'user.create', domain: 'user', action: 'create', description: 'Create new user accounts' },
  { code: 'user.read', domain: 'user', action: 'read', description: 'View user accounts' },
  { code: 'user.update', domain: 'user', action: 'update', description: 'Update user accounts' },
  { code: 'user.deactivate', domain: 'user', action: 'deactivate', description: 'Deactivate user accounts' },
  { code: 'user.manage_roles', domain: 'user', action: 'manage_roles', description: 'Assign/remove roles from users' },
  { code: 'user.force_logout', domain: 'user', action: 'force_logout', description: 'Force logout / revoke sessions' },

  // Organization
  { code: 'org.company.manage', domain: 'org', action: 'company.manage', description: 'Manage company/legal entity records' },
  { code: 'org.plant.manage', domain: 'org', action: 'plant.manage', description: 'Manage plant records' },
  { code: 'org.department.manage', domain: 'org', action: 'department.manage', description: 'Manage department records' },
  { code: 'org.position.manage', domain: 'org', action: 'position.manage', description: 'Manage positions/designations' },
  { code: 'org.grade.manage', domain: 'org', action: 'grade.manage', description: 'Manage grade structures' },

  // Employee
  { code: 'employee.create', domain: 'employee', action: 'create', description: 'Create employee records' },
  { code: 'employee.read', domain: 'employee', action: 'read', description: 'View employee records (within data scope)' },
  { code: 'employee.update', domain: 'employee', action: 'update', description: 'Update employee records' },
  { code: 'employee.read_sensitive', domain: 'employee', action: 'read_sensitive', description: 'View bank/statutory/medical fields' },
  { code: 'employee.deactivate', domain: 'employee', action: 'deactivate', description: 'Deactivate/separate employees' },

  // Attendance
  { code: 'attendance.read', domain: 'attendance', action: 'read', description: 'View attendance records' },
  { code: 'attendance.import', domain: 'attendance', action: 'import', description: 'Import biometric/attendance data' },
  { code: 'attendance.regularize', domain: 'attendance', action: 'regularize', description: 'Submit attendance regularization' },
  { code: 'attendance.approve', domain: 'attendance', action: 'approve', description: 'Approve attendance regularization' },
  { code: 'attendance.lock', domain: 'attendance', action: 'lock', description: 'Lock attendance period' },
  { code: 'attendance.unlock', domain: 'attendance', action: 'unlock', description: 'Unlock attendance period (high-risk)' },

  // Leave
  { code: 'leave.policy.manage', domain: 'leave', action: 'policy.manage', description: 'Create/publish leave policies' },
  { code: 'leave.request.create', domain: 'leave', action: 'request.create', description: 'Submit leave requests' },
  { code: 'leave.request.approve', domain: 'leave', action: 'request.approve', description: 'Approve/reject leave requests' },
  { code: 'leave.balance.view', domain: 'leave', action: 'balance.view', description: 'View leave balances' },

  // Payroll
  { code: 'payroll.structure.manage', domain: 'payroll', action: 'structure.manage', description: 'Manage salary structures' },
  { code: 'payroll.run.execute', domain: 'payroll', action: 'run.execute', description: 'Execute payroll processing' },
  { code: 'payroll.run.approve', domain: 'payroll', action: 'run.approve', description: 'Approve payroll run' },
  { code: 'payroll.read_salary', domain: 'payroll', action: 'read_salary', description: 'View salary/compensation data' },

  // Performance
  { code: 'performance.score', domain: 'performance', action: 'score', description: 'Submit performance scores' },
  { code: 'performance.approve', domain: 'performance', action: 'approve', description: 'Approve performance reviews' },
  { code: 'performance.view_all', domain: 'performance', action: 'view_all', description: 'View all performance data' },

  // Discipline
  { code: 'discipline.create', domain: 'discipline', action: 'create', description: 'Create discipline records' },
  { code: 'discipline.approve', domain: 'discipline', action: 'approve', description: 'Approve discipline actions' },
  { code: 'discipline.view', domain: 'discipline', action: 'view', description: 'View discipline records' },

  // Documents
  { code: 'document.upload', domain: 'document', action: 'upload', description: 'Upload documents' },
  { code: 'document.read', domain: 'document', action: 'read', description: 'Read/download documents' },
  { code: 'document.manage_templates', domain: 'document', action: 'manage_templates', description: 'Manage document/notification templates' },

  // Workflow
  { code: 'workflow.define', domain: 'workflow', action: 'define', description: 'Define workflow definitions' },
  { code: 'workflow.reassign', domain: 'workflow', action: 'reassign', description: 'Reassign workflow tasks' },
  { code: 'workflow.escalate', domain: 'workflow', action: 'escalate', description: 'Escalate overdue tasks' },

  // Audit
  { code: 'audit.log.view', domain: 'audit', action: 'log.view', description: 'View audit trail' },

  // System
  { code: 'system.import.manage', domain: 'system', action: 'import.manage', description: 'Manage import jobs' },
  { code: 'system.config.manage', domain: 'system', action: 'config.manage', description: 'Manage system configuration' },
  { code: 'system.data_retention', domain: 'system', action: 'data_retention', description: 'Manage data retention/archive' },

  // Reports
  { code: 'report.generate', domain: 'report', action: 'generate', description: 'Generate reports' },
  { code: 'report.export', domain: 'report', action: 'export', description: 'Export data (applies same scope as screen)' },
];

/**
 * Role → Permission mapping.
 * Super Admin gets everything. Other roles get subsets.
 */
const ROLE_PERMISSION_MAP: Record<string, string[]> = {
  super_admin: PERMISSIONS_DATA.map((p) => p.code), // All permissions

  hr_admin: [
    'user.create', 'user.read', 'user.update', 'user.deactivate', 'user.manage_roles',
    'org.company.manage', 'org.plant.manage', 'org.department.manage', 'org.position.manage', 'org.grade.manage',
    'employee.create', 'employee.read', 'employee.update', 'employee.read_sensitive', 'employee.deactivate',
    'attendance.read', 'attendance.import', 'attendance.approve', 'attendance.lock', 'attendance.unlock',
    'leave.policy.manage', 'leave.request.approve', 'leave.balance.view',
    'performance.approve', 'performance.view_all',
    'discipline.create', 'discipline.approve', 'discipline.view',
    'document.upload', 'document.read', 'document.manage_templates',
    'workflow.define', 'workflow.reassign', 'workflow.escalate',
    'audit.log.view',
    'system.import.manage', 'system.config.manage',
    'report.generate', 'report.export',
  ],

  hr_executive: [
    'user.read',
    'org.department.manage',
    'employee.create', 'employee.read', 'employee.update',
    'attendance.read', 'attendance.import', 'attendance.approve',
    'leave.request.approve', 'leave.balance.view',
    'performance.score', 'performance.view_all',
    'discipline.create', 'discipline.view',
    'document.upload', 'document.read',
    'report.generate', 'report.export',
  ],

  time_office: [
    'attendance.read', 'attendance.import', 'attendance.regularize', 'attendance.lock',
    'employee.read',
    'leave.balance.view',
    'system.import.manage',
    'report.generate',
  ],

  payroll_maker: [
    'employee.read', 'employee.read_sensitive',
    'attendance.read',
    'leave.balance.view',
    'payroll.structure.manage', 'payroll.run.execute', 'payroll.read_salary',
    'report.generate', 'report.export',
  ],

  payroll_approver: [
    'employee.read',
    'payroll.run.approve', 'payroll.read_salary',
    'report.generate', 'report.export',
  ],

  hod_manager: [
    'employee.read',
    'attendance.read', 'attendance.approve',
    'leave.request.approve', 'leave.balance.view',
    'performance.score',
    'discipline.view',
    'document.read',
    'report.generate',
  ],

  mgmt_approver: [
    'employee.read',
    'attendance.read',
    'leave.balance.view',
    'payroll.run.approve',
    'performance.approve', 'performance.view_all',
    'discipline.approve', 'discipline.view',
    'report.generate', 'report.export',
  ],

  qa_compliance: [
    'employee.read',
    'attendance.read',
    'discipline.view',
    'document.read',
    'audit.log.view',
    'report.generate',
  ],

  ld_trainer: [
    'employee.read',
    'document.upload', 'document.read',
  ],

  ehs_medical: [
    'employee.read', 'employee.read_sensitive',
    'document.upload', 'document.read',
  ],

  recruiter: [
    'employee.create', 'employee.read',
    'document.upload', 'document.read',
  ],

  employee: [
    'employee.read',
    'attendance.read', 'attendance.regularize',
    'leave.request.create', 'leave.balance.view',
    'document.upload', 'document.read',
  ],

  contractor_admin: [
    'employee.read',
    'document.upload', 'document.read',
  ],

  auditor: [
    'employee.read',
    'attendance.read',
    'leave.balance.view',
    'payroll.read_salary',
    'performance.view_all',
    'discipline.view',
    'document.read',
    'audit.log.view',
    'report.generate', 'report.export',
  ],

  it_support: [
    'user.read', 'user.force_logout',
    'system.import.manage', 'system.config.manage',
    'audit.log.view',
  ],
};

export async function seedRolesAndPermissions(dataSource: DataSource): Promise<void> {
  const roleRepo = dataSource.getRepository(Role);
  const permRepo = dataSource.getRepository(Permission);
  const rpRepo = dataSource.getRepository(RolePermission);

  // --- Seed Roles ---
  console.log('[Seed] Seeding roles...');
  const roleEntities: Record<string, Role> = {};
  for (const roleData of ROLES_DATA) {
    let role = await roleRepo.findOneBy({ code: roleData.code });
    if (!role) {
      role = roleRepo.create(roleData);
      role = await roleRepo.save(role);
    }
    roleEntities[role.code] = role;
  }
  console.log(`[Seed] ${Object.keys(roleEntities).length} roles ready`);

  // --- Seed Permissions ---
  console.log('[Seed] Seeding permissions...');
  const permEntities: Record<string, Permission> = {};
  for (const permData of PERMISSIONS_DATA) {
    let perm = await permRepo.findOneBy({ code: permData.code });
    if (!perm) {
      perm = permRepo.create(permData);
      perm = await permRepo.save(perm);
    }
    permEntities[perm.code] = perm;
  }
  console.log(`[Seed] ${Object.keys(permEntities).length} permissions ready`);

  // --- Seed Role-Permission mappings ---
  console.log('[Seed] Seeding role-permission mappings...');
  let mappingCount = 0;
  for (const [roleCode, permCodes] of Object.entries(ROLE_PERMISSION_MAP)) {
    const role = roleEntities[roleCode];
    if (!role) continue;

    for (const permCode of permCodes) {
      const perm = permEntities[permCode];
      if (!perm) continue;

      const existing = await rpRepo.findOneBy({ roleId: role.id, permissionId: perm.id });
      if (!existing) {
        const rp = rpRepo.create({ roleId: role.id, permissionId: perm.id });
        await rpRepo.save(rp);
        mappingCount++;
      }
    }
  }
  console.log(`[Seed] ${mappingCount} new role-permission mappings created`);
}
