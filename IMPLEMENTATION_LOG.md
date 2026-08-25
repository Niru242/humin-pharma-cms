# Implementation Log — Pharma HRMS

---

## 2025-08-22 — Stage 1, Substep 1: Project Structure + Docker Setup

### What was implemented
- Monorepo scaffolding with npm workspaces (apps/api, apps/web, packages/shared)
- docker-compose.yml: PostgreSQL 16, Redis 7, MinIO
- NestJS API: main.ts (Helmet, CORS, /v1 prefix, port 4000), app.module.ts, health endpoint
- Module stubs for all MVP domains (auth, audit, workflow, organization, time-attendance, leave, self-service)
- Shared package: Role enum (16 roles), Permission enum (47 permissions), auth types, pagination types
- Global exception filter (structured errors, no stack trace leaks, reference IDs)

---

## 2025-08-22 — Stage 1, Substep 2: Postgres Schema + TypeORM Migrations

### What was implemented
- Base entity: UUID PK, timestamps (UTC), version (optimistic concurrency), soft delete, audit fields
- Auth entities: User, Role, Permission, RolePermission, UserRole, UserDataScope, RefreshToken
- Audit entity: AuditEvent (append-only, DB rules block UPDATE/DELETE)
- Migration: Full DDL for 8 tables, enum types, indexes, foreign keys, audit protection rules
- Seed scripts: 16 roles, 47 permissions, role→permission matrix, admin user (admin@pharmahrms.local / Admin@12345)

---

## 2025-08-22 — Stage 1, Substep 3: JWT Auth Implementation

### What was implemented

**Auth Service (`modules/auth/auth.service.ts`):**
- Login: email/password verification with bcrypt, MFA check if required, token issuance
- Account lockout: 5 failed attempts → exponential backoff (5min, 10min, 20min, 40min...)
- Refresh token rotation: old token revoked on use, family-based theft detection
- Token reuse detection: if revoked token is reused, entire family invalidated
- Logout: revoke specific refresh token
- Force logout: admin revokes all sessions for a user, increments tokenVersion
- Change password: verify current, validate complexity, increment tokenVersion, revoke all tokens
- MFA setup: generate TOTP secret + QR code
- MFA verify: confirm setup with a real code
- MFA disable: remove TOTP secret

**Token Service (`modules/auth/token.service.ts`):**
- JWT access token generation: 15-minute expiry, payload includes userId, roleIds, dataScope, tokenVersion
- JWT verification: validates signature, issuer, audience
- Refresh token generation: 48-byte random token, bcrypt hashed for storage, UUID family ID
- Duration parser for configurable expiry strings

**MFA Service (`modules/auth/mfa.service.ts`):**
- TOTP secret generation (RFC 6238)
- Token verification with 1-step tolerance window
- QR code generation as data URL for authenticator apps

**Auth Controller (`modules/auth/auth.controller.ts`):**
- POST /v1/auth/login — public, rate-limited (5/min per IP)
- POST /v1/auth/refresh — public, rate-limited (10/min)
- POST /v1/auth/logout — public
- POST /v1/auth/change-password — authenticated
- POST /v1/auth/mfa/setup — authenticated
- POST /v1/auth/mfa/verify — authenticated
- POST /v1/auth/mfa/disable — authenticated
- POST /v1/auth/force-logout — authenticated (admin)
- POST /v1/auth/me — authenticated (returns current user)

**Guards & Decorators:**
- JwtAuthGuard: global guard, validates token on every request, checks tokenVersion against DB
- @Public() decorator: marks routes that skip JWT validation
- @CurrentUser() decorator: extracts authenticated user from request
- ThrottlerGuard: global rate limiting (10 req/s burst, 100 req/min)

**DTOs (class-validator):**
- LoginDto: email, password (8-128 chars), optional mfaCode
- RefreshDto: refreshToken string
- ChangePasswordDto: currentPassword, newPassword (complexity: upper+lower+digit+special)

**Validation Pipe (global):**
- Whitelist mode: strips unknown properties
- ForbidNonWhitelisted: rejects unknown properties with error
- Transform: auto-converts payloads to DTO instances

