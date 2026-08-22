# Implementation Tasks

## Phase 1: Foundation (Weeks 1–2)

### Task 1.1: Backend Project Scaffolding
- [ ] Initialize Node.js + TypeScript project in `/backend` folder with Express.js
- [ ] Configure `tsconfig.json`, `package.json` scripts (dev, build, start, lint)
- [ ] Install dependencies: express, prisma, @prisma/client, zod, pino, jose, bcrypt, cors, helmet, express-rate-limit, ioredis
- [ ] Set up folder structure: `src/modules/`, `src/middleware/`, `src/lib/`, `src/config/`
- [ ] Create `src/config/env.ts` with Zod-validated environment variables
- [ ] Create `src/app.ts` with middleware registration order: cors → helmet → rateLimiter → requestLogger → bodyParser → routes → errorHandler
- [ ] Create `src/server.ts` with database connection check before listening on port 4000
- [ ] Create `docker-compose.yml` with services: postgres:15, redis:7, backend (hot-reload)
- [ ] Create `.env.example` with all required environment variables documented

**Requirements:** R1.1, R1.4

### Task 1.2: Database Schema & Prisma Setup
- [ ] Initialize Prisma with PostgreSQL provider: `npx prisma init`
- [ ] Define complete `schema.prisma` with all models per design doc (Employee, Department, User, Attendance, Leave, Loan, Discipline, Decision, Performance, Salary, Punch, AuditLog, etc.)
- [ ] Define all enums: UserRole, EmploymentStatus, LeaveType, LeaveStatus, LoanStatus, Severity, PunchStatus, ExceptionStatus
- [ ] Run initial migration: `npx prisma migrate dev --name init`
- [ ] Create seed script (`prisma/seed.ts`) with test data for all tables
- [ ] Verify foreign key relationships between Employee and all dependent tables

**Requirements:** R6.3, R6.4

### Task 1.3: Authentication Module
- [ ] Create `src/modules/auth/auth.routes.ts` with POST `/login`, `/refresh`, `/logout`, `/change-password`
- [ ] Create `src/modules/auth/auth.service.ts` implementing: login (bcrypt verify → JWT + refresh token), refresh (validate → new access token), logout (revoke refresh token)
- [ ] Create `src/modules/auth/auth.schema.ts` with Zod schemas for login, refresh, change-password DTOs
- [ ] Implement JWT generation using `jose` library with 15-minute access token expiry
- [ ] Implement refresh token storage in `refresh_tokens` table with 7-day expiry
- [ ] Implement password complexity validation (min 8 chars, upper, lower, digit, special)
- [ ] Implement account lockout after 5 failed attempts (30-minute lock)
- [ ] Create `src/middleware/auth.middleware.ts` that validates JWT on every protected request
- [ ] Handle token refresh flow: expired access → use refresh → new access token

**Requirements:** R2.1, R2.2, R2.3, R2.4, R2.5, R2.6, R2.7

### Task 1.4: Global Middleware Stack
- [ ] Create `src/middleware/rateLimiter.ts`: 100 req/min authenticated, 20 req/min unauthenticated (Redis-backed sliding window)
- [ ] Create `src/middleware/security.ts`: security headers (CSP, X-Content-Type-Options, X-Frame-Options, HSTS), XSS/SQLi pattern detection
- [ ] Create `src/middleware/requestLogger.ts`: log timestamp, method, path, status, response time, userId
- [ ] Create `src/middleware/errorHandler.ts`: catch-all handler, generic 500 response (no stack traces), error reference ID
- [ ] Create `src/middleware/validator.ts`: generic Zod validation middleware factory

**Requirements:** R9.1, R9.2, R9.4, R9.5, R10.1, R10.2

### Task 1.5: Employee CRUD API + Frontend Integration
- [ ] Create `src/modules/employees/employee.routes.ts`: GET `/`, GET `/:id`, POST `/`, PUT `/:id`, DELETE `/:id`
- [ ] Create `src/modules/employees/employee.service.ts` with Prisma queries, pagination, sorting, search
- [ ] Create `src/modules/employees/employee.schema.ts` with Zod request/response schemas
- [ ] Implement pagination helper (`src/lib/pagination.ts`): page, pageSize (max 100), sortBy, sortOrder, search
- [ ] Create frontend `src/lib/axios.ts` with baseURL, request interceptor (attach JWT), response interceptor (401 → refresh → retry)
- [ ] Create frontend `src/hooks/useEmployees.ts` with useQuery for list, useQuery for single, useMutation for create/update/delete
- [ ] Update `employees/page.tsx` to use React Query hook instead of dummy data
- [ ] Add loading state (spinner/skeleton) while data fetches
- [ ] Add error toast on API failure via ToastProvider

