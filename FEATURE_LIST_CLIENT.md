# Pharma HRMS — Feature List (Client Document)

**Product:** Pharma HRMS — Enterprise Human Resource Management System
**Client:** Humin Pharma
**Prepared:** August 2026
**Version:** 1.0

---

## Product Summary

A configurable hire-to-retire HRMS platform purpose-built for pharmaceutical manufacturers. Single employee record, controlled workflows, full audit trail, role-based access, and pharma workforce-compliance support.

---

## Feature Status Legend

| Status | Meaning |
|--------|---------|
| ✅ Completed | Built, tested, and ready for use |
| 🔧 In Progress | Currently under development |
| 📋 Planned | Scheduled for upcoming phase |
| 🔮 Future | Roadmap item for later phases |

---

## Module 1: Platform Foundation

| # | Feature | Status | Description |
|---|---------|--------|-------------|
| 1.1 | User Authentication (Login) | ✅ Completed | Email/password login with JWT tokens |
| 1.2 | Multi-Factor Authentication (MFA) | ✅ Completed | TOTP-based 2FA via authenticator apps |
| 1.3 | Account Security & Lockout | ✅ Completed | Auto-lock after 5 failed attempts, exponential backoff |
| 1.4 | Session Management | ✅ Completed | Access token (15min) + refresh token (7day) with rotation |
| 1.5 | Role-Based Access Control (RBAC) | ✅ Completed | 16 roles, 47 permissions, 5 data scope levels |
| 1.6 | Data Scope Filtering | ✅ Completed | Users see only their authorized plants/departments/teams |
| 1.7 | Field-Level Sensitivity | ✅ Completed | Sensitive fields (bank, Aadhaar, salary) masked per role |
| 1.8 | Audit Trail | ✅ Completed | Every create/update/delete logged with actor, timestamp, before/after values |
| 1.9 | Workflow Engine | ✅ Completed | Configurable approval workflows with SLA tracking |
| 1.10 | Task Inbox & Delegation | ✅ Completed | Centralized task queue, out-of-office delegation |
| 1.11 | Document Management | ✅ Completed | File upload, versioning, templates, legal hold |
| 1.12 | Notification System | ✅ Completed | In-app notifications with email/SMS/WhatsApp ready |
| 1.13 | Global Search | ✅ Completed | Cross-module search across all entities |
| 1.14 | Import Job Monitor | ✅ Completed | Track bulk imports with progress, errors, retry |
| 1.15 | Data Retention & Archival | ✅ Completed | Configurable retention policies, legal hold support |
| 1.16 | Legacy Data Migration Tool | ✅ Completed | CSV import with validation, error queue, department mapping |
| 1.17 | Health Check & Monitoring | ✅ Completed | API health endpoint with DB/service status |
| 1.18 | Rate Limiting & Security | ✅ Completed | Request throttling, security headers, input validation |

---

## Module 2: Organization & Core HR

| # | Feature | Status | Description |
|---|---------|--------|-------------|
| 2.1 | Company & Legal Entity Master | ✅ Completed | Multi-company support with registration details |
| 2.2 | Plant / Location Master | ✅ Completed | Multiple manufacturing sites with timezone |
| 2.3 | Department & Cost Center | ✅ Completed | Department hierarchy with HOD assignment |
| 2.4 | Designation / Position Master | ✅ Completed | Job titles with sort order |
| 2.5 | Grade / Level Master | ✅ Completed | Employee grades with probation configuration |
| 2.6 | Employee Directory | ✅ Completed | Paginated, searchable, filterable employee list |
| 2.7 | Employee 360 Profile | ✅ Completed | Complete employee record (personal, employment, statutory) |
| 2.8 | Employee Creation | ✅ Completed | Add employee with duplicate detection |
| 2.9 | Employee Update & Deactivation | ✅ Completed | Edit profile, soft-delete/separation |
| 2.10 | Reporting Structure & Org Chart | 📋 Planned | Visual org chart with reporting lines |
| 2.11 | Employment Change Requests | 📋 Planned | Promotion, transfer, redesignation with approval |
| 2.12 | Bulk Import & Validation | ✅ Completed | CSV import with row-level validation |

---

## Module 3: Time, Shift & Attendance