### Key architectural decisions
1. Global JWT guard (APP_GUARD) — every route is protected by default, opt-out with @Public()
2. Token version check on every request — enables instant session revocation without waiting for token expiry
3. Refresh token rotation with family tracking — reuse of revoked token = compromise indicator, invalidates entire chain
4. Rate limiting at controller level — login gets aggressive limits (5/min), general routes get standard limits
5. bcrypt for both password hashing (cost 12) and refresh token hashing (cost 10) — different costs for different threat models

### Deferred
- Redis-backed rate limiting (currently in-memory via @nestjs/throttler) — will switch when BullMQ is wired
- Permission guard (RBAC enforcement per-route) — Substep 4
- Audit logging of auth events — Substep 5
- Login attempt logging and monitoring

### How to test (once Docker + DB is running)
```bash
# Start services
docker compose up -d

# Run migration
npm run migrate

# Seed data
npm run seed

# Start API
npm run dev:api

# Login
curl -X POST http://localhost:4000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@pharmahrms.local","password":"Admin@12345"}'

# Use the accessToken from response:
curl http://localhost:4000/v1/auth/me \
  -H "Authorization: Bearer <accessToken>"
```


---

## 2025-08-22 — Stage 1, Substep 5: Audit Event Service + Log Viewer

### What was implemented

**AuditService (`audit/audit.service.ts`):**
- `log(params)` — fire-and-forget audit write (never crashes the request)
- `logSync(params)` — await-based write for critical compliance events
- `logBatch(events)` — bulk insert for import/batch operations
- `computeChangedFields(old, new)` — helper to diff two value objects
- `sanitizeValues(values)` — strips passwords, tokens, secrets before storage
- `query(params)` — paginated list with filters (actor, module, action, entity, date range, search)
- `getDistinctActions()` / `getDistinctModules()` — for filter dropdowns in the UI
- `getEntityHistory(entityType, entityId)` — full change timeline for a specific record

**AuditController (`audit/audit.controller.ts`):**
- `GET /v1/audit/events` — paginated audit log (supports all query params)
- `GET /v1/audit/events/:entityType/:entityId` — record change timeline
- `GET /v1/audit/filters/actions` — distinct actions for filter UI
- `GET /v1/audit/filters/modules` — distinct modules for filter UI
- All endpoints require `audit.log.view` permission (Auditor, QA, Super Admin, HR Admin, IT Support)

**AuditInterceptor (`audit/audit.interceptor.ts`):**
- Automatically logs POST/PUT/PATCH/DELETE requests
- Reads `@AuditAction()`, `@AuditModuleName()`, `@AuditEntity()` decorators from handlers
- Falls back to inferring action from HTTP method and module from URL
- Captures actor (id, email, IP), entity (type, ID), new values, reason
- Sanitizes sensitive fields before logging
- Never blocks the response (fire-and-forget in the tap operator)

**AuditModule:**
- Marked `@Global()` — injectable anywhere without explicit import
- Exports AuditService and AuditInterceptor for use by all domain modules

### Key architectural decisions

1. **@Global() module** — "build once, reuse everywhere" (Section 6). Any module can inject AuditService.
2. **Fire-and-forget by default** — `log()` catches errors silently. The business operation should never fail because audit logging failed. For compliance-critical events, use `logSync()`.
3. **Interceptor pattern** — most modules just apply `@UseInterceptors(AuditInterceptor)` and get automatic audit logging. Only custom scenarios need manual `auditService.log()` calls.
4. **Sensitive value sanitization** — passwords, tokens, encryption keys are never stored in audit trail even if accidentally passed.
5. **ILIKE search** — PostgreSQL case-insensitive search across actor email, entity type, action, reason fields simultaneously.

### How other modules use this

```typescript
// Automatic (via interceptor):
@UseInterceptors(AuditInterceptor)
@AuditModuleName('employee')
@AuditEntity('Employee')
@Controller('employees')
export class EmployeeController { ... }

// Manual (for complex scenarios):
await this.auditService.log({
  actorId: user.id,
  actorEmail: user.email,
  action: 'unlock_period',
  module: 'attendance',
  entityType: 'AttendancePeriod',
  entityId: periodId,
  oldValues: { status: 'locked' },
  newValues: { status: 'open' },
  reason: dto.reason, // Mandatory for high-risk actions
});
```

