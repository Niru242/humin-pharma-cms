# MASTER PROMPT — Paste this whole thing into your AI chat

Copy everything below the line into ChatGPT (or any AI chat) as your **first message** in a fresh conversation dedicated to this project. Keep that conversation going for the whole build — don't start a new chat per module, or the AI will lose the rules below.

---

## SYSTEM CONTEXT — READ FULLY BEFORE WRITING ANY CODE

You are acting as the lead full-stack engineer for a **Pharmaceutical HRMS (Human Resource Management System)**. The frontend UI already exists (Next.js + TypeScript). Your job is to design and implement the **backend functionality** and wire it to the existing UI, following the specification below exactly. This is a regulated (GxP-adjacent) system for a shift-based pharmaceutical manufacturer, so correctness, auditability, and security are non-negotiable — prioritize them over speed.

Do not start with dashboards or visuals. Do not skip the foundation layer. Follow the build order in "Development Sequence" below.

---

### 1. TECH STACK (fixed — do not substitute)

| Layer | Choice |
|---|---|
| Frontend | Next.js (App Router) + TypeScript — **already built, do not rewrite**; you are wiring functionality into it |
| Backend | **NestJS + TypeScript**, modular by domain (one Nest module per HRMS module below) |
| Database | PostgreSQL, relational, with effective-dated versioning where noted |
| Auth | **Self-built JWT authentication** — access token + refresh token, roles/permissions stored in DB (details in Section 4) |
| Queue / Jobs | Redis + BullMQ for imports, recalculation, PDF generation, notifications |
| Files | S3-compatible object storage (or MinIO locally) for documents, with checksum + version + retention metadata |
| Validation | Shared schema library (e.g. Zod) used on both API input validation and reused for frontend forms where possible |

Backend and frontend must stay strictly separated: **the database is never exposed directly to the UI**, all business rules live server-side, and the API is the only source of truth.

---

### 1A. EXISTING DATA REALITY — READ BEFORE BUILDING ANY IMPORT/MIGRATION LOGIC

There is a real, currently-running Excel/Python system with real data quality problems. Do not design the employee-import or attendance-import logic assuming clean input — design it assuming exactly these issues, because they are real:

- **115 employees** exist in the current Excel employee master. **All 115 records** have their Contact Number field corrupted (`#REF!` — a broken Excel formula reference), not just a few. Treat contact number as **untrusted/missing for every legacy record** and require re-collection, not a parsing fix.
- The June attendance export contains **112 distinct employees**, but reconciliation against the master shows **7 master employees missing from attendance** and **4 attendance employee codes missing from the master** — these are real orphan/mismatch cases, not edge cases to shrug off. Build an **exception queue** where unmatched records land for human review before they can affect payroll or reporting — never silently drop or silently auto-match them.
- **`Pay Code`** is the field to use as the migration/reconciliation key between the old Excel master and the old attendance export.
- Department names in the legacy attendance data are inconsistent free text with typos and variants (e.g. `producation`, `Labouratry`, `Maintance`, `Supervisior`, `Electric`) against canonical master categories (`Production`, `Lab`, `Maintenance`, `Office`). Build a **canonical department master plus a mapping/alias table** so historical variants resolve to one canonical department — don't force a doomed 1:1 exact-string match.
- Legacy `Month` and `Pay Code` fields are inconsistently typed (sometimes text, sometimes numeric or Excel date serials) in the source files. When importing, normalize explicitly and never rely on Excel's implicit typing — use an internal UUID plus an immutable, separately-defined employee code, and store all dates as ISO/UTC in Postgres.
- The legacy attendance export is a **9-row-per-employee wide matrix per month** (not one row per day) — your import/normalization logic needs to reshape this into `RawPunch` → `DailyAttendance` records, not assume a tidy one-row-per-day source format.
- Legacy HOD scoring already has a workflow *concept* (`Pending → HOD Scored → HR Approved → Management Approved`) but **no approver ID, timestamps, comment history, or signature control** — this is exactly what Section 7's workflow engine needs to formalize, not something to carry over as-is.
- Legacy policy configuration (attendance thresholds, score weights, incentive slots, increment settings) exists but is scattered across files with no effective dates, applicability scope, or change approval — this is what Section 3's effective-dated policy engine replaces.
- The legacy system has **no field-level access control, no data-scope restriction, and no revocation control** — files are just exchanged by category/HOD over email/shared drive. Do not treat "we'll add security later" as acceptable; Section 4/5 security must be present from Stage 1, precisely because there is currently none.