| # | Feature | Status | Description |
|---|---------|--------|-------------|
| 3.1 | Shift Master | 🔧 In Progress | Define shifts with timings, night shift support |
| 3.2 | Holiday Calendar | 🔧 In Progress | Plant-wise holiday management |
| 3.3 | Biometric Punch Import | 📋 Planned | CSV/API import from biometric devices |
| 3.4 | Raw Punch Viewer | 📋 Planned | Immutable punch records (no direct edits) |
| 3.5 | Daily Attendance Processing | 📋 Planned | Auto-calculate status from punches + shift + policy |
| 3.6 | Late / Early / Absent Detection | 📋 Planned | Policy-based exception identification |
| 3.7 | Missing Punch Queue | 📋 Planned | Identify and resolve missing punches |
| 3.8 | Attendance Regularization | 📋 Planned | Request corrections with approval workflow |
| 3.9 | Overtime Request & Approval | 📋 Planned | OT requests with manager approval |
| 3.10 | Shift Roster Calendar | 📋 Planned | Visual roster with bulk assignment |
| 3.11 | Monthly Attendance Summary | 📋 Planned | Consolidated monthly view per employee |
| 3.12 | Attendance Lock / Unlock | 📋 Planned | Period locking for payroll freeze |
| 3.13 | Punch Compliance Report | 📋 Planned | Compliance tracking and reporting |
| 3.14 | Attendance Dashboard | 📋 Planned | Real-time attendance KPIs and charts |

---

## Module 4: Leave & Holiday Management

| # | Feature | Status | Description |
|---|---------|--------|-------------|
| 4.1 | Leave Policy Master | 📋 Planned | Configurable leave types, accrual, carry forward |
| 4.2 | Leave Balance Tracking | 📋 Planned | Real-time balance per employee per type |
| 4.3 | Apply Leave (Employee) | 📋 Planned | Self-service leave application |
| 4.4 | Leave Approval (Manager) | 📋 Planned | Approve/reject with comments |
| 4.5 | Team Leave Calendar | 📋 Planned | Visual team availability view |
| 4.6 | HR Leave Adjustment | 📋 Planned | Manual balance corrections |
| 4.7 | Leave Accrual Run | 📋 Planned | Monthly/periodic accrual processing |
| 4.8 | Comp-off Grant | 📋 Planned | Compensatory off from overtime/holidays |
| 4.9 | Leave Encashment | 📋 Planned | Year-end or separation encashment |
| 4.10 | Leave Year Closing | 📋 Planned | Annual carry-forward and lapse processing |

---

## Module 5: Employee & Manager Self-Service

| # | Feature | Status | Description |
|---|---------|--------|-------------|
| 5.1 | My Profile View & Edit | ✅ Completed | View and update personal details |
| 5.2 | My Attendance & Leave | 📋 Planned | Personal attendance and leave dashboard |
| 5.3 | My Documents | 📋 Planned | View and upload personal documents |
| 5.4 | My Payslips | 📋 Planned | View and download payslips |
| 5.5 | My Requests | 📋 Planned | Track all submitted requests |
| 5.6 | Manager Team View | 📋 Planned | Team directory with quick actions |
| 5.7 | Manager Approval Queue | 📋 Planned | Pending approvals across all modules |
| 5.8 | Privacy Policy Acceptance | ✅ Completed | DPDPA-compliant consent tracking |

---

## Module 6: Payroll & Statutory

| # | Feature | Status | Description |
|---|---------|--------|-------------|
| 6.1 | Salary Structure Master | 📋 Planned | Components (basic, HRA, DA, deductions) |
| 6.2 | Salary Structure Assignment | 📋 Planned | Assign structure to employees |
| 6.3 | Monthly Payroll Calendar | 📋 Planned | Payroll schedule and cut-off dates |
| 6.4 | Variable Input Upload | 📋 Planned | OT, bonus, deductions upload |
| 6.5 | Attendance-to-Payroll Reconciliation | 📋 Planned | Verify attendance inputs before payroll |
| 6.6 | Pre-payroll Validation | 📋 Planned | Error detection before processing |
| 6.7 | Payroll Run & Processing | 📋 Planned | Monthly salary calculation engine |
| 6.8 | Payroll Approval & Lock | 📋 Planned | Maker-checker before finalization |
| 6.9 | Payslip Generation & Publish | 📋 Planned | PDF payslip with employee notification |
| 6.10 | Bank Advice / Transfer File | 📋 Planned | Bank-ready payment file generation |
| 6.11 | Statutory Reports (PF, ESI, PT) | 📋 Planned | Government compliance reports |
| 6.12 | Full & Final Settlement | 📋 Planned | Separation settlement calculation |

---

## Module 7: Performance & Monthly Review