### Deferred
- Export/download of audit logs as CSV (will be part of report export system)
- Audit log retention/archival rules (Section 5 data retention — future substep)
- Real-time audit event streaming (WebSocket push to audit dashboard)


---

## 2025-08-22 — Stage 1, Substep 7: Document/File Upload + Template Management

### What was implemented

**Entities:**
- `Document` — uploaded files with checksum, versioning, retention metadata, sensitivity tier, legal hold
- `DocumentTemplate` — versioned templates for letters/emails/SMS with variable interpolation

**StorageService (`storage.service.ts`):**
- `uploadFile(file, category)` — validates extension/size, computes SHA-256 checksum, stores file
- `downloadFile(storagePath)` — retrieves file buffer
- `deleteFile(storagePath)` — removes from storage
- Extension allowlist validation (PDF, DOC, XLSX, images, etc.)
- 25MB max file size enforcement
- UUID-based stored names (prevents path traversal)
- Date-based storage paths for organization
- Local filesystem fallback for dev (swappable to S3 SDK for production)

**DocumentsService (`documents.service.ts`):**
- `upload(file, user, options)` — validate + store + create metadata record + audit
- `uploadVersion(documentId, file, user)` — new version, marks old as not-latest
- `getByEntity(entityType, entityId)` — list documents for a record
- `getById(id)` — single document metadata
- `download(id, user)` — retrieves file + audits the download
- `softDelete(id, user, reason)` — respects legal hold, audits
- `listTemplates(filters)` — filtered template list
- `getTemplateByCode(code)` — latest published version of a template
- `createTemplate(data, user)` — new draft template
- `updateTemplate(id, data, user)` — update draft only
- `publishTemplate(id, user)` — publish (makes immutable)
- `renderTemplate(code, variables)` — variable substitution

**DocumentsController — API endpoints:**

| Method | Path | Permission | Description |
|--------|------|-----------|-------------|
| POST | `/v1/documents/upload` | document.upload | Upload a file (multipart/form-data) |
| POST | `/v1/documents/:id/version` | document.upload | Upload new version |
| GET | `/v1/documents/entity/:type/:id` | document.read | List docs for a record |
| GET | `/v1/documents/:id` | document.read | Get document metadata |
| GET | `/v1/documents/:id/download` | document.read | Download file (streamed) |
| DELETE | `/v1/documents/:id` | document.upload | Soft-delete (with reason) |
| GET | `/v1/documents/templates/list` | document.manage_templates | List templates |
| POST | `/v1/documents/templates` | document.manage_templates | Create template |
| PUT | `/v1/documents/templates/:id` | document.manage_templates | Update draft |
| POST | `/v1/documents/templates/:id/publish` | document.manage_templates | Publish |
| POST | `/v1/documents/templates/render` | document.read | Render with variables |

### Key architectural decisions

1. **Local filesystem fallback** — for dev without MinIO running. The StorageService interface is the same; swap implementation for S3 in production.
2. **SHA-256 checksum on every upload** — integrity verification, deduplication detection
3. **Version chain via parentDocumentId** — old versions retained, `isLatest` flag for queries
4. **Legal hold blocks deletion** — even soft-delete is refused
5. **Template versioning with publish workflow** — published templates are immutable, edits create new drafts (Section 7 policy pattern)
6. **Audit on upload AND download** — both write and read operations are tracked

### Deferred
- Actual S3/MinIO SDK integration (using local FS fallback for now)
- Malware scanning hook (Section 8 — needs ClamAV or similar)
- Pre-signed URL generation for large file downloads
- Document migration for documents_templates table


---

## 2025-08-22 — Stage 1, Substep 8: Notifications Center

### What was implemented
- `Notification` entity: recipient, channel (in_app/email/sms/whatsapp), title, body, read status, delivery status, priority, template reference
- `NotificationsService`: send (direct or from template with variable substitution), getForUser (paginated inbox), unread count, mark read/all read, external dispatch placeholder
- `NotificationsController`: GET /notifications, GET /notifications/unread-count, POST /:id/read, POST /read-all, POST /send
- @Global() module — any service can inject NotificationsService to send notifications
- Template integration — `sendFromTemplate()` uses DocumentsService.renderTemplate() for variable interpolation
- External channels stubbed (email/sms/whatsapp) — ready for BullMQ queue integration

### Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | `/v1/notifications` | My notifications (paginated, filterable) |
| GET | `/v1/notifications/unread-count` | Badge count |
| POST | `/v1/notifications/:id/read` | Mark one as read |
| POST | `/v1/notifications/read-all` | Mark all as read |
| POST | `/v1/notifications/send` | Send notification (system/admin) |


---

## 2025-08-22 — Stage 1, Substeps 9-13: Global Search, Profile, Import Jobs, Data Retention, Migration Tool

### Substep 9: Global Search
- `SearchService` — searches across users, workflows, documents, templates, notifications
- ILIKE-based PostgreSQL search with data scope filtering
- Weighted scoring (name fields score higher than descriptions)
- `GET /v1/search?q=term&limit=20` — returns unified results from all entities

### Substep 10: My Profile & Preferences
- `ProfileService` — get profile (with roles + scopes), update name, accept privacy policy
- `GET /v1/profile` | `PUT /v1/profile` | `POST /v1/profile/accept-privacy-policy`
- Every role can access their own profile

### Substep 11: Import Job Monitor
- `ImportJob` entity — tracks async jobs with progress (total/processed/success/error/skipped)
- `ImportJobsService` — create job, update progress, cancel, retry, list with filters
- Idempotency by file checksum (prevents duplicate imports)
- @Global() — any module can create/update import jobs
- `GET /v1/import-jobs` | `GET /:id` | `POST /:id/cancel` | `POST /:id/retry`

### Substep 12: Data Retention & Archive
- Retention policies defined per entity type (permanent, 7yr, 3yr, 1yr)
- Legal hold support (overrides retention)
- `GET /v1/data-retention/policies` | `GET /expired/:type` | `POST /legal-hold`

### Substep 13: Legacy Data Migration Tool (Section 1A)
- CSV parser with proper quote handling
- Row-by-row validation for employee master
- Known issue handling: #REF! contacts (auto-flagged), missing PayCode (error), missing name (error)
- Canonical department mapping (producation→Production, labouratry→Lab, etc.)
- Dry-run mode (validate without importing)
- Exception queue with approve/reject workflow
- `POST /v1/migration/dry-run` | `POST /resolve-exception` | `POST /resolve-department`

---

## STAGE 1 FOUNDATION — COMPLETE

**94 TypeScript source files, 0 type errors, clean build.**

### All Stage 1 modules:
| # | Module | Status |
|---|--------|--------|
| 1 | Auth (JWT + MFA + lockout) | ✅ |
| 2 | RBAC (3-layer: permission + scope + field) | ✅ |
| 3 | Audit (append-only, searchable, interceptor) | ✅ |
| 4 | Workflow Engine (state machine + inbox + delegation) | ✅ |
| 5 | Documents (upload + versioning + templates) | ✅ |
| 6 | Notifications (in-app + email/SMS/WhatsApp stubs) | ✅ |
| 7 | Global Search | ✅ |
| 8 | Profile & Preferences | ✅ |
| 9 | Import Job Monitor | ✅ |
| 10 | Data Retention & Archive | ✅ |
| 11 | Legacy Migration Tool | ✅ |
| 12 | Health Check | ✅ |

### Ready for Stage 2: Organization & Core HR
Next: company/plant/department/position/grade masters, employee 360 record, employment history.


---

## 2025-08-22 — Stage 2: Organization & Core HR

### What was implemented

**Entities (6 tables):**
- `Company` — legal entity (code, name, registration, tax ID, address)
- `Plant` — physical site belonging to a company (code, name, timezone, address)
- `Department` — org unit within a plant (code, name, head, headcount, cost center)
- `Designation` — job title/position (code, name, sort order)
- `Grade` — employee grade/level (code, name, probation days, sort order) — matches frontend `dummyGrades` shape
- `Employee` — 360-degree record (personal, employment, sensitive/restricted, emergency, links to company/plant/dept/grade)