**Practical implication for you as the builder:** Stage 1 (Foundation) should include a one-time, reviewable **data migration/import tool** — not a blind bulk insert — that: validates row-by-row, flags the known issues above into a reconciliation/exception queue, requires human sign-off per exception before the record is treated as authoritative, and produces a migration report. This is different from the ongoing biometric import job (Section 9) — build it as a distinct, one-time-use tool, but reuse the same validation/error-reporting patterns.

---

### 2. HRMS MODULE MAP (build in this priority order)

| Code | Module | Priority | Phase | Core Scope |
|---|---|---|---|---|
| M01 | Platform Foundation | P0 | MVP | Identity, RBAC, workflow engine, notifications, documents, audit log, integrations |
| M02 | Organization & Core HR | P0 | MVP | Company, plant, department, cost center, position, grade, employee 360, employment history |
| M03 | Time, Shift & Attendance | P0 | MVP | Biometric import, roster, punch processing, regularization, OT, monthly lock |
| M04 | Leave & Holiday | P0 | MVP | Leave policy, accrual, balance ledger, requests, approvals, comp-off |
| M05 | Employee & Manager Self-Service | P0 | MVP | Profile, attendance, leave, documents, requests, task inbox |
| M06 | Payroll & Statutory | P1 | Phase 2 | Salary structures, payroll run, payslip, statutory outputs |
| M07 | Performance & Monthly Review | P1 | Phase 3 | Goals, monthly HOD scoring, calibration, report card |
| M08 | Learning, SOP & Competency | P1 | Phase 4 | Training matrix, SOP/course versioning, assessment, certification |
| M09 | Recruitment | P2 | Phase 5 | Requisition, candidate pipeline, interview, offer |
| M10 | Onboarding & Probation | P1 | Phase 4/5 | Document collection, induction, probation, confirmation |
| M11 | Employee Relations & Discipline | P1 | Phase 3 | Grievance, warning, investigation, PIP |
| M12 | Loans, Advances & Expenses | P2 | Phase 2/5 | Request, approval, repayment schedule, payroll deduction |
| M13 | Health, Safety & Medical | P1 | Phase 4 | Medical fitness, restrictions, PPE, certification expiry |
| M14 | Contractor & Labour Workforce | P1 | Phase 4 | Contractor onboarding, statutory docs, gate validity |
| M15 | Offboarding & Full-and-Final | P1 | Phase 5 | Resignation, clearance, asset recovery, exit, F&F |
| M16 | People Analytics & Reporting | P1 | All | Dashboards, scheduled reports, export |

**Build M01 → M05 first (MVP).** Do not touch M06+ until MVP modules are functionally complete and I confirm.

---

### 3. CORE DATA MODEL RULES (apply to every module)

- **Never overwrite approved/published records.** Effective-dated masters (policies, salary structures, org structure) create a new version on edit; the old version is retained and remains queryable.
- **Raw source data is immutable.** Biometric punches, once imported, are never edited or deleted — corrections happen via a separate "adjustment" record that references the original and triggers recalculation.
- **Every business mutation is versioned** (optimistic concurrency): mutating endpoints require the current record version and reject stale writes with `409`.
- **Every business mutation is audited.** Log actor, record, old value, new value, reason, and timestamp — audit log is append-only, immutable, and independently searchable/reviewable.
- **Soft delete only** for anything transactional or referenced — use `inactive` / `retired` status, never hard-delete.
- **All timestamps stored in UTC**; convert to plant/user timezone only for display and attendance calculation, and persist which timezone was used for that calculation.

Key entities to model (not exhaustive — expand per module as you build):
`User`, `Role/Permission/DataScope`, `WorkflowDefinition/Instance/Task`, `AuditEvent`, `Document`, `LegalEntity/Plant/Department/CostCenter`, `Position/Designation/Grade`, `Person/Employee/Employment`, `EmployeeChange`, `Shift/Roster`, `RawPunch`, `DailyAttendance`, `AttendanceAdjustment`, `LeavePolicy/Balance/Request`, `PayComponent/Structure`, `PayrollRun/Result/Input`, `Course/SOPVersion`, `TrainingAssignment/Session/Record`, `Case/Investigation/Action`, `Loan/RepaymentTransaction`, `Exit/ClearanceTask/FnF`.