**Requirements:** R1.1, R1.2, R1.3, R1.5, R5.1, R5.2, R5.3, R5.4

### Task 1.6: Login Page UI
- [ ] Create `src/app/login/page.tsx` with username + password form
- [ ] Implement login form submission → call `/v1/auth/login`
- [ ] Store access token in memory (React state/context), refresh token in httpOnly cookie or secure storage
- [ ] Create `src/providers/AuthProvider.tsx` with auth context (user, role, login, logout, isAuthenticated)
- [ ] Add protected route wrapper that redirects to /login if not authenticated
- [ ] Update `layout.tsx` to wrap children with AuthProvider
- [ ] Style login page consistent with existing design system (Nunito font, existing CSS variables)

**Requirements:** R2.1, R2.5

---

## Phase 2: Core Modules (Weeks 3–4)

### Task 2.1: Attendance Module API + Integration
- [ ] Create backend `src/modules/attendance/` with routes, service, schema
- [ ] Endpoints: GET `/v1/attendance` (list with employee filter), GET `/v1/attendance/history` (monthly summary), POST `/v1/attendance/upload` (bulk), GET `/v1/attendance/exceptions`
- [ ] Implement server-side filtering by employee, department, month, status
- [ ] Create frontend `src/hooks/useAttendance.ts`
- [ ] Update attendance page to use React Query hooks
- [ ] Wire search/filter in StandardTableLayout to API query params

**Requirements:** R1.3, R5.1, R5.6

### Task 2.2: Leave Module API + Integration
- [ ] Create backend `src/modules/leave/` with routes, service, schema
- [ ] Endpoints: GET `/v1/leave` (list), POST `/v1/leave` (apply), PUT `/v1/leave/:id/approve`, PUT `/v1/leave/:id/reject`
- [ ] Implement leave balance calculation based on PolicySetup
- [ ] Create frontend `src/hooks/useLeave.ts`
- [ ] Update leave page to use React Query hooks
- [ ] Wire Drawer form → POST mutation → cache invalidation → success toast

**Requirements:** R1.3, R5.1, R5.3

### Task 2.3: Loan Module API + Integration
- [ ] Create backend `src/modules/loans/` with routes, service, schema
- [ ] Endpoints: GET `/v1/loans` (list), POST `/v1/loans` (apply), PUT `/v1/loans/:id` (update status), GET `/v1/loans/:id/repayments`
- [ ] Encrypt loan amounts before storage (Privacy Layer)
- [ ] Create frontend `src/hooks/useLoans.ts`
- [ ] Update loans page to use React Query hooks
- [ ] Implement optimistic update for status toggle

**Requirements:** R1.3, R4.1, R5.1, R5.5

### Task 2.4: Search & Filter Infrastructure
- [ ] Implement debounced search (300ms) in StandardTableLayout → API `search` param
- [ ] Implement GlobalFilters (plant, date) → append as query params to all API calls
- [ ] Create `src/hooks/useGlobalFilters.ts` context hook that provides current filters
- [ ] Ensure all useQuery hooks include global filter values in queryKey for proper cache separation

**Requirements:** R5.6, R1.5

---

## Phase 3: Advanced Modules (Weeks 5–6)

### Task 3.1: Compliance Module APIs (Decisions, Discipline, Punches)
- [ ] Create backend `src/modules/compliance/decisions/` — CRUD endpoints
- [ ] Create backend `src/modules/compliance/discipline/` — CRUD endpoints
- [ ] Create backend `src/modules/compliance/punches/` — read + bulk upload endpoints
- [ ] Create frontend hooks: `useDecisions.ts`, `useDiscipline.ts`, `usePunchCompliance.ts`
- [ ] Update all 3 compliance pages to use React Query
- [ ] Wire Decision Register Drawer form → POST mutation

**Requirements:** R1.3, R5.1, R5.3

### Task 3.2: Performance Reviews Module
- [ ] Create backend `src/modules/performance/` with routes, service, schema
- [ ] Endpoints: GET `/v1/performance/reviews`, POST `/v1/performance/reviews`, GET `/v1/performance/scores`, POST `/v1/performance/evidence`
- [ ] Implement score calculation based on ScoreWeights configuration
- [ ] Create frontend hooks: `usePerformanceReviews.ts`
- [ ] Update performance page with React Query integration