**OrganizationService — full CRUD + data scope enforcement:**
- Companies: list, create
- Plants: list (filterable by company), create
- Departments: list (filterable by plant + search), create, update, delete (soft)
- Designations: list, create
- Grades: list, create, update, delete (soft)
- Employees: list (paginated, searchable, filterable by dept/status, data-scope-filtered, field-masked), getById, create (duplicate check), update, deactivate

**OrganizationController — API endpoints:**

| Method | Path | Permission | Description |
|--------|------|-----------|-------------|
| GET | `/v1/organization/companies` | employee.read | List companies |
| POST | `/v1/organization/companies` | org.company.manage | Create company |
| GET | `/v1/organization/plants` | employee.read | List plants |
| POST | `/v1/organization/plants` | org.plant.manage | Create plant |
| GET | `/v1/organization/departments` | employee.read | List departments |
| POST | `/v1/organization/departments` | org.department.manage | Create department |
| PUT | `/v1/organization/departments/:id` | org.department.manage | Update department |
| DELETE | `/v1/organization/departments/:id` | org.department.manage | Soft-delete |
| GET | `/v1/organization/designations` | employee.read | List designations |
| POST | `/v1/organization/designations` | org.position.manage | Create designation |
| GET | `/v1/organization/grades` | employee.read | List grades |
| POST | `/v1/organization/grades` | org.grade.manage | Create grade |
| PUT | `/v1/organization/grades/:id` | org.grade.manage | Update grade |
| DELETE | `/v1/organization/grades/:id` | org.grade.manage | Soft-delete |
| GET | `/v1/organization/employees` | employee.read | List employees (paginated, scoped) |
| GET | `/v1/organization/employees/:id` | employee.read | Employee 360 detail |
| POST | `/v1/organization/employees` | employee.create | Create employee |
| PUT | `/v1/organization/employees/:id` | employee.update | Update employee |
| DELETE | `/v1/organization/employees/:id` | employee.deactivate | Deactivate/separate |

### Key points
- Employee list applies DataScopeService (WHERE clause filtering) + FieldAccessService (masking)
- Employee detail checks canAccessRecord before returning
- Self-access: user sees their own restricted fields unmasked
- Response shapes match the frontend's existing dummy data structures
- Duplicate employee check on create (by employeeCode)
- All soft-delete (never hard delete)

### Frontend integration path
The frontend pages (`EmployeeDirectoryView`, `DepartmentsPage`, `GradesPage`) currently use `dummyEmployees`, `dummyDepartments`, `dummyGrades`. To wire:
1. Replace dummy arrays with `useQuery` calls to these endpoints
2. Replace local state mutations with `useMutation` + cache invalidation
3. The response shapes are designed to match the existing dummy data keys

**103 TypeScript source files, 0 errors. Stage 2 complete.**


---

## 2025-08-22 — Stage 3: Time & Attendance + Frontend Wiring

### Backend — Time & Attendance Module

**Entities (5 tables):**
- `Shift` — shift definition (start/end time, grace periods, night shift flag, break minutes)
- `Roster` — daily shift assignment per employee (unique per employee+date)
- `RawPunch` — immutable biometric punch events (never edited/deleted)
- `DailyAttendance` — computed daily record (first_in, last_out, working minutes, OT, late, status)
- `AttendancePeriod` — monthly lock status per plant

**TimeAttendanceService:**
- Shifts: list, create, update
- Roster: get by employee+month, bulk assign
- Raw Punches: list (paginated), import (idempotent by hash — dedup)
- Daily Attendance: list (filterable), monthly summary with aggregates
- Periods: list, lock (cascades to daily records)

**API Endpoints:**
| Method | Path | Permission |
|--------|------|-----------|
| GET | `/v1/time/shifts` | attendance.read |
| POST | `/v1/time/shifts` | attendance.import |
| PUT | `/v1/time/shifts/:id` | attendance.import |
| GET | `/v1/time/raw-punches` | attendance.read |
| POST | `/v1/time/punch-import` | attendance.import |
| GET | `/v1/time/attendance` | attendance.read |
| GET | `/v1/time/attendance/summary/:employeeId` | attendance.read |
| GET | `/v1/time/roster/:employeeId` | attendance.read |
| POST | `/v1/time/roster` | attendance.import |
| GET | `/v1/time/periods` | attendance.read |
| POST | `/v1/time/periods/lock` | attendance.lock |