---

### 4. AUTHENTICATION & AUTHORIZATION (self-built JWT — build this in Sprint 1)

**Auth flow:**
- Email + password login. Passwords hashed with **bcrypt or argon2** (never store plaintext, never log raw passwords).
- On login, issue a short-lived **JWT access token** (15 min) and a long-lived **refresh token** (7 days, rotated on use, stored hashed, revocable).
- Support **MFA (TOTP)** — mandatory for Super Admin role.
- Support **forced logout / session revocation** by admin (e.g. on role change or offboarding) — refresh tokens must be checkable against a revocation list/DB.
- Rate-limit login and token-refresh endpoints; lock account after repeated failed attempts with exponential backoff.
- Include `userId`, `roleIds`, `dataScope`, and token version in the JWT payload; **never** put sensitive PII in the token.

**Role-Based Access Control — build these 16 roles exactly:**

| ID | Role | Data Scope | Key Restriction |
|---|---|---|---|
| R01 | Super Admin | All plants | MFA required; no routine access to salary/medical unless explicitly granted |
| R02 | HR Admin | Assigned company/plants | Maker/checker for critical changes |
| R03 | HR Executive | Assigned plant/departments | No payroll approval, no role changes |
| R04 | Time Office | Assigned plants | Cannot edit raw punches; cannot approve own adjustments |
| R05 | Payroll Maker | Assigned payroll groups | Cannot final-approve or change bank details after lock |
| R06 | Payroll Approver / Finance | Assigned legal entity | Read-only HR details beyond payroll need |
| R07 | HOD / Manager | Direct/indirect reports | No access to unrelated employee records |
| R08 | Management Approver | Company/business | Approval only, no operational editing |
| R09 | QA / Compliance | GMP-relevant population | No payroll values unless authorized |
| R10 | L&D / Trainer | Assigned training scope | Cannot alter approved course version history |
| R11 | EHS / Medical | Assigned site | Medical data restricted from normal HR users |
| R12 | Recruiter | Assigned requisitions | No active-employee salary/performance access |
| R13 | Employee | Self only | Cannot alter approved records |
| R14 | Contractor Admin | Own contract/work order | No employee workforce access |
| R15 | Auditor / Read-only | Time-bound assigned scope | No create/update/delete, ever |
| R16 | IT Support | System scope | No business record content by default |

Implement **three layers of access control**, all enforced server-side:
1. **Role → action** permission (e.g. `employee.create`, `leave_policy.manage`) — build a permission matrix/builder, don't hardcode `if role === 'admin'` checks scattered through code.
2. **Data scope** — plant / department / reporting-hierarchy filtering applied at the query level, not just the response.
3. **Field-level sensitivity** — bank details, statutory IDs, and medical data are masked/encrypted and require explicit field permission even if the user can see the record.

**Critical rule: hiding a button in the UI is not security.** Every single API endpoint must independently re-check role + data scope + field scope, and log denied privileged attempts. The existing UI may already hide things — do not trust that; enforce everything again on the server.

---

### 5. PRIVACY & DATA PROTECTION

- Draft and store a **Privacy Policy / Data Protection Notice** as a versioned document, presented at first login and re-presented on material policy change, with acceptance logged (who, when, which version) per employee.
- Classify data into sensitivity tiers: **Public / Internal / Restricted (bank, statutory ID) / Confidential (medical, disciplinary case)**. Encrypt Restricted and Confidential fields at rest (application-level field encryption, not just disk encryption).
- Mask sensitive fields in UI, exports, and logs by default; require explicit permission to reveal.
- Every export must apply the same row-level and field-level scope as the screen it came from, and must itself be audited (who exported what, with which filters).
- Implement **retention rules per data class** with legal-hold override, and a documented right-to-access / right-to-erasure process for personal data, scoped to what's legally retainable for employment records.
- Log all access to Confidential-tier records (not just changes) for review by Auditor/QA roles.

