# Epic 0: Initial Project & Core Infrastructure Setup

**Goal:** Establish the foundational technical environment and integrate core libraries needed for the Dashi food delivery platform.

**Deployability:** This epic establishes the technical foundation for all future development. While it doesn't deliver customer-facing functionality, it creates a fully deployable initial environment with all core infrastructure components configured and tested.

## Epic-Specific Technical Context

This epic requires setting up several key infrastructure components:

1. **Development Environment**: Node.js, pnpm, TypeScript, ESLint
2. **Application Framework**: Next.js with App Router
3. **Database**: PostgreSQL with Prisma ORM
4. **UI Components**: Shadcn UI with Tailwind CSS
5. **Testing Framework**: Jest with React Testing Library
6. **Authentication**: Auth.js (formerly NextAuth.js)
7. **API Layer**: tRPC with React Query and Zod
8. **Email Service**: Resend
9. **Internationalization**: react-i18next
10. **Hosting Platform**: Vercel

## Local Testability & Command-Line Access

- **Local Development:**

  - Run `pnpm dev` to start the Next.js development server
  - Run `pnpm db:studio` to access Prisma Studio for database exploration
  - Run `pnpm test` to run the test suite
  - Run `pnpm build` followed by `pnpm start` to test the production build locally

- **Command-Line Testing:**

  - `pnpm prisma db push` to sync the schema to the database
  - `pnpm prisma generate` to generate the Prisma client
  - `pnpm prisma studio` to explore the database
  - `pnpm email:test` (custom script to be created) to test email sending

- **Environment Testing:**

  - Local: Use `.env.local` for development environment variables
  - Development: Vercel preview deployments for each PR
  - Production: Main branch deployment on Vercel

- **Testing Prerequisites:**
  - Local PostgreSQL database or connection to a remote development database
  - Resend API key for email testing
  - Environment variables configured in `.env.local` and Vercel

## Story List

### Story 0.1: Project Initialization & Basic Structure

- **User Story / Goal:** As a developer, I want to initialize the Next.js project with the appropriate configuration so that we have a solid foundation for development.
- **Detailed Requirements:**
  - Install Node.js, pnpm, and other required development tools
  - Create a new Next.js project with App Router, TypeScript, ESLint, Tailwind CSS, and `/` directory structure
  - Set up the basic project structure following Next.js App Router conventions
  - Initialize Git repository with appropriate `.gitignore`
  - Configure basic ESLint rules
  - Set up initial README.md with project overview and setup instructions
- **Acceptance Criteria (ACs):**
  - AC1: Next.js boilerplate application runs successfully with `pnpm dev`
  - AC2: TypeScript is properly configured with strict type checking
  - AC3: ESLint is properly configured and runs without errors
  - AC4: Project is under Git version control with appropriate `.gitignore`
  - AC5: Project structure follows Next.js App Router conventions with `app/` directory
- **Tasks (Optional Initial Breakdown):**
  - [x] Install Node.js and pnpm
  - [x] Create Next.js project using `create-next-app`
  - [x] Configure TypeScript settings
  - [x] Initialize Git repository
  - [x] Update README.md with project information
- **Dependencies:** None (starts the project)

---

### Story 0.2: Database Setup (PostgreSQL & Prisma)

- **User Story / Goal:** As a developer, I want to set up the PostgreSQL database with Prisma ORM so that we have a reliable data storage and type-safe database access.
- **Detailed Requirements:**
  - Set up a PostgreSQL database instance (locally for development)
  - Install Prisma CLI and client
  - Initialize Prisma in the project
  - Configure `DATABASE_URL` in `.env`
  - Define initial database schema for core entities (User, Restaurant, MenuItem, Order, OrderItem)
  - Run initial database migration
  - Create a database connection test utility
- **Acceptance Criteria (ACs):**
  - AC1: Prisma is properly installed and configured
  - AC2: Database schema is defined according to the data models outlined in the architecture document
  - AC3: Initial migration runs successfully and creates the required tables
  - AC4: Application can connect to the database and perform basic operations
  - AC5: A utility exists to verify database connection
- **Tasks (Optional Initial Breakdown):**
  - [x] Install PostgreSQL locally or set up a cloud instance
  - [x] Install Prisma dependencies
  - [x] Create initial Prisma schema
  - [x] Configure environment variables
  - [x] Run initial migration
  - [x] Create database connection test