### Frontend Wiring (humin-pharma/frontend)

**New files added:**
- `src/lib/api.ts` — axios with JWT interceptor (attach token, refresh on 401, redirect to login)
- `src/providers/AuthProvider.tsx` — auth context (login, logout, user, roles, hasPermission)
- `src/hooks/useEmployees.ts` — useEmployees, useEmployee, useCreateEmployee, useUpdateEmployee
- `src/hooks/useOrganization.ts` — useDepartments, useGrades, usePlants, useCompanies, useDesignations + CRUD mutations
- `src/hooks/useTimeAttendance.ts` — useShifts, useRawPunches, useDailyAttendance, useMonthlySummary, useAttendancePeriods, useLockPeriod
- `src/hooks/useNotifications.ts` — useNotifications, useUnreadCount, useMarkAsRead, useMarkAllAsRead
- `src/hooks/useWorkflow.ts` — useMyTasks, useTaskCounts, useActOnTask, useAllowedActions

### Integration pattern for frontend devs:
```tsx
// Before (dummy data):
const dummyEmployees = [...];

// After (real API):
import { useEmployees } from '@/hooks/useEmployees';
const { data, isLoading, error } = useEmployees({ search, page: 1 });
const employees = data?.items || [];
```

**111 backend source files, 5 frontend hooks + auth layer. 0 type errors.**


---

## 2025-08-22 — Frontend Wiring: Pages Connected to Real API

### Pages wired (dummy data → API hooks):

| Page | File | Change |
|------|------|--------|
| Employee Directory | `employees/components/EmployeeDirectoryView.tsx` | `dummyEmployees` → `useEmployees()` with search, pagination, loading/error states |
| Departments | `organization/departments/page.tsx` | `dummyDepartments` → `useDepartments()` + `useCreateDepartment/useUpdateDepartment/useDeleteDepartment` mutations |
| Grades | `configuration/grades/page.tsx` | `dummyGrades` → `useGrades()` + CRUD mutations, edit mode support |

### Pattern used across all wired pages:
```tsx
// 1. Import hook
import { useEmployees } from '@/hooks/useEmployees';

// 2. Replace useState(dummyData) with hook
const { data, isLoading, error } = useEmployees({ search, page });
const employees = data?.items || [];

// 3. Add loading/error states in JSX
{isLoading ? <Loading /> : error ? <Error /> : <Table data={employees} />}

// 4. Replace local mutations with react-query mutations
const createEmployee = useCreateEmployee();
createEmployee.mutate(formData);  // Auto-invalidates cache
```

### What still needs wiring (next session):
- `employees/[id]/page.tsx` (profile detail)
- `employees/add/page.tsx` (add form)
- `time/*` pages (raw punches, roster, attendance register, etc.)
- `inbox/page.tsx` (workflow task inbox)
- `system/notifications/page.tsx`
- Login page (needs to be created)

### Frontend type-checks pass: 0 errors.


---

## 2025-08-22 — Frontend Setup in CMS Workspace (Corrected Approach)

