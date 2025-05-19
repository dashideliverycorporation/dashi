# Story 3.2: Restaurant Dashboard - Menu Item Listing

Status: In-Progress

## Goal & Context

**User Story:** As a restaurant user, I want to view a list of all my menu items so that I can manage my restaurant's offerings.

**Context:** This is the second story in Epic 3 (Restaurant Menu Management). Following the establishment of the protected restaurant dashboard in story 3.1, this story focuses on creating the core menu item listing view. This view will display all menu items associated with the logged-in restaurant and serve as the foundation for menu management features.

## Detailed Requirements

- Create a dedicated `/restaurant/menu` route for menu management
- Implement a tRPC procedure to fetch all menu items for the logged-in restaurant
- Display a list of menu items with the following information for each:
  - Item name
  - Description (if provided)
  - Category
  - Price
  - Image
  - Availability status (available/unavailable)
- Style the menu item list using Shadcn UI components
- Implement a responsive table/card layout that works on different screen sizes
- Show appropriate loading states while data is being fetched
- Display an empty state when no menu items exist
- Ensure the route is protected and only accessible to users with the Restaurant role

## Acceptance Criteria (ACs)

- AC1: The restaurant dashboard has a dedicated menu management section accessible via `/restaurant/menu`
- AC2: Menu items are fetched from the database via a protected tRPC procedure
- AC3: Each menu item displays name, description (if provided), category, price, image, and availability status
- AC4: The menu item list is styled according to the design system using Shadcn UI components
- AC5: The menu item list is responsive and displays appropriately on different screen sizes
- AC6: Loading states are shown while data is being fetched
- AC7: An appropriate empty state is displayed when no menu items exist
- AC8: Only users with the Restaurant role can access this view

## Technical Implementation Context

**Guidance:** Use the following details for implementation. Developer agent is expected to follow project standards and understand the project structure. Only story-specific details are included below.

### Relevant Files:

- **Files to Create/Modify:**
  - `app/restaurant/menu/page.tsx` - Restaurant menu items listing page
  - `restaurant/components/menu-item.tsx` - Component for displaying individual menu items
  - `server/trpc/routers/restaurant.ts` - tRPC router for restaurant procedures (add menu item fetch procedure)
  - `types/restaurant.ts` - Update or add menu item type definitions if needed

### Key Technologies:

- Next.js App Router for routing
- tRPC for data fetching
- Prisma for database access
- Shadcn UI components for UI
- Tailwind CSS for styling
- React server components and client components where appropriate

### API Interactions / SDK Usage:

- tRPC procedure for fetching menu items
- Auth.js for session verification and restaurant ID retrieval
- Prisma client for database access

### UI/UX Notes:

- Follow the DoorDash-inspired orange theme
- Use a responsive design that displays as a table on larger screens and cards on smaller screens
- Include visual indicators for item availability status (e.g., badge or toggle)
- Use consistent spacing, typography, and colors from the design system
- Ensure appropriate loading and empty states are visually pleasing

### Data Structures:

- Menu Item data structure should include:
  ```typescript
  interface MenuItem {
    id: string;
    name: string;
    description?: string; // Optional description
    price: number;
    category: string;
    imageUrl: string; // Required image URL for displaying the menu item
    available: boolean;
    restaurantId: string;
    createdAt: Date;
    updatedAt: Date;
  }
  ```

### Environment Variables:

- N/A for this story (using existing configurations)

### Coding Standards Notes:

- Separate data fetching logic from presentation components
- Use proper TypeScript typing for all components and data
- Follow React best practices for conditional rendering and lists
- Implement responsive design using Tailwind CSS utilities
- Use error boundaries for handling potential fetch failures
- Follow existing patterns for tRPC procedures and Prisma access

## Tasks / Subtasks

- [ ] Create restaurant menu page route at `/restaurant/menu`
- [ ] Implement tRPC procedure to fetch menu items for the logged-in restaurant
- [ ] Create Menu page to display the list of menu items
- [ ] Create Menu component for individual menu items
- [ ] Create Empty state for when no items exist
- [ ] Create Loading state for data fetching
- [ ] Style all components using Shadcn UI and the design system
- [ ] Implement responsive design for different screen sizes
- [ ] Add appropriate error handling for data fetching
- [ ] Update the restaurant sidebar to include a link to the menu page
- [ ] Write tests for menu item list components and tRPC procedure

## Testing Requirements

**Guidance:** Verify implementation against the ACs using the following tests.

### Unit Tests:

- Test MenuItemList component rendering with mock data
- Test MenuItemListItem component rendering with various menu item properties
- Test Empty state component rendering
- Test Loading state component rendering
- Test tRPC procedure for fetching menu items

### Integration Tests:

- Test menu page rendering with the restaurant layout
- Test menu item fetching and display with actual data
- Test protected route access for restaurant users vs non-restaurant users

### Manual/CLI Verification:

- Log in with a restaurant user and navigate to the menu management section
- Verify that menu items are displayed correctly with all required information
- Verify that the empty state is displayed when no menu items exist
- Verify that the UI is responsive and displays appropriately on different screen sizes
- Verify that the menu page is only accessible to users with the Restaurant role

## Story Wrap Up (Agent Populates After Execution)

**Agent Model Used:**
**Completion Notes:**

**Change Log:**

- Initial Draft: Created story structure for Restaurant Dashboard - Menu Item Listing
