# Epic 1: Authentication & User/Restaurant Admin Management

**Goal:** Implement user authentication flows and allow administrators to manage restaurants and restaurant users.

**Deployability:** This epic establishes the authentication system and administrative capabilities necessary for managing restaurants. It delivers the backend infrastructure and administrative interfaces needed to onboard restaurants to the platform, a key prerequisite for the restaurant-facing and customer-facing features in later epics.

## Epic-Specific Technical Context

This epic builds upon the authentication and database infrastructure established in Epic 0:

1. **Authentication**: Extends Auth.js implementation to support role-based access control (Admin, Restaurant, Customer)
2. **Database Models**: Enhances user model with roles and creates relationships between users and restaurants
3. **API Layer**: Implements tRPC procedures for user registration, login, and restaurant management
4. **Protected Routes**: Establishes middleware and route protection for role-specific access
5. **Admin Dashboard**: Creates the foundational admin interface using Shadcn UI components

## Local Testability & Command-Line Access

- **Local Development:**

  - Run `pnpm dev` to start the Next.js development server
  - Run `pnpm db:studio` to access Prisma Studio for database exploration
  - Run `pnpm test` to run the test suite

- **Command-Line Testing:**

  - `pnpm prisma db push` to sync schema changes to the database
  - `pnpm prisma studio` to visually explore the database and verify user/restaurant relationships

- **Environment Testing:**

  - Local: Use `.env.local` for development environment variables
  - Development: Vercel preview deployments for each PR
  - Production: Main branch deployment on Vercel

- **Testing Prerequisites:**
  - Local PostgreSQL database with Auth.js tables created
  - Test user accounts with different roles (Admin, Restaurant, Customer)

## Story List

### Story 1.1: Implement Basic Authentication (Login & Registration Backend)

- **User Story / Goal:** As a user, I want to register and log in to the system using email and password so that I can access role-specific features.
- **Detailed Requirements:**
  - Enhance user model in Prisma schema to include role field (Admin, Restaurant, Customer)
  - Implement tRPC procedures for user registration with email/password
  - Implement secure password hashing using bcrypt
  - Create tRPC procedure for user login using Auth.js credentials provider
  - Store user role in the database and make it available in the session
  - Implement role-based authorization middleware for tRPC procedures
- **Acceptance Criteria (ACs):**
  - AC1: Users can register with email/password and receive a role
  - AC2: Passwords are securely hashed in the database
  - AC3: Users can log in and receive a session token
  - AC4: User roles are stored in the database and included in the session
  - AC5: tRPC procedures can be protected based on user roles
- **Tasks (Optional Initial Breakdown):**
  - [x] Update Prisma schema with user role field
  - [x] Create user registration tRPC procedure
  - [x] Implement password hashing
  - [x] Create login procedure with Auth.js
  - [x] Add role to session token
  - [x] Create role-based middleware for tRPC
- **Dependencies:** Epic 0 (Stories 0.2, 0.6, 0.7)

---

### Story 1.2: Admin Dashboard - Protected Route & Basic View

- **User Story / Goal:** As an admin, I want to access a protected dashboard so that I can manage restaurants and restaurant users.
- **Detailed Requirements:**
  - Create a protected `/admin` route accessible only to users with the 'Admin' role
  - Implement route protection using Auth.js session and middleware
  - Create basic admin dashboard layout with navigation
  - Implement session check and redirect for non-admin users
  - Add basic dashboard metrics placeholder
  - Style dashboard using Shadcn UI components
- **Acceptance Criteria (ACs):**
  - AC1: `/admin` route exists and loads correctly for admin users
  - AC2: Non-admin users are redirected to an access denied page or login
  - AC3: Admin dashboard has a navigation menu with links to different sections
  - AC4: Dashboard displays user role and session information
  - AC5: Dashboard UI follows the established design system
- **Tasks (Optional Initial Breakdown):**
  - [x] Create admin dashboard page structure
  - [x] Implement Auth.js session check middleware
  - [x] Create access denied page
  - [x] Build dashboard layout with navigation
  - [x] Add session display component
  - [x] Style with Shadcn UI components
- **Dependencies:** Story 1.1

---

### Story 1.3: Admin Dashboard - Add & Link Restaurant and Restaurant User

- **User Story / Goal:** As an admin, I want to add restaurants and create associated user accounts so that restaurant owners can access the platform.
- **Detailed Requirements:**
  - Create a form for adding new restaurants with required fields (name, description, contact info, service area text)
  - Implement tRPC procedure for saving restaurant data to the database
  - Create a form for creating a new user account linked to a specific restaurant
  - Implement tRPC procedure for creating a user with 'Restaurant' role linked to a restaurant
  - Update database schema to establish relationship between restaurants and users
  - Add validation for required fields
- **Acceptance Criteria (ACs):**
  - AC1: Admin can fill and submit a form to add a new restaurant
  - AC2: Restaurant data is saved to the database
  - AC3: Admin can create a new user account with 'Restaurant' role
  - AC4: User is linked to a specific restaurant in the database
  - AC5: Form validation prevents submission of invalid data
- **Tasks (Optional Initial Breakdown):**
  - [x] Update Prisma schema for restaurant-user relationship
  - [x] Create restaurant addition form
  - [x] Implement tRPC procedure for adding restaurants
  - [x] Create user creation form with restaurant selection
  - [x] Implement tRPC procedure for adding restaurant users
  - [x] Add form validation
- **Dependencies:** Story 1.2

---

### Story 1.4: Admin Dashboard - Restaurant Listing View

- **User Story / Goal:** As an admin, I want to view all registered restaurants and their associated users so that I can manage restaurant accounts.
- **Detailed Requirements:**
  - Create a restaurants table view in the admin dashboard
  - Implement tRPC procedure to fetch all restaurants with their linked users
  - Display restaurant name, description, contact info, and linked user(s)
  - Add pagination if number of restaurants exceeds display limit
  - Implement sorting and filtering options
  - Include links to edit restaurant details (placeholder for future implementation)
- **Acceptance Criteria (ACs):**
  - AC1: Admin dashboard displays a table of all restaurants
  - AC2: Table shows restaurant details and associated user(s)
  - AC3: Data is fetched from the database using a protected tRPC procedure
  - AC4: Table supports pagination if needed
  - AC5: Table supports basic sorting and filtering
- **Tasks (Optional Initial Breakdown):**
  - [x] Create restaurant listing page in admin dashboard
  - [x] Implement tRPC procedure to fetch restaurants with users
  - [x] Build responsive table component with Shadcn UI
  - [x] Add pagination component
  - [x] Implement basic sorting and filtering
  - [x] Add placeholder edit links
- **Dependencies:** Story 1.3

## Change Log

| Change        | Date       | Version | Description                          | Author         |
| ------------- | ---------- | ------- | ------------------------------------ | -------------- |
| Initial draft | 2025-05-11 | 0.1     | Created initial Epic 1 documentation | GitHub Copilot |

<!-- Generated by GitHub Copilot -->