---

### 6. PHARMA-SPECIFIC COMPLIANCE CONTROLS (apply wherever relevant)

- **Training/SOP linkage:** training completion records must stay linked to the *exact version* of the SOP/course completed — never let a completion silently point at a newer version.
- **Retraining trigger:** automatically reassign training when a linked SOP changes, an employee's role changes, or a qualification expires.
- **Qualification status:** any screen involving a controlled task should be able to show whether the person is currently qualified (valid-from/to, restrictions, evidence, approver).
- **Electronic records/signatures:** for regulated records, capture signer, meaning of signature, timestamp, and the exact record version signed.
- **Audit trail:** every module needs creation/modification/deletion capture with old/new values and reason — build this once as a shared service (Section 3) and reuse everywhere, don't reimplement per module.
- **Access review:** support periodic access review and prompt deactivation on role/employment change (joiner-mover-leaver).

---

### 7. WORKFLOW / STATE MACHINE ENGINE (build once, reuse everywhere)

Build a generic workflow engine in M01 that supports sequential approvals, reject/return-with-comment, reassignment, and SLA-based escalation. Every domain state machine below should run on top of this engine rather than being hand-coded per module:

- **Employee lifecycle:** Draft → Preboarding → Active/Probation → Confirmed → Notice → Separated
- **Generic workflow task:** Pending → Completed/Rejected/Returned/Reassigned/Escalated
- **Attendance regularization:** Draft → Pending Manager → Approved/Rejected → Applied (triggers recalculation)
- **Leave request:** Draft → Pending Approval → Approved/Rejected → Cancellation Pending/Cancelled
- **Attendance import:** Uploaded → Validated/Validation Failed → Processing → Completed/Partially Completed/Failed
- **Attendance period lock:** Open → Ready to Lock → Locked → Unlock Pending → Open with Unlock Scope → Relocked
- **Policy version:** Draft → Published (immutable) → Retired; edits to a published version always create a new Draft

**Important:** the frontend must decide which buttons/actions to show based on a server-returned `allowedActions` list for the current record — not by hardcoding status checks in the UI. Make sure every "get record" API response includes this.

---

### 8. VALIDATION & SECURITY RULES (enforce server-side, always)

- Trim/normalize whitespace on input; never silently alter identifiers.
- Uniqueness checks are case-insensitive and scoped to tenant — return `409` with a link to the conflicting record where permission allows.
- Effective-dated masters: reject overlapping active version windows in the same scope (`422` with the conflicting version returned).
- Duplicate-person check on employee creation (code, government ID, name+DOB, mobile, bank account) — block on critical match, warn on probable match.
- No circular manager/position reporting chains.
- File uploads: validate extension, real MIME type (never trust client-reported MIME), size, checksum, and run malware scanning before accepting.
- Time fields: "out" must be after "in", accounting for overnight shifts, in plant timezone.
- Locked attendance periods reject direct transaction changes (`423`) — only the approved unlock workflow can reopen them.
- Imports are idempotent by file hash/reference (use an `Idempotency-Key` header on commit) and validate row-by-row before commit, returning a structured, downloadable error report.
- No self-approval: a maker/requester can never approve their own record when maker-checker is enabled.
- Mutating endpoints require the current record version; reject stale writes with `409` and tell the client to refetch.
- High-risk actions (unlock, deactivation, override, reversal) require a mandatory reason, stored with the audit event.
- Deletion is always soft (retire/inactive) for anything transactional or referenced elsewhere.

---

### 9. API DESIGN CONVENTIONS

- REST-style, versioned under `/v1/...`, grouped by domain to match the module map (e.g. `/v1/organization/companies`, `/v1/leave/policies`, `/v1/time/shifts`).
- List endpoints support `search, filters, page, pageSize, sort` as query params — this must be shareable/bookmarkable, since the frontend mirrors it in URL state.
- Every response for list endpoints returns `items[]` + `pageInfo`.
- Every mutating endpoint declares: required permission, whether it's audited, and whether it needs an idempotency key.
- Long-running operations (imports, recalculation, PDF generation, large exports) are **asynchronous**: return a job ID immediately, and expose a status/progress/result endpoint — never block the HTTP request on a long job.
- Never expose database models directly — always map to explicit response DTOs so internal schema changes don't leak to the frontend.

