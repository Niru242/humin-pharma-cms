# Pharma HRMS — Build Package Explainer

This doc explains the two files in this package, why the master prompt is structured the way it is, and how to run the build with your AI tool.

## What's new in this version

Three more source sheets were added after the first draft (Executive Summary, Current System Audit, Screen Inventory). Two things from them were important enough to fold into the prompt itself rather than just note here:

1. **Your legacy Excel/Python data has known, specific problems** — all 115 employee records have a corrupted contact number field, there are 7+4 orphan/mismatched employees between the master and attendance export, and department names in attendance are inconsistent free text. The prompt now has a dedicated section (1A) telling the AI to design the import logic around these *specific* known issues — including a one-time migration tool with a human-reviewed exception queue — instead of assuming clean input and discovering these problems mid-build.
2. **The screen inventory revealed a handful of cross-cutting platform screens** (Global Search, Notifications Center, Delegation/Out-of-office, Import Job Monitor, Audit Log Viewer, Data Retention & Archive, Document/Notification Templates) that weren't explicit in the first draft. These are now added to Stage 1, since every module touches them — building them once in Foundation avoids rebuilding pieces of each per module later.

Nothing else needed to change — the module map, roles, data model, compliance, security, and API/state-machine content from the first three files this covered was already consistent with this new material.

## What's in this package

1. **`01_MASTER_AI_PROMPT.md`** — the single prompt you paste into your AI chat to start the build. It condenses your 17-sheet developer handoff (module map, roles, data model, compliance, integrations, routes, API contracts, state machines, validation rules, backlog) into one self-contained brief.
2. **`02_HOW_TO_USE_THIS_PACKAGE.md`** — this file.

Nothing has been coded yet — this package is the brief you hand to the AI that will do the coding.

## Why the prompt is structured this way

Your source files describe an enterprise HRMS for a regulated pharma manufacturer, so the prompt is built around three priorities, in this order:

1. **Foundation before features.** Section 10 forces the AI to build auth, RBAC, audit logging, and the workflow engine *first*, before any HR feature. Every later module (attendance, leave, payroll…) depends on these — building them out of order is the single most common way these projects fall apart, because you end up retrofitting security instead of building on it.
2. **Server as the only source of truth.** Repeated through the prompt: the UI hiding a button is not access control. Every rule — permissions, data scope, field masking, record locks — is re-checked in the API. This matters especially for payroll, medical, and disciplinary data where a UI-only restriction would be a real compliance gap.
3. **Auditability by default.** Immutable audit log, versioned records, mandatory reasons on high-risk actions, and no hard deletes are baked into Section 3 and 8 so they apply to every module automatically, not bolted on per feature.

## The "ideal structure" you asked for

**Backend:** NestJS, modular by HRMS domain (one Nest module per M01–M16 area), with shared cross-cutting libraries for `auth`, `audit`, `workflow`, and `validation` so those rules are written once and reused everywhere — not duplicated per module.

**Frontend:** your existing Next.js UI stays as-is structurally; the AI's job is to replace mock/stub data with real API calls and enforce `allowedActions`-driven UI (buttons appear based on what the server says is allowed for that record's current state, not hardcoded status checks).

**Database:** PostgreSQL, with effective-dated versioning for anything policy-like (leave policy, salary structure, org structure) and strict immutability for raw source data (biometric punches).

**Jobs:** anything slow (attendance recalculation, imports, PDF generation, large exports) runs async via a queue and returns a job ID — the API never blocks on these.

## Security & privacy — what's included and why

| Requirement | How it's handled in the prompt |
|---|---|
| User login | Self-built JWT auth: bcrypt/argon2 password hashing, short-lived access token + rotating refresh token |
| MFA | Required for Super Admin, available for others |
| Session control | Admin-triggered forced logout / token revocation, checked server-side on every request |
| Role-based access | 16 roles from your Roles & Permissions sheet, enforced as role + data scope (plant/department/hierarchy) + field-level sensitivity — three layers, all server-side |
| Privacy policy | Versioned document shown at login, acceptance logged per employee per version |
| Sensitive data | Bank/statutory/medical fields encrypted at rest, masked by default in UI/exports/logs |
| Audit trail | Append-only, immutable, covers every mutation plus access to Confidential-tier records |
| Pharma compliance | SOP-version-linked training records, qualification status visibility, retraining triggers, electronic signature capture on regulated records |

**One thing to flag honestly:** an HRMS is not automatically a GxP/validated system just because it's used in a pharma company — that determination (and how deep the validation/testing evidence needs to go) is a decision your Quality team has to make and document, not something a coding AI can decide for you. The prompt notes this in the compliance section but doesn't try to resolve it, since it's a regulatory judgment call for your organization, not an engineering one. If the answer is "yes, this record set is GxP-relevant," you'll want documented validation evidence (URS, risk assessment, test evidence) alongside the code, not just the code itself.

## How to run this in practice

1. Open a fresh AI chat dedicated to this project.
2. Paste the entire content of `01_MASTER_AI_PROMPT.md`.
3. Answer its Section 12 questions (where your UI currently gets data from, DB setup, whether you want a seed script) — this determines whether Stage 1 starts from zero or plugs into something you already have.
4. Let it build Stage 1 (Foundation) fully before approving Stage 2. Don't let it skip ahead — the whole point of the priority in Section 10 is that later stages assume Stage 1 is solid.
5. After each stage, check that `IMPLEMENTATION_LOG.md` (Section 11) was actually updated — that's your running record of what exists and why, and it's what you'll hand to a real developer or auditor later if this ever needs review.
6. When you're ready to move past MVP (M01–M05) into payroll or later modules, come back to your original 17-sheet handoff for that module's specific field dictionary, page spec, and API contract rows, and feed the relevant rows into the same ongoing chat.

## What I'd ask you before the AI even starts

The master prompt already asks these in Section 12, but worth deciding now: does your current Next.js UI call any API at all today (even a stub), or is everything hardcoded/mocked? That answer changes whether Stage 1 is "build alongside" or "replace wholesale," and it's worth having a clear answer before you paste the prompt in.
