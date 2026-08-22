/**
 * The 16 roles defined in Section 4 of the master spec.
 * These are the only valid roles in the system.
 */
export enum Role {
  SUPER_ADMIN = 'super_admin',           // R01 — All plants, MFA required
  HR_ADMIN = 'hr_admin',                 // R02 — Assigned company/plants
  HR_EXECUTIVE = 'hr_executive',         // R03 — Assigned plant/departments
  TIME_OFFICE = 'time_office',           // R04 — Assigned plants
  PAYROLL_MAKER = 'payroll_maker',       // R05 — Assigned payroll groups
  PAYROLL_APPROVER = 'payroll_approver', // R06 — Assigned legal entity
  HOD_MANAGER = 'hod_manager',           // R07 — Direct/indirect reports
  MGMT_APPROVER = 'mgmt_approver',      // R08 — Approval only
  QA_COMPLIANCE = 'qa_compliance',       // R09 — GMP-relevant population
  LD_TRAINER = 'ld_trainer',             // R10 — Assigned training scope
  EHS_MEDICAL = 'ehs_medical',           // R11 — Assigned site
  RECRUITER = 'recruiter',               // R12 — Assigned requisitions
  EMPLOYEE = 'employee',                 // R13 — Self only
  CONTRACTOR_ADMIN = 'contractor_admin', // R14 — Own contract/work order
  AUDITOR = 'auditor',                   // R15 — Time-bound, read-only
  IT_SUPPORT = 'it_support',             // R16 — System scope, no business data
}

/**
 * Human-readable labels for each role
 */
export const RoleLabels: Record<Role, string> = {
  [Role.SUPER_ADMIN]: 'Super Admin',
  [Role.HR_ADMIN]: 'HR Admin',
  [Role.HR_EXECUTIVE]: 'HR Executive',
  [Role.TIME_OFFICE]: 'Time Office',
  [Role.PAYROLL_MAKER]: 'Payroll Maker',
  [Role.PAYROLL_APPROVER]: 'Payroll Approver / Finance',
  [Role.HOD_MANAGER]: 'HOD / Manager',
  [Role.MGMT_APPROVER]: 'Management Approver',
  [Role.QA_COMPLIANCE]: 'QA / Compliance',
  [Role.LD_TRAINER]: 'L&D / Trainer',
  [Role.EHS_MEDICAL]: 'EHS / Medical',
  [Role.RECRUITER]: 'Recruiter',
  [Role.EMPLOYEE]: 'Employee',
  [Role.CONTRACTOR_ADMIN]: 'Contractor Admin',
  [Role.AUDITOR]: 'Auditor / Read-only',
  [Role.IT_SUPPORT]: 'IT Support',
};
