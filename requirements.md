# Requirements Document

## Introduction

This document defines the requirements for transitioning the Pharma HRMS application from a static UI prototype (with dummy data) to a fully functional, production-ready system. The scope covers backend API development, frontend-backend integration, authentication and authorization, data privacy protection, and a phased development roadmap. It also includes a comprehensive set of critical questions a developer should ask their manager before commencing development.

The existing frontend is built with Next.js 16, React 19, TypeScript, TanStack React Query, Axios, Tabler Icons, and ECharts. It has a complete UI layer with reusable components (Drawer, Modal, StandardTableLayout, KpiCard, Charts, Sidebar, Header) and static dummy data across all modules. Axios is configured (`baseURL: http://localhost:4000/v1`) but no backend is connected.

## Glossary

- **HRMS**: Human Resource Management System — the complete application managing employee lifecycle, attendance, payroll, compliance, and performance
- **Backend_API**: The server-side REST API service that handles business logic, data persistence, and serves data to the frontend
- **Auth_System**: The authentication and authorization subsystem responsible for user identity verification and access control
- **Privacy_Layer**: The set of controls ensuring personal employee data is protected per regulatory requirements
- **Frontend**: The existing Next.js 16 client application with React 19 components
- **Developer**: The software engineer responsible for implementing the system
- **Manager**: The project manager or team lead who provides business decisions and approvals
- **RBAC**: Role-Based Access Control — restricting system access based on assigned user roles
- **PII**: Personally Identifiable Information — any data that can identify a specific employee
- **JWT**: JSON Web Token — a compact token format used for secure authentication
- **API_Gateway**: The entry point for all client requests that handles routing, rate limiting, and authentication verification
- **Data_Migration_Service**: The service responsible for importing CSV reference data into the production database
- **Audit_Logger**: The subsystem that records all data access and modification events for compliance

## Requirements

### Requirement 1: Backend API Foundation

**User Story:** As a developer, I want a clearly defined backend API architecture, so that the frontend can be connected to real data and business logic.

#### Acceptance Criteria

1. THE Backend_API SHALL expose RESTful endpoints following the URL pattern `/v1/{module}/{resource}` matching the existing Axios baseURL configuration
2. WHEN the Frontend sends a request to the Backend_API, THE Backend_API SHALL respond with JSON data structured to match the existing TypeScript interfaces defined in each page component
3. THE Backend_API SHALL provide CRUD endpoints for each module: Employees, Attendance, Leave, Loans, Compliance (Decisions, Discipline, Punches), Performance Reviews, Payroll, Configuration (Grades, Holidays, Shifts), Dashboard, and Inbox
4. WHEN the Backend_API starts, THE Backend_API SHALL connect to the database and validate schema integrity before accepting requests
5. THE Backend_API SHALL implement pagination, sorting, and filtering query parameters for all list endpoints to match the StandardTableLayout component capabilities

### Requirement 2: Authentication System

**User Story:** As a developer, I want a secure authentication system, so that only authorized users can access the HRMS application.

#### Acceptance Criteria

1. WHEN a user submits valid credentials, THE Auth_System SHALL issue a JWT access token and a refresh token
2. WHEN a user submits invalid credentials, THE Auth_System SHALL return an authentication error without revealing whether the username or password was incorrect
3. WHILE a user session is active, THE Auth_System SHALL validate the JWT token on every API request before processing
4. WHEN a JWT access token expires, THE Auth_System SHALL allow token renewal using the refresh token without requiring re-authentication
5. IF a refresh token is expired or revoked, THEN THE Auth_System SHALL redirect the user to the login page and clear all session data
6. THE Auth_System SHALL enforce password complexity rules: minimum 8 characters, at least one uppercase letter, one lowercase letter, one digit, and one special character
7. WHEN a user fails authentication 5 consecutive times, THE Auth_System SHALL lock the account for 30 minutes and notify the HR administrator

### Requirement 3: Role-Based Access Control

**User Story:** As a developer, I want role-based access control, so that users only see and modify data appropriate to their role.

#### Acceptance Criteria

1. THE Auth_System SHALL support the following roles: Super Admin, HR Manager, HR Executive, Department Head, and Employee
2. WHEN a user with the Employee role accesses the system, THE Frontend SHALL display only that user's own records for Leave, Attendance, Loans, Salary, and Performance
3. WHEN a user with the Department Head role accesses the system, THE Frontend SHALL display records for all employees within that user's department
4. WHEN a user with the HR Manager role accesses the system, THE Frontend SHALL display records across all departments for all HR modules
5. WHILE a user is assigned the Super Admin role, THE Auth_System SHALL grant full access to all modules including Configuration and System Settings
6. WHEN an unauthorized user attempts to access a restricted endpoint, THE Backend_API SHALL return a 403 Forbidden response with a descriptive error code

