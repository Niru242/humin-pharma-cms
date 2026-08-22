# Development Timeline Document

## Project: Pharma HRMS — Static UI to Production Tool

---

## Scenario A: Full Custom Build (Your Current Project)

**Total Duration: 10 Weeks (2.5 Months)**
**Assumption:** 1 full-stack developer working full-time

| Phase | Duration | What Gets Delivered | Key Milestone |
|-------|----------|--------------------:|---------------|
| **Phase 1 — Foundation** | Week 1–2 | Backend scaffolding, DB schema, Auth (login/JWT), Employee CRUD connected to frontend | ✅ First page works with real data |
| **Phase 2 — Core Modules** | Week 3–4 | Attendance, Leave, Loans APIs + frontend integration, search/filter working | ✅ 4 modules fully functional |
| **Phase 3 — Advanced Modules** | Week 5–6 | Compliance, Performance, Payroll, Config, Dashboard KPIs, Inbox | ✅ All pages connected to real data |
| **Phase 4 — Security Hardening** | Week 7–8 | RBAC enforcement, encryption, audit logging, rate limiting, role-based UI | ✅ Production-grade security |
| **Phase 5 — Testing & Deploy** | Week 9–10 | CSV data migration, testing, performance tuning, deployment | ✅ Production-ready |

### Phase 1 Breakdown (Weeks 1–2)

| Day | Task | Hours |
|-----|------|-------|
| Day 1 | Project scaffolding, Docker setup, folder structure | 6h |
| Day 2 | Prisma schema (all tables), first migration | 6h |
| Day 3 | Auth service: login, JWT issue, bcrypt | 6h |
| Day 4 | Auth service: refresh token, logout, lockout | 5h |
| Day 5 | Auth middleware, rate limiter, security headers | 5h |
| Day 6 | Employee CRUD API (service + routes + validation) | 6h |
| Day 7 | Pagination/sorting/filtering helper | 4h |
| Day 8 | Frontend: Axios interceptors, AuthProvider, login page | 6h |
| Day 9 | Frontend: useEmployees hook, replace dummy data | 5h |
| Day 10 | Testing auth flow end-to-end, bug fixes | 5h |

### Phase 2 Breakdown (Weeks 3–4)

| Day | Task | Hours |
|-----|------|-------|
| Day 1–2 | Attendance API (routes, service, schema) + hook | 10h |
| Day 3–4 | Leave API (apply, approve/reject workflow) + hook | 10h |
| Day 5–6 | Loan API (with encryption for amounts) + hook | 10h |
| Day 7 | Search debounce + GlobalFilters context integration | 5h |
| Day 8 | Wire all 3 pages: replace dummy → React Query | 6h |
| Day 9 | Loading states, empty states, error toasts | 4h |
| Day 10 | Testing + edge case fixes | 5h |

### Phase 3 Breakdown (Weeks 5–6)

| Day | Task | Hours |
|-----|------|-------|
| Day 1–2 | Compliance: Decisions + Discipline + Punches APIs | 10h |
| Day 3 | Performance Reviews API + score calculation | 6h |
| Day 4 | Payroll/Salary API (with encryption) | 5h |
| Day 5 | Configuration CRUD (Grades, Holidays, Shifts) | 5h |
| Day 6 | Dashboard aggregation endpoints | 5h |
| Day 7 | Inbox/Notification system | 5h |
| Day 8–9 | Frontend hooks + page integration for all above | 10h |
| Day 10 | Testing all modules end-to-end | 5h |

### Phase 4 Breakdown (Weeks 7–8)

| Day | Task | Hours |
|-----|------|-------|
| Day 1–2 | RBAC middleware + permission matrix for all modules | 10h |
| Day 3 | Frontend role-based UI (hide/show based on role) | 6h |
| Day 4–5 | Privacy layer: AES-256 encrypt/decrypt + masking | 10h |
| Day 6 | Audit logger implementation | 5h |
| Day 7 | Data export with privacy filtering | 4h |
| Day 8 | Security hardening (CSRF, IP blocking, body limits) | 5h |
| Day 9–10 | Test RBAC with each role, fix edge cases | 8h |

### Phase 5 Breakdown (Weeks 9–10)

| Day | Task | Hours |
|-----|------|-------|
| Day 1–2 | CSV migration script for all 19 files | 10h |
| Day 3 | Run migration, fix data issues, generate report | 5h |
| Day 4–5 | Integration tests (auth, RBAC, CRUD, privacy) | 10h |
| Day 6 | Performance/load testing | 5h |
| Day 7 | Dockerfile, production compose, backup script | 5h |
| Day 8 | TLS setup, deployment docs | 4h |
| Day 9 | Staging deployment + smoke testing | 5h |
| Day 10 | Final fixes, CHANGELOG, handoff documentation | 4h |

---

## Scenario B: Readymade CMS (Real Estate Purpose — Adapting for HRMS)

**If you're using a headless CMS (like Strapi, Directus, Payload CMS, or similar) as your backend and just need to wire it to your existing UI:**

**Total Duration: 4–5 Weeks (1–1.5 Months)**

| Phase | Duration | What Gets Delivered |
|-------|----------|---------------------|
| **Phase 1 — CMS Setup & Schema** | Week 1 | CMS installed, all collections/content-types defined, roles configured, API keys issued |
| **Phase 2 — Data Migration & Auth** | Week 2 | CSV data imported into CMS, auth integration (CMS auth or custom JWT wrapper), login page |
| **Phase 3 — Frontend Integration** | Week 3–4 | All pages wired to CMS API via React Query hooks, CRUD working for all modules |
| **Phase 4 — Privacy & Polish** | Week 5 | Field-level permissions in CMS, audit plugin, export restrictions, testing, deployment |