- **Dependencies:** Story 0.1

---

### Story 0.3: Hosting Setup (Vercel)

- **User Story / Goal:** As a developer, I want to set up Vercel hosting for automated deployments so that our application is accessible online and can be easily updated.
- **Detailed Requirements:**
  - Create a Vercel account if not already available
  - Connect the Git repository to Vercel
  - Configure environment variables in Vercel for database connection and other secrets
  - Set up deployment settings for Preview Environments (PRs) and Production
  - Perform an initial deployment to verify the setup
- **Acceptance Criteria (ACs):**
  - AC1: Git repository is connected to Vercel
  - AC2: Environment variables are properly configured in Vercel
  - AC3: Initial deployment completes successfully
  - AC4: Application is accessible via the Vercel-provided URL
  - AC5: Preview Environments are configured for Pull Requests
- **Tasks (Optional Initial Breakdown):**
  - [x] Create or access Vercel account
  - [x] Connect repository to Vercel
  - [x] Configure environment variables
  - [x] Deploy initial application
  - [x] Test deployed application
- **Dependencies:** Story 0.1

---

### Story 0.4: UI Library Setup (Shadcn UI)

- **User Story / Goal:** As a developer, I want to set up Shadcn UI with a custom orange theme so that we have consistent, reusable UI components that match our DoorDash-inspired design.
- **Detailed Requirements:**
  - Install Shadcn UI into the Next.js project
  - Configure tailwind.config.js with the orange color theme based on DoorDash aesthetic
  - Set up the custom theme variables in the CSS
  - Add and test a few basic Shadcn components on a test page (e.g., Button, Card)
  - Create a theme toggle component for light/dark mode
- **Acceptance Criteria (ACs):**
  - AC1: Shadcn UI is successfully installed and configured
  - AC2: Tailwind CSS is configured with the orange theme
  - AC3: Basic UI components render correctly with the custom theme
  - AC4: Light/dark mode toggle functions correctly
  - AC5: Component styling matches the DoorDash-inspired aesthetic
- **Tasks (Optional Initial Breakdown):**
  - [x] Install Shadcn UI and dependencies
  - [x] Configure Tailwind CSS
  - [x] Set up theme colors
  - [x] Create test page with components
  - [x] Implement theme toggle
- **Dependencies:** Story 0.1

---

### Story 0.5: Testing Framework Setup

- **User Story / Goal:** As a developer, I want to set up a comprehensive testing framework so that we can ensure code quality and prevent regressions.
- **Detailed Requirements:**
  - Install Jest, React Testing Library, and necessary Next.js testing utilities
  - Configure Jest (jest.config.js) for the Next.js project
  - Set up testing environment with appropriate mocks for Next.js and other dependencies
  - Write a simple unit test for a basic utility function
  - Write a simple component test for a UI component
  - Add test scripts to package.json
  - Configure test coverage reporting
- **Acceptance Criteria (ACs):**
  - AC1: Jest and React Testing Library are properly installed and configured
  - AC2: Test command (`pnpm test`) runs successfully
  - AC3: Sample unit test passes
  - AC4: Sample component test passes
  - AC5: Test coverage report is generated
- **Tasks (Optional Initial Breakdown):**
  - [x] Install testing dependencies
  - [x] Configure Jest
  - [x] Create sample tests
  - [x] Add test scripts to package.json
  - [x] Configure coverage reporting
- **Dependencies:** Story 0.1, Story 0.4

---

### Story 0.6: Authentication Library Setup (Auth.js)

- **User Story / Goal:** As a developer, I want to set up Auth.js (NextAuth.js) with email/password authentication so that users can register and log in to the system.
- **Detailed Requirements:**
  - Install Auth.js and necessary adapters (e.g., Prisma adapter)
  - Configure Auth.js provider (CredentialsProvider for email/password)
  - Set up environment variables for Auth.js secrets
  - Integrate Auth.js session provider in the Next.js application
  - Create basic sign-in and sign-up pages with forms
  - Implement utility functions for checking authentication status and user roles
- **Acceptance Criteria (ACs):**
  - AC1: Auth.js is properly installed and configured
  - AC2: Email/password authentication works correctly
  - AC3: User sessions are maintained across page navigations
  - AC4: Protected routes are properly guarded
  - AC5: User roles (Customer, Restaurant, Admin) are properly handled