| # | Feature | Status | Description |
|---|---------|--------|-------------|
| 7.1 | Review Cycle Setup | 📋 Planned | Monthly/quarterly/annual cycles |
| 7.2 | Goal / KRA Library | 📋 Planned | Reusable goals and key result areas |
| 7.3 | HOD Monthly Scoring | 📋 Planned | Criteria-based scoring (quality, productivity, teamwork, initiative, discipline) |
| 7.4 | Evidence & Attachments | 📋 Planned | Supporting documents per score |
| 7.5 | Weighted Score Calculation | 📋 Planned | Configurable weights per criterion |
| 7.6 | HR Review & Validation | 📋 Planned | HR checks before management approval |
| 7.7 | Management Approval | 📋 Planned | Final sign-off with actions |
| 7.8 | Monthly Report Card (PDF) | 📋 Planned | Versioned employee report card |
| 7.9 | Increment / Incentive Recommendation | 📋 Planned | Score-linked salary recommendations |
| 7.10 | Corrective Action / PIP | 📋 Planned | Performance improvement plans |
| 7.11 | Performance Dashboard | 📋 Planned | Distribution charts, trends, comparisons |

---

## Module 8: Employee Relations & Discipline

| # | Feature | Status | Description |
|---|---------|--------|-------------|
| 8.1 | Case Dashboard | 📋 Planned | All active disciplinary/grievance cases |
| 8.2 | Grievance Management | 📋 Planned | Employee grievance submission and tracking |
| 8.3 | Disciplinary Incident | 📋 Planned | Incident recording with severity |
| 8.4 | Warning / Show-cause | 📋 Planned | Formal warnings with document generation |
| 8.5 | Investigation Workflow | 📋 Planned | Investigation steps with evidence |
| 8.6 | Corrective Action | 📋 Planned | CAPA with due dates and follow-up |
| 8.7 | Case Closure | 📋 Planned | Resolution with management approval |

---

## Module 9: Loans, Advances & Expenses

| # | Feature | Status | Description |
|---|---------|--------|-------------|
| 9.1 | Loan Request | 📋 Planned | Employee loan application |
| 9.2 | Eligibility Check | 📋 Planned | Auto-check against policy rules |
| 9.3 | Loan Approval Workflow | 📋 Planned | Multi-level approval |
| 9.4 | Disbursement Tracking | 📋 Planned | Record disbursement details |
| 9.5 | Repayment Schedule (EMI) | 📋 Planned | Auto-generated amortization |
| 9.6 | Payroll Deduction Integration | 📋 Planned | Auto-deduct from monthly salary |
| 9.7 | Loan Ledger & Statement | 📋 Planned | Balance tracking and statements |

---

## Module 10: Learning, SOP & Training

| # | Feature | Status | Description |
|---|---------|--------|-------------|
| 10.1 | Course / SOP Catalog | 🔮 Future | Versioned training content library |
| 10.2 | Role Training Matrix | 🔮 Future | Role-based mandatory training |
| 10.3 | Training Assignment | 🔮 Future | Assign and track completion |
| 10.4 | Assessment & Certification | 🔮 Future | Post-training evaluation |
| 10.5 | Expiry & Retraining Queue | 🔮 Future | Auto-detect expired certifications |
| 10.6 | Training Compliance Dashboard | 🔮 Future | GxP training compliance metrics |

---

## Module 11: Recruitment & Onboarding

| # | Feature | Status | Description |
|---|---------|--------|-------------|
| 11.1 | Manpower Requisition | 🔮 Future | Budget-approved hiring requests |
| 11.2 | Job Posting & Candidate Pipeline | 🔮 Future | Recruitment tracking |
| 11.3 | Interview Scheduling & Feedback | 🔮 Future | Structured interview process |
| 11.4 | Offer Approval & Letter | 🔮 Future | Offer workflow with template |
| 11.5 | Preboarding Portal | 🔮 Future | Document collection before joining |
| 11.6 | Onboarding Checklist | 🔮 Future | Induction, training, asset allocation |
| 11.7 | Probation & Confirmation | 🔮 Future | Probation review workflow |

---

## Module 12: Offboarding & Full-and-Final

| # | Feature | Status | Description |
|---|---------|--------|-------------|
| 12.1 | Resignation Request | 🔮 Future | Online resignation submission |
| 12.2 | Exit Approval & Notice Period | 🔮 Future | LWD calculation |
| 12.3 | Clearance Workflow | 🔮 Future | Multi-department clearance |
| 12.4 | Exit Interview | 🔮 Future | Structured feedback collection |
| 12.5 | F&F Settlement | 🔮 Future | Final settlement calculation |
| 12.6 | Relieving / Experience Letter | 🔮 Future | Auto-generated from template |

