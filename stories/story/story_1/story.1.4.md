# Story 1.4: Admin Dashboard - Restaurant Listing View

Status: Completed

## Goal & Context

**User Story:** As an admin, I want to view all registered restaurants and their associated users so that I can manage restaurant accounts effectively.

**Context:** This is the fourth story in Epic 1 (Authentication & User/Restaurant Admin Management). It focuses on implementing a restaurant listing view in the admin dashboard to display all registered restaurants and their associated user accounts. This view is essential for administrators to manage and monitor restaurant accounts on the platform.

## Detailed Requirements

- Create a restaurant listing page in the admin dashboard
- Implement tRPC procedure to fetch all restaurants with their linked users
- Display restaurants in a table format with essential information (name, description, contact info, service area)
- Show associated users for each restaurant
- Implement pagination if the number of restaurants exceeds the display limit
- Add sorting and filtering capabilities for better user experience
- Include placeholder links for future edit functionality

## Acceptance Criteria (ACs)

- AC1: Admin dashboard has a dedicated page for listing all restaurants
- AC2: Restaurants are displayed in a well-organized table format
- AC3: Each restaurant entry shows its associated user(s)
- AC4: Data is fetched from the database using a protected tRPC procedure
- AC5: Table supports pagination for large datasets
- AC6: Table supports basic sorting (e.g., by name, creation date)
- AC7: Table supports basic filtering (e.g., by name)
- AC8: UI follows the established design system using Shadcn UI components

## Technical Implementation Context

**Guidance:** Use the following details for implementation. Developer agent is expected to follow project standards and understand the project structure. Only story-specific details are included below.

### Relevant Files:

- **Files to Create/Modify:**
  - `app/admin/restaurants/page.tsx` - Restaurant listing page
  - `components/admin/RestaurantTable.tsx` - Table component for restaurant listing
  - `server/trpc/routers/restaurant.ts` - tRPC procedure for fetching restaurants
  - `lib/types/restaurant.ts` - Types for restaurant data and table structure

### Key Technologies:

- Next.js App Router for page structure
- tRPC for type-safe data fetching
- Shadcn UI Table component
- React for component building
- Tailwind CSS for styling

### API Interactions / SDK Usage:

- tRPC client for data fetching
- Prisma Client for database queries

### UI/UX Notes:

- Table should be clean, organized, and easy to scan
- Use appropriate column widths and cell padding for readability
- Include visual indicators for sortable columns
- Pagination controls should be intuitive and accessible
- Follow the DoorDash-inspired orange theme for UI elements

### Data Structures:

- Restaurant data with associated users
- Table column definition
- Pagination state
- Sorting state
- Filtering state

### Environment Variables:

- N/A for this story (using existing configuration)

### Coding Standards Notes:

- Implement proper loading states during data fetching
- Handle empty states gracefully (e.g., "No restaurants found")
- Implement error handling for failed data fetching
- Use proper TypeScript typing for all data structures
- Follow the component structure established in Epic 0

## Tasks / Subtasks

- [x] Create tRPC procedure to fetch restaurants with associated users
- [x] Build restaurant table component with Shadcn UI
- [x] Implement pagination for the restaurant table
- [x] Add sorting functionality for relevant columns
- [x] Add filtering capability for restaurant name
- [x] Style table according to the design system
- [x] Handle loading, empty, and error states
- [x] Add placeholder edit links for future functionality
- [x] Create responsive design for different screen sizes
- [x] Write tests for the restaurant listing functionality
  - [x] Unit test for tRPC restaurant fetching procedure
  - [x] Unit test for restaurant table component rendering
  - [x] Unit test for pagination functionality
  - [x] Unit test for sorting functionality
  - [x] Unit test for filtering capability

## Testing Requirements

**Guidance:** Verify implementation against the ACs using the following tests.

### Unit Tests:

- Test tRPC procedure for fetching restaurants
- Test restaurant table component rendering
- Test pagination functionality
- Test sorting functionality
- Test filtering functionality

### Integration Tests:

- Test end-to-end restaurant listing flow
- Test restaurant listing with different data scenarios
- Test table behavior with large datasets

### Manual/CLI Verification:

- Verify restaurant listing page loads correctly
- Check that restaurants and their associated users are displayed correctly
- Test pagination by adding multiple restaurants
- Test sorting by different columns
- Test filtering functionality
- Verify responsive design on different screen sizes

## Story Wrap Up (Agent Populates After Execution)

**Agent Model Used:**
**Completion Notes:**
**Change Log:**

- Initial Draft: Created story structure for restaurant listing view