**Requirements:** R1.3, R5.1

### Task 3.3: Payroll & Salary Module
- [ ] Create backend `src/modules/payroll/` with routes, service, schema
- [ ] Endpoints: GET `/v1/payroll` (list), GET `/v1/payroll/increments`, POST `/v1/payroll/process`
- [ ] Encrypt all salary/financial fields before storage
- [ ] Create frontend hooks: `usePayroll.ts`, `useSalaryIncrements.ts`
- [ ] Update payroll pages with React Query integration

**Requirements:** R1.3, R4.1, R5.1

### Task 3.4: Configuration Module (Grades, Holidays, Shifts)
- [ ] Create backend `src/modules/configuration/grades/` — CRUD
- [ ] Create backend `src/modules/configuration/holidays/` — CRUD
- [ ] Create backend `src/modules/configuration/shifts/` — CRUD
- [ ] Create frontend hooks for each config entity
- [ ] Update all 3 configuration pages with React Query

**Requirements:** R1.3, R5.1

### Task 3.5: Dashboard Aggregation API
- [ ] Create backend `src/modules/dashboard/` with aggregation endpoints
- [ ] Endpoints: GET `/v1/dashboard/summary` (KPI counts), GET `/v1/dashboard/kpis` (computed metrics), GET `/v1/dashboard/charts/:type` (chart-specific data)
- [ ] Implement efficient aggregate queries (COUNT, SUM, AVG) with date range filtering
- [ ] Create frontend `src/hooks/useDashboard.ts`
- [ ] Update dashboard page KpiCards and ECharts to use real API data

**Requirements:** R1.3, R5.1

### Task 3.6: Inbox/Notification System
- [ ] Create backend `src/modules/inbox/` with routes, service
- [ ] Endpoints: GET `/v1/inbox` (list), PUT `/v1/inbox/:id/read`, GET `/v1/inbox/count` (unread count)
- [ ] Create `src/lib/notification.service.ts` — generates notifications on key events (leave approved, discipline action, etc.)
- [ ] Create frontend `src/hooks/useInbox.ts`
- [ ] Update inbox page with React Query
- [ ] Add unread badge count in Header/Sidebar component

**Requirements:** R1.3, R5.1

---

## Phase 4: Security & Privacy Hardening (Weeks 7–8)

### Task 4.1: RBAC Middleware Implementation
- [ ] Create `src/middleware/rbac.middleware.ts` with role-permission matrix
- [ ] Define permissions for all 5 roles × all modules × all actions (read, create, update, delete)
- [ ] Implement `scopeQuery()` function that adds WHERE clauses based on role (own, department, all)
- [ ] Apply RBAC middleware to every route with `requirePermission(module, action)`
- [ ] Backend enforces same scoping as frontend (defense in depth)
- [ ] Test: Employee can only see own data, Dept Head sees department, etc.
- [ ] Return 403 Forbidden with error code for unauthorized access attempts

**Requirements:** R3.1, R3.2, R3.3, R3.4, R3.5, R3.6

### Task 4.2: Frontend Role-Based UI
- [ ] Read user role from AuthProvider context
- [ ] Conditionally render sidebar menu items based on role permissions
- [ ] Hide action buttons (Add, Edit, Delete) for roles without write permission
- [ ] Implement route guards: redirect unauthorized role if they navigate directly to restricted URL
- [ ] Test with each role to verify correct UI visibility

**Requirements:** R3.2, R3.3, R3.4, R3.5

### Task 4.3: Privacy Layer — Encryption
- [ ] Create `src/lib/privacy.service.ts` with AES-256-GCM encrypt/decrypt functions
- [ ] Read encryption key from environment variable (ENCRYPTION_KEY)
- [ ] Implement per-field IV generation and storage alongside ciphertext
- [ ] Apply encryption on write for: Aadhaar, PAN, bank account, salary, loan amounts
- [ ] Apply decryption on read (only for authorized roles)
- [ ] Implement masking functions: maskAadhaar, maskBankAccount, maskPAN
- [ ] Apply masking in list endpoints, full values only in detail endpoints for authorized users

**Requirements:** R4.1, R4.4