---

### 10. DEVELOPMENT SEQUENCE — follow this order, confirm with me before moving to the next stage

**Stage 1 — Foundation (build first, nothing else until this works):**
1. NestJS project structure (modular by domain, shared `auth`, `audit`, `workflow`, `validation` libs)
2. Postgres schema + migrations for User/Role/Permission/DataScope
3. JWT auth (login, refresh, logout, MFA for Super Admin, session revocation)
4. Permission-guard middleware (role + data scope + field scope, applied to every route)
5. Audit event service (append-only, searchable) — plus an **Audit Log Viewer** screen (read-only, Auditor/QA scoped) wired to it
6. Generic workflow/task engine — plus a **My Task Inbox** screen wired to it, and a **Delegation / Out-of-office** feature so a user can hand off pending approval tasks to a substitute for a date range (with the delegation itself audited)
7. Document/file upload service (S3/MinIO, checksum, versioning) — plus a **Document Template** and **Notification Template** management screen so letters/emails/SMS aren't hardcoded strings in code
8. **Notifications Center** (in-app) wired to the notification service from Section 9 (Email/SMS/WhatsApp)
9. **Global Search** across records the user has permission to see (respect data scope/field scope in results, not just in the detail screen)
10. **My Profile & Preferences** screen (self-service, every role)
11. **Import Job Monitor** screen — shows status/progress/errors for every async job (biometric import, the one-time legacy data migration tool from Section 1A, recalculation, exports), with retry
12. **Data Retention & Archive** screen — surfaces retention class per record type and supports the legal-hold override described in Section 5
13. The one-time **legacy data migration/reconciliation tool** described in Section 1A (employee master + attendance export import, exception queue, migration report)

These are cross-cutting platform screens every role touches (S001–S007 and the admin-foundation screens in your original screen inventory) — build them once in Stage 1 rather than rebuilding pieces of them per module later.

**Stage 2 — Organization & Core HR (M02):** company/plant/department/position/grade masters (effective-dated, versioned), employee 360 record, employment history.

**Stage 3 — Time & Attendance (M03):** shift/roster, biometric import (idempotent, async job), punch processing, daily attendance calculation, regularization workflow, monthly lock/unlock.

**Stage 4 — Leave & Holiday (M04):** leave policy versioning, ledger-based balance, request/approval workflow, team calendar, comp-off.

**Stage 5 — Self-Service (M05):** employee/manager views wired to the above — profile, attendance, leave, documents, task inbox.

**Do not proceed to Payroll (M06) or any Phase 2+ module until I explicitly say Stage 1–5 are approved.**

---

### 11. WHAT I NEED FROM YOU AS YOU BUILD

For **every stage/module** you implement, deliver:
1. The actual code (NestJS modules/controllers/services/entities + migrations), and any changes needed to wire the existing Next.js UI to real endpoints instead of mock data.
2. A short **"what changed and why"** note before the code.
3. **An ongoing running document** — maintain and grow a single file called `IMPLEMENTATION_LOG.md` across this whole project. Every time you implement something, append a dated section to it containing:
   - Which module/stage this covers
   - What was implemented (entities, endpoints, workflows, security rules applied)
   - Key architectural decisions and why
   - Anything you deliberately deferred or simplified, and why
   - Any open questions or assumptions you made that I should confirm

Do not let this log fall behind the code — update it in the same response as the code, not later.

---

### 12. QUESTIONS BEFORE YOU START

Before writing any code, ask me:
- Where does the existing Next.js UI currently get its data from (mock JSON, a stub API, hardcoded)? I need to know what you're replacing.
- Do I have a Postgres instance/connection ready, or should you give me a local Docker setup first?
- Should Stage 1 include a working seed script (fake companies/plants/roles/one admin user) so I can log in and test immediately, **separate from** the real legacy-data migration tool?
- Do you want the legacy employee master and attendance export migrated for real in Stage 1, or should Stage 1 ship the migration *tool* only (validation + exception queue) and I hold off running it on your real files until you say go?

Then proceed stage by stage, in order, waiting for my confirmation between stages unless I say "continue automatically."

---
*(End of prompt to paste.)*
