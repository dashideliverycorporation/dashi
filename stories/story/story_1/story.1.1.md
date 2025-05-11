# Story 1.1: Implement Basic Authentication (Login & Registration Backend)

Status: Draft

## Goal & Context

**User Story:** As a user, I want to register and log in to the system using email and password so that I can access role-specific features.

**Context:** This is the first story in Epic 1 (Authentication & User/Restaurant Admin Management). It focuses on implementing the backend authentication system using Auth.js, enhancing the user model with roles, and creating tRPC procedures for registration and login. This authentication system is a critical foundation for role-based access control needed for restaurant management and customer ordering functionality.

## Detailed Requirements

- Update the Prisma schema to add a role field (enum: Admin, Restaurant, Customer) to the User model
- Configure Auth.js properly with the Prisma adapter and credential provider for email/password authentication
- Create backend tRPC procedures for user registration with secure password hashing
- Create backend tRPC procedures for user login using Auth.js credentials provider
- Ensure user roles are stored in the database and included in the Auth.js session token
- Implement role-based middleware for protecting tRPC procedures
- Create utility functions for checking user roles and authorization

## Acceptance Criteria (ACs)

- AC1: Prisma schema is updated to include a role field on the User model
- AC2: Users can register with email/password and receive a default role
- AC3: Passwords are securely hashed in the database using bcrypt
- AC4: Users can log in with their email/password and receive a session token
- AC5: Session token includes the user's role for role-based authorization
- AC6: tRPC procedures can be protected with middleware based on user roles
- AC7: Database migrations run successfully with the updated schema

## Technical Implementation Context

**Guidance:** Use the following details for implementation. Developer agent is expected to follow project standards and understand the project structure. Only story-specific details are included below.

### Relevant Files:

- **Files to Create/Modify:**
  - `prisma/schema.prisma` - Update User model to include role field
  - `server/auth.ts` - Configure Auth.js with Prisma adapter and credentials provider
  - `server/trpc/routers/auth.ts` - Create tRPC procedures for registration and login
  - `server/trpc/middleware/auth.ts` - Create role-based middleware
  - `lib/auth.ts` - Create utility functions for role checking

### Key Technologies:

- Auth.js (NextAuth) for authentication
- Prisma for database schema and ORM
- tRPC for type-safe procedures
- bcrypt for password hashing
- zod for request validation

### API Interactions / SDK Usage:

- Auth.js (NextAuth) API for session management
- Prisma Client for database operations
- tRPC for type-safe procedure definitions

### UI/UX Notes:

- N/A for this story (backend focused)
- UI components will be implemented in subsequent stories

### Data Structures:

- User model with role field (Admin, Restaurant, Customer)
- Auth.js session with role information
- Registration and login request/response types

### Environment Variables:

- `NEXTAUTH_SECRET` - Secret for Auth.js session encryption
- `NEXTAUTH_URL` - URL for Auth.js callbacks (deployment URL)

### Coding Standards Notes:

- Follow TypeScript strict mode with proper type definitions
- Use zod for validating all input data in tRPC procedures
- Implement proper error handling for authentication failures
- Add meaningful error messages for validation failures
- Ensure all database operations are properly wrapped in try/catch blocks
- Follow the tRPC router structure established in Epic 0

## Tasks / Subtasks

- [x] Update Prisma schema to add role enum and field to User model
- [x] Run Prisma migration to update the database schema
- [x] Configure Auth.js with Prisma adapter in server/auth.ts
- [x] Implement credential provider with email/password
- [x] Create registration tRPC procedure with password hashing
- [x] Create login tRPC procedure using Auth.js credentials
- [x] Add role to Auth.js session token
- [x] Create role-based middleware for tRPC procedures
- [x] Create utility functions for checking user roles
- [x] Set up proper error handling for authentication failures
- [x] Write tests for authentication procedures

## Testing Requirements

**Guidance:** Verify implementation against the ACs using the following tests.

### Unit Tests:

- Test registration procedure with valid and invalid data
- Test login procedure with valid and invalid credentials
- Test role-based middleware with different user roles
- Test utility functions for role checking

### Integration Tests:

- Test end-to-end registration flow with database storage
- Test end-to-end login flow with session creation
- Test protected routes with different user roles

### Manual/CLI Verification:

- Run `pnpm prisma migrate dev` to verify the migration runs successfully
- Use Prisma Studio (`pnpm prisma studio`) to verify the User model has a role field
- Test the registration and login procedures with REST client or similar tool
- Verify the session token contains the user's role information

## Story Wrap Up (Agent Populates After Execution)

**Agent Model Used:**
**Completion Notes:**
**Change Log:**

- Initial Draft: Created story structure for implementing basic authentication