### Task 4.4: Audit Logging
- [ ] Create `src/lib/audit.service.ts` implementing AuditLogger interface
- [ ] Log all CUD operations: actor, action, module, resourceId, changes (before/after), IP, timestamp
- [ ] Log all PII access events (READ_PII action)
- [ ] Store in `audit_logs` table (append-only, no UPDATE/DELETE)
- [ ] Create admin endpoint: GET `/v1/audit-logs` (Super Admin only, with date/module/user filters)

**Requirements:** R4.3, R10.3

### Task 4.5: Data Export with Privacy Filtering
- [ ] Implement export endpoint: GET `/v1/employees/export?format=csv`
- [ ] Apply role-based field filtering: strip PII fields the requesting user cannot view
- [ ] Log export event in audit trail
- [ ] Support CSV and JSON export formats

**Requirements:** R4.6

### Task 4.6: Security Hardening
- [ ] Implement CSRF protection (double-submit cookie or SameSite)
- [ ] Verify rate limiter works correctly with Redis sliding window
- [ ] Implement IP-based threat detection: block IP after 10+ attack patterns in 60 min
- [ ] Add request body size limit (1 MB max)
- [ ] Ensure all Zod schemas reject unknown fields (`.strict()`)
- [ ] Add SQL injection pattern detection in request validator
- [ ] Implement TLS enforcement check (redirect HTTP → HTTPS in production)

**Requirements:** R4.2, R9.1, R9.2, R9.3, R9.4, R9.5

---

## Phase 5: Testing, Migration & Deployment (Weeks 9–10)

### Task 5.1: CSV Data Migration
- [ ] Create `src/scripts/migrate-csv.ts` migration script
- [ ] Implement CSV parser with column mapping for all 19 files
- [ ] Import order: Department_Master → Employee_Master → all dependent tables
- [ ] Validate each row against Zod schema before insert
- [ ] Log invalid rows with file name, row number, column, value, reason
- [ ] Skip duplicates based on natural keys (payCode for employees, caseRef for compliance, etc.)
- [ ] Generate summary report: per-file totals (success, failure, skipped)
- [ ] Test with all 19 CSV files from `input-csv/` directory

**Requirements:** R6.1, R6.2, R6.5

### Task 5.2: Health Check & Monitoring
- [ ] Implement GET `/v1/health` endpoint returning: API version, database status, Redis status, uptime
- [ ] Add performance logging: warn when response time > 2000ms with endpoint and query details
- [ ] Ensure error responses never expose stack traces or internal paths
- [ ] Add request ID to all logs for traceability

**Requirements:** R10.4, R10.5, R10.2

### Task 5.3: End-to-End Testing
- [ ] Set up test framework (Jest or Vitest for backend)
- [ ] Write integration tests for auth flow: login, refresh, logout, lockout
- [ ] Write integration tests for RBAC: each role accessing each module
- [ ] Write integration tests for CRUD on each module
- [ ] Write integration tests for privacy: encrypted fields, masking, export filtering
- [ ] Test CSV migration with valid and invalid data
- [ ] Test rate limiting behavior
- [ ] Verify error responses don't leak implementation details

**Requirements:** R2, R3, R4, R9

### Task 5.4: Performance Testing
- [ ] Set up load testing tool (k6 or Artillery)
- [ ] Test list endpoints with 500+ records, verify response time < 5 seconds
- [ ] Test concurrent user simulation (target from manager decision)
- [ ] Test rate limiter under load
- [ ] Identify and optimize slow queries (add database indexes as needed)

**Requirements:** R1.5, R10.4

### Task 5.5: Deployment Configuration
- [ ] Create production `Dockerfile` for backend (multi-stage build)
- [ ] Create `docker-compose.prod.yml` with production configs
- [ ] Set up database backup script (daily automated, 30-day retention)
- [ ] Create deployment documentation (README with setup steps)
- [ ] Configure environment variable management for production
- [ ] Set up HTTPS/TLS certificate configuration
- [ ] Create `CHANGELOG.md` documenting all delivered features

**Requirements:** R4.2, R7.1

### Task 5.6: Soft Delete & Data Retention
- [ ] Implement soft delete for all employee-related tables (set `isDeleted = true`, `deletedAt = timestamp`)
- [ ] Add `isDeleted = false` filter to all default queries
- [ ] Create scheduled job/script for permanent deletion after retention period (configurable, default 7 years)
- [ ] Add "Terminated Employees" view for HR Manager (sees soft-deleted records)

**Requirements:** R4.5