### Why It's Faster with a CMS

| What You Skip | Time Saved |
|---------------|-----------|
| Writing CRUD APIs from scratch | ~15 hours |
| Building pagination/sort/filter | ~5 hours |
| Database schema creation | ~4 hours (CMS auto-generates) |
| Auth system (if using CMS auth) | ~12 hours |
| Admin panel for data management | Built-in |
| API documentation | Auto-generated |

### What Still Takes the Same Time

| Task | Why CMS Doesn't Help |
|------|---------------------|
| Frontend React Query hooks | Still need custom hooks per module |
| Login page UI | Custom branded page needed |
| Role-based frontend logic | CMS handles backend RBAC, but you still hide/show UI elements |
| Privacy masking in frontend | CMS returns raw data — you mask in the hook layer |
| CSV data import | CMS has import tools but you still need to map 19 files |
| Custom business logic | Leave approval workflows, salary calculations — need custom code or plugins |

### CMS Recommendation for Your Stack

| CMS | Why It Fits | Concern |
|-----|-------------|---------|
| **Payload CMS** | TypeScript + Next.js native, self-hosted, full RBAC | Newer, smaller community |
| **Strapi** | Mature, REST + GraphQL, plugin ecosystem, role system | JavaScript-first (not TS-native) |
| **Directus** | Database-first (wraps existing PostgreSQL), powerful permissions | Requires existing DB |

---

## Scenario C: Per-Functionality Timeline (Granular Estimate)

**This is for when you develop features one at a time (e.g., manager approves one module at a time):**

| Functionality | Estimated Time | Dependencies |
|---------------|---------------|-------------|
| **Backend Setup + Docker** | 2 days | None |
| **Database Schema (all tables)** | 1.5 days | Backend setup |
| **Authentication (login, JWT, refresh, lockout)** | 3 days | Database |
| **Login Page UI** | 1 day | Auth API |
| **Employee CRUD (API + frontend)** | 2.5 days | Auth |
| **Attendance Module (API + frontend)** | 2 days | Employee |
| **Leave Module (API + frontend + approval flow)** | 2.5 days | Employee |
| **Loan Module (API + frontend + encryption)** | 2 days | Employee, Privacy |
| **Decision Register (API + frontend)** | 1.5 days | Employee |
| **Discipline Records (API + frontend)** | 1.5 days | Employee |
| **Punch Compliance (API + frontend)** | 1 day | Employee |
| **Performance Reviews (API + scores + frontend)** | 2.5 days | Employee |
| **Payroll/Salary (API + encryption + frontend)** | 2 days | Employee, Privacy |
| **Configuration: Grades** | 0.5 days | Backend |
| **Configuration: Holidays** | 0.5 days | Backend |
| **Configuration: Shifts** | 0.5 days | Backend |
| **Dashboard KPIs + Charts** | 2 days | All modules (needs data) |
| **Inbox/Notifications** | 1.5 days | All modules |
| **RBAC Middleware (all roles)** | 2.5 days | All modules |
| **Frontend Role-Based UI** | 1.5 days | RBAC |
| **Privacy Layer (encryption + masking)** | 2.5 days | Backend |
| **Audit Logging** | 1.5 days | Backend |
| **Data Export with filtering** | 1 day | Privacy, RBAC |
| **CSV Migration (19 files)** | 2.5 days | All tables |
| **Security Hardening (rate limit, headers, etc.)** | 1.5 days | Backend |
| **Testing (integration + load)** | 3 days | Everything |
| **Deployment (Docker, TLS, docs)** | 2 days | Everything |
| **TOTAL** | **~47 working days (~10 weeks)** | — |

---

## Timeline Comparison Summary

| Approach | Duration | Best For |
|----------|----------|----------|
| Full custom build (Express + Prisma) | 10 weeks | Maximum control, pharma compliance needs, on-premise |
| Readymade CMS (Payload/Strapi) | 4–5 weeks | Faster MVP, less custom business logic |
| Hybrid (CMS for CRUD + custom auth/privacy) | 6–7 weeks | Balance of speed and compliance |

---

## Risk Factors That Can Extend Timeline

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Manager delays in answering questions (R8) | +1–2 weeks | Get answers before Phase 1 starts |
| Unclear business logic (salary formula, leave rules) | +1 week per module | Document rules before coding |
| Scope creep (new features mid-sprint) | +2–4 weeks | Stick to phased delivery, defer extras |
| Data quality issues in CSV files | +3–5 days | Run validation pass before full migration |
| Team unfamiliarity with stack | +1–2 weeks | Factor in learning time |
| Single developer (bus factor = 1) | Blocks if sick/unavailable | Document everything, keep code simple |

---

## Recommended Start Order (Priority Matrix)

If your manager wants to see results fast, here's the recommended order:

1. **Auth + Login** — Without this, nothing else matters
2. **Employee Directory** — Foundation for all other modules
3. **Attendance** — Most-used daily module
4. **Leave** — High employee interaction
5. **Compliance (Decisions)** — Already has good UI, quick win
6. **Dashboard** — Visible executive value
7. **Everything else** — Based on business priority