- **Tasks (Optional Initial Breakdown):**
  - [x] Install Auth.js and Prisma adapter
  - [x] Configure Auth.js
  - [x] Create sign-in and sign-up pages
  - [x] Implement session provider
  - [x] Create authentication utilities
- **Dependencies:** Story 0.1, Story 0.2

---

### Story 0.7: tRPC Core Setup

- **User Story / Goal:** As a developer, I want to set up tRPC with React Query for type-safe API communication so that we have end-to-end type safety between frontend and backend.
- **Detailed Requirements:**
  - Install tRPC core libraries, `@trpc/react-query`, `@trpc/next`, `zod`, `superjson`
  - Set up the tRPC router, context, and initial procedures skeleton (`/server/trpc`)
  - Create the catch-all tRPC API route handler (`/app/api/trpc/[...trpc]/route.ts`)
  - Set up the tRPC client and React Query provider on the frontend
  - Create a simple procedure and test the end-to-end type safety
  - Implement tRPC middleware for handling authentication
- **Acceptance Criteria (ACs):**
  - AC1: tRPC is properly installed and configured
  - AC2: tRPC router is set up with context and procedures
  - AC3: API route handler is working correctly
  - AC4: tRPC client is connected to the backend
  - AC5: Type safety works end-to-end
  - AC6: Authentication middleware is integrated with tRPC
- **Tasks (Optional Initial Breakdown):**
  - [x] Install tRPC dependencies
  - [x] Set up tRPC server router and context
  - [x] Create API route handler
  - [x] Configure tRPC client
  - [x] Create and test a simple procedure
  - [x] Implement authentication middleware
- **Dependencies:** Story 0.1, Story 0.6

---

### Story 0.8: Email Service Setup (Resend)

- **User Story / Goal:** As a developer, I want to integrate the Resend email service so that the system can send transactional emails like order notifications.
- **Detailed Requirements:**
  - Create Resend account, verify domain/email
  - Obtain Resend API key
  - Install Resend SDK
  - Add `RESEND_API_KEY` to environment variables
  - Create a utility module for sending emails using Resend
  - Implement a basic email template for testing
  - Create a test function to verify email sending
- **Acceptance Criteria (ACs):**
  - AC1: Resend account is created and configured
  - AC2: Resend SDK is properly installed
  - AC3: Email utility module is created
  - AC4: Test email can be sent successfully
  - AC5: Email template renders correctly
- **Tasks (Optional Initial Breakdown):**
  - [x] Create Resend account
  - [x] Obtain and configure API key
  - [x] Install Resend SDK
  - [x] Create email utility module
  - [x] Implement test email template
  - [x] Create and run test function
- **Dependencies:** Story 0.1

---

### Story 0.9: Localization Framework Setup (react-i18next)

- **User Story / Goal:** As a developer, I want to set up a localization framework with English and French support so that the application can be used in both languages.
- **Detailed Requirements:**
  - Install `react-i18next` and necessary dependencies
  - Configure i18n instance with English and French locales
  - Set up translation files structure
  - Integrate i18n provider in the Next.js application
  - Implement a language switcher component
  - Create sample translations for testing
  - Update the main layout to include the language switcher
- **Acceptance Criteria (ACs):**
  - AC1: react-i18next is properly installed and configured
  - AC2: Translation files are set up for English and French
  - AC3: i18n provider is integrated in the application
  - AC4: Language switcher works correctly
  - AC5: Sample content is correctly translated when language is changed
- **Tasks (Optional Initial Breakdown):**
  - [x] Install react-i18next
  - [x] Configure i18n instance
  - [x] Create translation files
  - [x] Implement i18n provider
  - [x] Create language switcher component
  - [x] Add sample translations
  - [x] Update layout
- **Dependencies:** Story 0.1

## Change Log

| Change        | Date       | Version | Description                          | Author         |
| ------------- | ---------- | ------- | ------------------------------------ | -------------- |
| Initial draft | 2025-05-05 | 0.1     | Created initial Epic 0 documentation | GitHub Copilot |
| Update tasks  | 2025-05-10 | 0.2     | Marked all tasks as completed        | GitHub Copilot |

<!-- Generated by Copilot -->
