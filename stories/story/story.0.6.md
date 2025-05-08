# Story 0.6: Authentication Library Setup (Auth.js)

Status: Planning

## Goal & Context

**User Story:** As a developer, I want to set up Auth.js (formerly NextAuth.js) with email/password authentication so that users can register and log in to the system.

**Context:** This is the sixth story in Epic 0 (Initial Project & Core Infrastructure Setup). It focuses on implementing authentication using Auth.js with the Prisma adapter to enable user registration, login, and session management. This will provide the foundation for user authentication and authorization across the application.

## Detailed Requirements

- Install Auth.js and the Prisma adapter to integrate with our database
- Configure Auth.js provider (CredentialsProvider) for email/password authentication
- Set up environment variables for Auth.js secrets
- Integrate Auth.js session provider in the Next.js application
- Create basic sign-in and sign-up pages with forms
- Implement utility functions for checking authentication status and user roles
- Ensure sessions persist correctly and are accessible throughout the application

## Acceptance Criteria (ACs)

- AC1: Auth.js is properly installed and configured with the Prisma adapter
- AC2: Email/password authentication works correctly for user registration and login
- AC3: User sessions are maintained across page navigations
- AC4: Protected routes are properly guarded against unauthorized access
- AC5: User roles (Customer, Restaurant, Admin) are properly handled in authentication
- AC6: Environment variables for Auth.js are correctly set up

## Technical Implementation Context

**Guidance:** Use the following details for implementation. Developer agent is expected to follow project standards and understand the project structure. Only story-specific details are included below.

### Relevant Files:

- **Files to Create:**

  - `app/api/auth/[...nextauth]/route.ts` - Auth.js API routes
  - `app/lib/auth.ts` - Authentication utilities and configuration
  - `app/components/auth/SignInForm.tsx` - Sign-in form component
  - `app/components/auth/SignUpForm.tsx` - Sign-up form component
  - `app/signin/page.tsx` - Sign-in page
  - `app/signup/page.tsx` - Sign-up page
  - `app/middleware.ts` - Next.js middleware for route protection

- **Files to Modify:**
  - `app/layout.tsx` - Add Auth.js SessionProvider
  - `prisma/schema.prisma` - Add required Auth.js fields to User model
  - `.env.local` - Add Auth.js environment variables

### Key Technologies:

- Next.js (App Router)
- TypeScript
- Auth.js (formerly NextAuth.js)
- Prisma (for database adapter)
- Shadcn UI (for form components)
- bcrypt (for password hashing)

### API Interactions / SDK Usage:

- Auth.js API for authentication
- Prisma Client for database interactions

### UI/UX Notes:

- Sign-in and sign-up forms should follow the Dashi orange theme
- Form validation should provide clear feedback to users
- Consider implementing "remember me" functionality

### Data Structures:

- Update User model in Prisma schema to include Auth.js required fields
- Consider role-based access control (RBAC) with roles: 'CUSTOMER', 'RESTAURANT', 'ADMIN'

### Environment Variables:

- `NEXTAUTH_URL` - The base URL of the site
- `NEXTAUTH_SECRET` - A random string used to hash tokens, sign cookies, etc.
- Add other authentication-related environment variables as needed

### Coding Standards Notes:

- Follow Auth.js best practices for Next.js App Router
- Ensure proper TypeScript typing for authentication functions
- Create reusable authentication utilities
- Document security considerations with appropriate comments

## Tasks / Subtasks

- [x] Install Auth.js and related dependencies: `pnpm add next-auth bcrypt @prisma/client`
- [x] Install dev dependencies: `pnpm add -D @types/bcrypt`
- [x] Update Prisma schema to include Auth.js required fields for User model
- [x] Run Prisma migration to update the database schema
- [x] Create Auth.js configuration file
- [x] Set up environment variables for Auth.js
- [x] Implement credential provider with email/password authentication
- [x] Create authentication utilities for checking auth status and user roles
- [x] Add Auth.js SessionProvider to app layout
- [x] Create sign-in and sign-up form components using Shadcn UI
- [x] Create sign-in and sign-up pages
- [x] Implement Next.js middleware for route protection

## Testing Requirements

**Guidance:** Verify implementation against the ACs using the following tests.

### Unit Tests:

- Test authentication utilities for checking auth status and user roles
- Test form validation in sign-in and sign-up components

### Integration Tests:

- Test the Auth.js configuration with the Prisma adapter
- Test the credential provider with email/password authentication

### Manual Verification:

- Create a new user account through the sign-up page
- Log in with the created user credentials
- Verify session persistence by navigating between pages
- Attempt to access protected routes with and without authentication
- Test user role-based access control

## Story Wrap Up (Agent Populates After Execution)

**Agent Model Used:**
**Completion Notes:**
**Change Log:**

- Initial Draft
