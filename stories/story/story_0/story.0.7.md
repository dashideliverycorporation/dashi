<!-- filepath: c:\Users\rukun\Desktop\dashi\stories\story\story.0.7.md -->

# Story 0.7: tRPC Core Setup

Status: Completed

## Goal & Context

**User Story:** As a developer, I want to set up tRPC with Next.js and React Query so that we can build type-safe API endpoints and client-side data fetching.

**Context:** This is the seventh story in Epic 0 (Initial Project & Core Infrastructure Setup). It focuses on implementing tRPC to enable end-to-end typesafe APIs in our Next.js application. tRPC will allow us to define server-side procedures that clients can call with full type safety, eliminating the need for manual API documentation and reducing the risk of type errors.

## Detailed Requirements

- Install tRPC core libraries, supporting packages, and necessary dependencies
- Set up the tRPC router, context, and initial procedures skeleton
- Create the catch-all tRPC API route handler for Next.js App Router
- Set up the tRPC client and React Query provider on the frontend
- Configure tRPC with superjson for enhanced serialization
- Integrate Zod for input validation in tRPC procedures
- Create a sample tRPC procedure to verify the setup

## Acceptance Criteria (ACs)

- AC1: tRPC core libraries are properly installed and configured
- AC2: tRPC router, context, and initial procedure skeleton are set up and working
- AC3: The API route handler correctly processes tRPC requests
- AC4: The tRPC client is properly configured and connected to the server
- AC5: React Query provider is set up and working with tRPC
- AC6: A sample tRPC procedure can be called from the client with full type safety

## Technical Implementation Context

**Guidance:** Use the following details for implementation. Developer agent is expected to follow project standards and understand the project structure. Only story-specific details are included below.

### Relevant Files:

- **Files to Create:**

  - `server/trpc/root.ts` - Root tRPC router
  - `server/trpc/trpc.ts` - tRPC context and procedure builders
  - `server/trpc/routers/example.ts` - Example router with sample procedures
  - `app/api/trpc/[trpc]/route.ts` - API route handler for tRPC
  - `app/lib/trpc/client.ts` - tRPC client configuration
  - `app/lib/trpc/Provider.tsx` - React Query provider for tRPC

- **Files to Modify:**
  - `app/layout.tsx` - Add tRPC provider
  - `app/page.tsx` - Add example usage of tRPC procedure

### Key Technologies:

- Next.js (App Router)
- TypeScript
- tRPC
- React Query
- Zod
- superjson

### API Interactions / SDK Usage:

- tRPC for type-safe API endpoints
- React Query for data fetching and caching
- Zod for input validation

### Data Structures:

- tRPC context type definition
- tRPC router type exports
- Zod schemas for procedure input validation

### Environment Variables:

- No new environment variables required specifically for tRPC

### Coding Standards Notes:

- Follow tRPC best practices for Next.js App Router
- Ensure proper TypeScript typing for all tRPC components
- Use Zod schemas for input validation
- Create modular router structure for scalability
- Export type definitions for client usage

## Tasks / Subtasks

- [x] Install tRPC core libraries: `pnpm add @trpc/server @trpc/client @trpc/react-query @trpc/next`
- [x] Install supporting libraries: `pnpm add zod superjson @tanstack/react-query`
- [x] Create tRPC base configuration file with context definition
- [x] Set up tRPC procedure builders with appropriate middleware
- [x] Create initial root router that combines sub-routers
- [x] Implement example router with sample procedures
- [x] Create tRPC API route handler for Next.js App Router
- [x] Configure tRPC client with superjson transformer
- [x] Set up React Query provider for tRPC
- [x] Add tRPC provider to the application layout
- [x] Implement sample usage of tRPC procedure in a page component

## Testing Requirements

**Guidance:** Verify implementation against the ACs using the following tests.

### Unit Tests:

- Test tRPC procedure builders and middleware
- Test sample tRPC procedures with mocked context

### Integration Tests:

- Test tRPC router integration
- Test tRPC API handler with HTTP requests

### Manual Verification:

- Verify that a sample tRPC procedure can be called from a page component
- Check that type safety is maintained across client-server boundary
- Confirm that React Query is properly caching tRPC procedure results
- Validate that input validation works correctly with Zod schemas

## Story Wrap Up (Agent Populates After Execution)

**Agent Model Used:**
**Completion Notes:**
**Change Log:**

- Initial Draft