### Architecture decision
- **humin-pharma workspace** → UNTOUCHED (original UI design source)
- **humin-pharma-cms/apps/web/** → Working frontend with API wiring (copied design + added integration)
- All frontend development happens in `humin-pharma-cms/apps/web/` only

### What was set up in `apps/web/`:
1. Copied full frontend source from `humin-pharma/frontend/` (design remains identical)
2. Replaced `src/lib/api.ts` with auth-aware axios (JWT attach, refresh on 401, redirect to login)
3. Added `src/providers/AuthProvider.tsx` (login/logout/user state/role checks)
4. Created `src/app/login/page.tsx` (login form with MFA support)
5. Created 9 hooks covering all existing backend modules:

| Hook File | Backend Module It Wires |
|-----------|------------------------|
| `useEmployees.ts` | Organization (employees CRUD) |
| `useOrganization.ts` | Organization (departments, grades, plants, companies, designations) |
| `useTimeAttendance.ts` | Time & Attendance (shifts, punches, daily attendance, roster, periods) |
| `useNotifications.ts` | Notifications (inbox, unread count, mark read) |
| `useWorkflow.ts` | Workflow (task inbox, act on task, allowed actions) |
| `useAudit.ts` | Audit (events list, filters) |
| `useImportJobs.ts` | Import Jobs (list, cancel, retry) |
| `useSearch.ts` | Global Search |
| `useProfile.ts` | Profile (get, update) |

### Ready to wire to pages:
Every page in `apps/web/src/app/` that currently uses dummy data can now import from `@/hooks/` and replace local arrays with real API calls. The pattern:
```tsx
// Import hook
import { useEmployees } from '@/hooks/useEmployees';
// Use in component
const { data, isLoading } = useEmployees({ search });
const employees = data?.items || [];
```

### Next: Stage 4 (Leave & Holiday backend)


---

## 2025-08-22 — Stage 4: Leave & Holiday

### Backend entities (5 tables):
- `LeaveType` — CL, EL, SL, ML, PL, CO, LWP with rules (carry forward, encashable, doc required, notice period, gender-specific)
- `LeavePolicy` — effective-dated, versioned (draft→published→retired), scoped to company/plant/grade, accrual rules
- `LeaveBalance` — ledger-based per employee/type/year (entitled, accrued, used, carry_forward, adjustment, pending)
- `LeaveRequest` — full lifecycle: pending → approved/rejected → cancelled, linked to workflow instance
- `Holiday` — date, plant-specific, full/half/restricted, optional flag

### LeaveService:
- Leave types: list, create
- Policies: list (filterable), create (draft), publish
- Balances: get per employee (computed balance), adjust with audit
- Requests: list (paginated), apply (balance check + workflow start), approve (balance transfer pending→used), reject (release pending), cancel (reverse used/pending)
- Holidays: list (year/plant), CRUD

### API Endpoints:
| Method | Path | Permission |
|--------|------|-----------|
| GET | `/v1/leave/types` | leave.balance.view |
| POST | `/v1/leave/types` | leave.policy.manage |
| GET | `/v1/leave/policies` | leave.policy.manage |
| POST | `/v1/leave/policies` | leave.policy.manage |
| POST | `/v1/leave/policies/:id/publish` | leave.policy.manage |
| GET | `/v1/leave/balances/:employeeId` | leave.balance.view |
| POST | `/v1/leave/balances/adjust` | leave.policy.manage |
| GET | `/v1/leave/requests` | leave.balance.view |
| POST | `/v1/leave/requests` | leave.request.create |
| POST | `/v1/leave/requests/:id/approve` | leave.request.approve |
| POST | `/v1/leave/requests/:id/reject` | leave.request.approve |
| POST | `/v1/leave/requests/:id/cancel` | leave.request.create |
| GET | `/v1/leave/holidays` | leave.balance.view |
| POST | `/v1/leave/holidays` | leave.policy.manage |
| PUT | `/v1/leave/holidays/:id` | leave.policy.manage |
| DELETE | `/v1/leave/holidays/:id` | leave.policy.manage |

### Frontend hook: `apps/web/src/hooks/useLeave.ts`
- useLeaveTypes, useLeaveBalances, useLeaveRequests, useApplyLeave, useApproveLeave, useRejectLeave, useCancelLeave
- useHolidays, useCreateHoliday, useUpdateHoliday, useDeleteHoliday, useLeavePolicies

### Key features:
- Balance check on apply (rejects if insufficient)
- Ledger-based balance (pending reserved on apply, moved to used on approve, released on reject/cancel)
- No self-approval enforced
- Workflow integration (starts leave_request workflow on apply)
- Policy versioning (immutable once published)

**119 backend source files. 0 type errors. Stages 1-4 complete.**

### MVP Status:
- ✅ Stage 1: Foundation (Auth, RBAC, Audit, Workflow, Docs, Notifications, Search, Profile, Import Jobs, Retention, Migration)
- ✅ Stage 2: Organization & Core HR (Company, Plant, Department, Designation, Grade, Employee 360)
- ✅ Stage 3: Time & Attendance (Shift, Roster, Raw Punch, Daily Attendance, Period Lock)
- ✅ Stage 4: Leave & Holiday (Types, Policies, Balances, Requests, Holidays)
- ⬜ Stage 5: Self-Service (wiring employee/manager views — hooks already created)