### Requirement 4: Data Privacy Protection

**User Story:** As a developer, I want comprehensive data privacy controls, so that employee personal information is protected according to regulatory standards.

#### Acceptance Criteria

1. THE Privacy_Layer SHALL encrypt all PII fields (Aadhaar number, PAN, bank account details, salary figures, medical records) at rest using AES-256 encryption
2. WHILE data is transmitted between the Frontend and the Backend_API, THE Privacy_Layer SHALL enforce TLS 1.2 or higher for all connections
3. WHEN a user requests employee PII data, THE Audit_Logger SHALL record the requesting user identity, the data accessed, the timestamp, and the client IP address
4. THE Privacy_Layer SHALL mask sensitive fields (showing only last 4 digits of Aadhaar, masked bank account numbers) in list views and only reveal full values in authorized detail views
5. WHEN an employee record is marked for deletion, THE Privacy_Layer SHALL perform soft deletion retaining data for the legally mandated retention period before permanent removal
6. IF a data export is requested, THEN THE Privacy_Layer SHALL apply role-based field filtering to exclude PII fields that the requesting user is not authorized to view

### Requirement 5: Frontend-Backend Integration

**User Story:** As a developer, I want a clear integration strategy, so that all existing UI components connect seamlessly to real API data without breaking the current design.

#### Acceptance Criteria

1. WHEN the Frontend loads a module page, THE Frontend SHALL replace static dummy data arrays with TanStack React Query hooks that fetch from the Backend_API
2. THE Frontend SHALL implement loading states, error states, and empty states using the existing EmptyState component for all data-fetching operations
3. WHEN a user performs a create, update, or delete operation via a Drawer or Modal form, THE Frontend SHALL send the mutation to the Backend_API and invalidate the relevant query cache on success
4. IF the Backend_API returns a network error or timeout, THEN THE Frontend SHALL display a user-friendly error notification using the existing ToastProvider
5. THE Frontend SHALL implement optimistic updates for user actions where latency would degrade the experience (status toggles, simple field updates)
6. WHEN the user performs a search in StandardTableLayout, THE Frontend SHALL debounce the search input by 300 milliseconds and send the query to the Backend_API for server-side filtering

### Requirement 6: Database Design and Data Migration

**User Story:** As a developer, I want a proper database with migrated reference data, so that the application operates on real HR master data.

#### Acceptance Criteria

1. THE Data_Migration_Service SHALL import all 19 CSV reference files from the input-csv directory into the production database with data type validation and referential integrity checks
2. WHEN a CSV import encounters an invalid row, THE Data_Migration_Service SHALL log the error with row number and field details and continue processing remaining rows
3. THE Backend_API SHALL use database migrations to manage schema evolution, allowing rollback to any previous schema version
4. THE Backend_API SHALL define foreign key relationships between Employee records and all related tables (Attendance, Leave, Loans, Salary, Discipline, Decisions, Performance)
5. WHEN the Data_Migration_Service completes an import, THE Data_Migration_Service SHALL generate a summary report listing total records processed, successful imports, and failures per CSV file

### Requirement 7: Development Roadmap and Phased Delivery

**User Story:** As a developer, I want a time-period-based development roadmap, so that the project is delivered incrementally with clear milestones.

#### Acceptance Criteria

1. THE Developer SHALL follow a 5-phase development roadmap: Phase 1 (Weeks 1-2) Foundation, Phase 2 (Weeks 3-4) Core Modules, Phase 3 (Weeks 5-6) Advanced Modules, Phase 4 (Weeks 7-8) Integration and Security Hardening, Phase 5 (Weeks 9-10) Testing and Deployment
2. WHEN Phase 1 begins, THE Developer SHALL deliver: backend project scaffolding, database schema design, authentication system, and the first API endpoint (Employee CRUD) connected to the frontend
3. WHEN Phase 2 begins, THE Developer SHALL deliver: Attendance, Leave, and Loan modules with full CRUD API endpoints integrated with the frontend
4. WHEN Phase 3 begins, THE Developer SHALL deliver: Compliance (Decisions, Discipline, Punches), Performance Reviews, Payroll, Configuration modules, Dashboard aggregation APIs, and Inbox notification system
5. WHEN Phase 4 begins, THE Developer SHALL deliver: RBAC enforcement across all endpoints, privacy layer implementation, audit logging, data encryption, rate limiting, and input validation hardening
6. WHEN Phase 5 begins, THE Developer SHALL deliver: end-to-end testing, performance load testing, security penetration testing, data migration from CSV files, staging environment deployment, and production deployment documentation