---

## Module 13: People Analytics & Reporting

| # | Feature | Status | Description |
|---|---------|--------|-------------|
| 13.1 | Executive Dashboard | 📋 Planned | KPIs: headcount, attrition, cost |
| 13.2 | Attendance & OT Analytics | 📋 Planned | Trends, patterns, compliance |
| 13.3 | Leave Trends | 📋 Planned | Usage patterns, peak periods |
| 13.4 | Performance Distribution | 📋 Planned | Bell curve, department comparison |
| 13.5 | Ad-hoc Report Builder | 🔮 Future | Custom report creation |
| 13.6 | Scheduled Reports | 🔮 Future | Auto-email periodic reports |
| 13.7 | Data Export Center | 📋 Planned | Role-filtered CSV/Excel export |

---

## Frontend (UI) — Design Completed

| # | Screen / Area | Status | Description |
|---|---------------|--------|-------------|
| F1 | Login Page | 📋 Planned | Branded login with MFA support |
| F2 | Admin Dashboard | ✅ Completed (UI) | KPI cards, charts, recent activity |
| F3 | Employee Directory | ✅ Completed (UI) | Search, filter, paginated list |
| F4 | Employee Profile (360) | ✅ Completed (UI) | Tabbed profile with all details |
| F5 | Add Employee Form | ✅ Completed (UI) | Multi-step creation wizard |
| F6 | Attendance Pages | ✅ Completed (UI) | Dashboard, exceptions, compliance |
| F7 | Leave Pages | ✅ Completed (UI) | Balance, apply, approval queue |
| F8 | Compliance Pages | ✅ Completed (UI) | Decisions, discipline, punches |
| F9 | Performance Pages | ✅ Completed (UI) | Reviews, scores, report cards |
| F10 | Payroll Pages | ✅ Completed (UI) | Salary, increments, processing |
| F11 | Configuration Pages | ✅ Completed (UI) | Grades, holidays, shifts |
| F12 | Inbox/Notifications | ✅ Completed (UI) | Task inbox with actions |
| F13 | Sidebar Navigation | ✅ Completed (UI) | Module-based navigation |
| F14 | Reusable Components | ✅ Completed (UI) | Table, Drawer, Modal, KPI Cards, Charts, Filters |

**Note:** Frontend UI is built with static/dummy data. Backend API integration (wiring to real data) is the next step.

---

## Technical Highlights

| Area | Implementation |
|------|---------------|
| Frontend | Next.js 16, React 19, TypeScript, TanStack React Query, ECharts |
| Backend | NestJS 10, TypeScript, TypeORM, MySQL |
| Authentication | JWT + Refresh Token Rotation + TOTP MFA |
| Authorization | 3-layer: Permission → Data Scope → Field Sensitivity |
| Database | MySQL 8 (MariaDB) via phpMyAdmin |
| Security | Helmet, CORS, rate limiting, input validation, XSS protection |
| Audit | Append-only event log, every mutation tracked |
| Documents | Versioned file storage with templates |
| Notifications | Multi-channel (in-app, email, SMS, WhatsApp) |

---

## Delivery Phases

| Phase | Scope | Timeline |
|-------|-------|----------|
| **Phase 1 (MVP)** | Platform + Core HR + Time + Leave + Self-Service | Weeks 1–4 |
| **Phase 2** | Payroll & Statutory | Weeks 5–6 |
| **Phase 3** | Performance + Employee Relations | Weeks 7–8 |
| **Phase 4** | Training + Recruitment + Onboarding + Contractor | Weeks 9–12 |
| **Phase 5** | Offboarding + Advanced Analytics + Reports | Weeks 13–14 |

---

## Summary Counts

| Metric | Count |
|--------|-------|
| Total Features | 130+ |
| ✅ Completed (Backend) | 38 |
| ✅ Completed (Frontend UI) | 14 screens |
| 🔧 In Progress | 2 |
| 📋 Planned (Next Phases) | 60+ |
| 🔮 Future Roadmap | 30+ |
| Total Screens (Full Product) | 183 |
| User Roles Supported | 16 |
| API Endpoints (Built) | 58+ |

---

*This document is for client discussion purposes. Feature details, timelines, and priorities are subject to change based on project decisions.*
