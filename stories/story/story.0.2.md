# Story 0.2: Database Setup (PostgreSQL)

Status: Completed

## Goal & Context

**User Story:** As a developer, I want to set up the PostgreSQL database with Prisma ORM and define the initial schema so that we can store and query application data in a structured manner.

**Context:** This is the second story in Epic 0 (Initial Project & Core Infrastructure Setup). It focuses on setting up the database infrastructure for the Dashi platform. We will use PostgreSQL as our database and Prisma as the ORM for database interactions. This foundation is critical for all data-dependent features in subsequent epics.

## Detailed Requirements

- Set up Prisma ORM in the project
- Define the initial database schema for core entities:
  - User (with roles: Customer, Restaurant, Admin)
  - Restaurant (profile data)
  - MenuItem (restaurant menu items)
  - Order (customer orders)
  - OrderItem (items within an order)
- Implement proper relations between entities
- Configure database connection
- Set up migration workflow
- Create seed data script for development

## Acceptance Criteria (ACs)

- AC1: Prisma ORM is properly integrated into the Next.js project
- AC2: Database schema is defined with appropriate relations between entities
- AC3: Environment variables for database connection are properly configured
- AC4: Database migrations can be applied successfully
- AC5: Seed script successfully populates the database with initial test data
- AC6: Prisma client can be used to query the database

## Technical Implementation Context

**Guidance:** Use the following details for implementation. Developer agent is expected to follow project standards and understand the project structure. Only story-specific details are included below.

### Relevant Files:

- **Files to Create:**

  - `/prisma/schema.prisma` - Prisma schema file
  - `/prisma/seed.ts` - Database seeding script
  - `/lib/db.ts` - Prisma client singleton
  - `.env` - Environment variables file
  - `.env.example` - Example environment variables file

- **Files to Modify:**
  - `package.json` - Add Prisma dependencies and scripts
  - `.gitignore` - Add database-related entries

### Key Technologies:

- Prisma ORM
- PostgreSQL
- TypeScript
- Next.js (App Router)

### API Interactions / SDK Usage:

- Prisma Client API for database interactions

### UI/UX Notes:

- N/A for this infrastructure-focused story

### Data Structures:

- **User**: Basic user information with role-based access (Customer, Restaurant, Admin)
- **Restaurant**: Restaurant profile information (name, description, contact, etc.)
- **MenuItem**: Food items with names, descriptions, prices, categories
- **Order**: Order information with status tracking
- **OrderItem**: Individual items within an order with quantities and prices

### Environment Variables:

- `DATABASE_URL`: Connection string for PostgreSQL database
- `DIRECT_URL`: Direct connection string (for Prisma, if needed)

### Coding Standards Notes:

- Follow Prisma naming conventions (PascalCase for models, camelCase for fields)
- Use soft deletes for MenuItem and Restaurant entities
- Set up proper relations with referential integrity
- Use enums for pre-defined values like OrderStatus
- Document schema with appropriate comments
- Ensure type safety with Prisma client
- Implement timestamp fields (createdAt, updatedAt) for all entities

## Tasks / Subtasks

- [x] Install Prisma dependencies: `pnpm add -D prisma`, `pnpm add @prisma/client`
- [x] Initialize Prisma: `pnpx prisma init`
- [x] Define the initial schema in `prisma/schema.prisma` for core entities
- [x] Set up proper relations between entities in the schema
- [x] Configure environment variables for database connection
- [x] Create a `.env.example` file with placeholder values
- [x] Create a Prisma client singleton in `/lib/db.ts`
- [x] Create the initial migration: `pnpx prisma migrate dev --name init`
- [x] Implement seed script in `prisma/seed.ts`
- [x] Configure the seed script in `package.json`
- [x] Run seed script to populate development database: `pnpx prisma db seed`
- [x] Add database-related entries to `.gitignore`
- [x] Test database connection and queries using Prisma client
- [x] Commit changes with appropriate message following the commit convention

## Testing Requirements

**Guidance:** Verify implementation against the ACs using the following tests.

### Unit Tests:

- Test that the Prisma client singleton properly initializes and connects

### Integration Tests:

- N/A for this infrastructure setup story

### Manual/CLI Verification:

- Run `pnpx prisma migrate dev` to verify migrations apply correctly
- Run `pnpx prisma db seed` to verify seed script works correctly
- Run `pnpx prisma studio` to visually inspect the database schema and data
- Verify relations between entities work as expected using Prisma Studio
- Test basic CRUD operations using Prisma client in a test script

## Story Wrap Up (Agent Populates After Execution)

**Agent Model Used:** GitHub Copilot
**Completion Notes:** Successfully set up the PostgreSQL database with Prisma ORM for the Dashi platform. Created the database schema with all required entities (User, Customer, Restaurant, MenuItem, Order, OrderItem) and their relationships. Implemented proper timestamps, soft deletes, and enum values. Generated migrations, created a seed script with test data, and verified the database connection and queries work correctly.
**Change Log:**

- Initial Draft
- May 6, 2025: Completed implementation
