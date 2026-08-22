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
