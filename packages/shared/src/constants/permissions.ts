/**
 * Permission actions — granular, server-enforced.
 * Format: <domain>.<action>
 *
 * These are checked by the permission guard on every API route.
 * Hiding a button in the UI is NOT security — every endpoint rechecks.
 */
export enum Permission {
  // Auth & Users
  USER_CREATE = 'user.create',
  USER_READ = 'user.read',
  USER_UPDATE = 'user.update',
  USER_DEACTIVATE = 'user.deactivate',
  USER_MANAGE_ROLES = 'user.manage_roles',
  USER_FORCE_LOGOUT = 'user.force_logout',

  // Organization
  ORG_COMPANY_MANAGE = 'org.company.manage',
  ORG_PLANT_MANAGE = 'org.plant.manage',
  ORG_DEPARTMENT_MANAGE = 'org.department.manage',
  ORG_POSITION_MANAGE = 'org.position.manage',
  ORG_GRADE_MANAGE = 'org.grade.manage',

  // Employee
  EMPLOYEE_CREATE = 'employee.create',
  EMPLOYEE_READ = 'employee.read',
  EMPLOYEE_UPDATE = 'employee.update',
  EMPLOYEE_READ_SENSITIVE = 'employee.read_sensitive',
  EMPLOYEE_DEACTIVATE = 'employee.deactivate',

  // Attendance
  ATTENDANCE_READ = 'attendance.read',
  ATTENDANCE_IMPORT = 'attendance.import',
  ATTENDANCE_REGULARIZE = 'attendance.regularize',
  ATTENDANCE_APPROVE = 'attendance.approve',
  ATTENDANCE_LOCK = 'attendance.lock',
  ATTENDANCE_UNLOCK = 'attendance.unlock',

  // Leave
  LEAVE_POLICY_MANAGE = 'leave.policy.manage',
  LEAVE_REQUEST_CREATE = 'leave.request.create',
  LEAVE_REQUEST_APPROVE = 'leave.request.approve',
  LEAVE_BALANCE_VIEW = 'leave.balance.view',

  // Payroll
  PAYROLL_STRUCTURE_MANAGE = 'payroll.structure.manage',
  PAYROLL_RUN_EXECUTE = 'payroll.run.execute',
  PAYROLL_RUN_APPROVE = 'payroll.run.approve',
  PAYROLL_READ_SALARY = 'payroll.read_salary',

  // Performance
  PERFORMANCE_SCORE = 'performance.score',
  PERFORMANCE_APPROVE = 'performance.approve',
  PERFORMANCE_VIEW_ALL = 'performance.view_all',

  // Compliance & Discipline
  DISCIPLINE_CREATE = 'discipline.create',
  DISCIPLINE_APPROVE = 'discipline.approve',
  DISCIPLINE_VIEW = 'discipline.view',

  // Documents
  DOCUMENT_UPLOAD = 'document.upload',
  DOCUMENT_READ = 'document.read',
  DOCUMENT_MANAGE_TEMPLATES = 'document.manage_templates',

  // Workflow
  WORKFLOW_DEFINE = 'workflow.define',
  WORKFLOW_REASSIGN = 'workflow.reassign',
  WORKFLOW_ESCALATE = 'workflow.escalate',

  // Audit
  AUDIT_LOG_VIEW = 'audit.log.view',

  // System
  SYSTEM_IMPORT_MANAGE = 'system.import.manage',
  SYSTEM_CONFIG_MANAGE = 'system.config.manage',
  SYSTEM_DATA_RETENTION = 'system.data_retention',

  // Reports
  REPORT_GENERATE = 'report.generate',
  REPORT_EXPORT = 'report.export',
}

/**
 * Sensitivity tiers for field-level access control (Section 5)
 */
export enum DataSensitivity {
  PUBLIC = 'public',           // Name, department, designation
  INTERNAL = 'internal',      // Employee code, DOJ, reporting
  RESTRICTED = 'restricted',  // Bank details, statutory IDs
  CONFIDENTIAL = 'confidential', // Medical, disciplinary
}