### Requirement 8: Critical Pre-Development Questions for Manager

**User Story:** As a developer, I want a checklist of critical questions to ask my manager, so that I have all business decisions and constraints clarified before starting development.

#### Acceptance Criteria

1. THE Developer SHALL confirm the following infrastructure decisions with the Manager before starting: choice of backend language/framework (Node.js/Express, NestJS, Python/Django, or other), database system (PostgreSQL, MySQL, MongoDB, or other), hosting environment (AWS, Azure, GCP, on-premise), and deployment strategy (Docker, Kubernetes, bare metal)
2. THE Developer SHALL confirm the following authentication decisions with the Manager: whether to use a managed auth provider (Auth0, Firebase Auth, AWS Cognito) or build custom authentication, whether Single Sign-On (SSO) integration with existing company systems is required, and what the session timeout policy should be
3. THE Developer SHALL confirm the following data and privacy decisions with the Manager: which regulatory frameworks apply (Indian IT Act, DPDPA 2023, company-specific policies), what the data retention period is for terminated employee records, who approves data export requests, and whether data residency requirements mandate a specific geographic server location
4. THE Developer SHALL confirm the following business logic decisions with the Manager: leave approval workflow hierarchy, salary calculation formula and components, loan eligibility rules and repayment terms, attendance exception handling rules, performance review cycle frequency and scoring methodology, and discipline escalation matrix
5. THE Developer SHALL confirm the following integration decisions with the Manager: whether the system integrates with biometric attendance hardware, whether payroll integrates with banking/payment systems, whether email/SMS notification services are required, and whether document storage (offer letters, ID proofs) requires a specific service
6. THE Developer SHALL confirm the following team and process decisions with the Manager: who reviews and approves pull requests, what is the branching strategy (GitFlow, trunk-based), what CI/CD pipeline is expected, what are the test coverage expectations, and what documentation standards should be followed
7. THE Developer SHALL confirm the following scope and priority decisions with the Manager: which module has highest priority for delivery, what is the expected user concurrency (number of simultaneous users), whether a mobile-responsive or dedicated mobile app is planned, and what is the acceptable downtime window for maintenance

### Requirement 9: API Security and Validation

**User Story:** As a developer, I want comprehensive API security measures, so that the system is protected against common attack vectors.

#### Acceptance Criteria

1. THE Backend_API SHALL validate and sanitize all incoming request bodies, query parameters, and path parameters against defined schemas before processing
2. THE Backend_API SHALL implement rate limiting of 100 requests per minute per authenticated user and 20 requests per minute for unauthenticated endpoints
3. WHEN the Backend_API receives a request with an invalid or malformed payload, THE Backend_API SHALL return a 400 Bad Request response with specific field-level validation error messages
4. THE Backend_API SHALL set security headers on all responses: Content-Security-Policy, X-Content-Type-Options, X-Frame-Options, and Strict-Transport-Security
5. IF a SQL injection, XSS, or CSRF attack pattern is detected in a request, THEN THE Backend_API SHALL reject the request, log the attempt with full request details, and increment a threat counter for the source IP

### Requirement 10: Monitoring, Logging, and Error Handling

**User Story:** As a developer, I want structured logging and monitoring, so that production issues can be identified and resolved quickly.

#### Acceptance Criteria

1. THE Backend_API SHALL log all requests with: timestamp, HTTP method, endpoint path, response status code, response time in milliseconds, and requesting user ID
2. WHEN an unhandled exception occurs in the Backend_API, THE Backend_API SHALL return a generic 500 error to the client without exposing stack traces or internal implementation details
3. THE Audit_Logger SHALL maintain a separate immutable audit trail for all create, update, and delete operations on employee records, compliance actions, and salary modifications
4. WHEN the Backend_API response time exceeds 2000 milliseconds for any endpoint, THE Backend_API SHALL log a performance warning with the query execution details
5. THE Backend_API SHALL expose a health check endpoint at `/v1/health` that returns the API version, database connectivity status, and uptime duration

