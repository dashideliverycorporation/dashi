# Story 4.1: Homepage - Restaurant Listing

Status: Ready

## Goal & Context

**User Story:** As a customer, I want to see a list of available restaurants on the homepage so that I can choose where to order from.

**Context:** This is the first story in Epic 4 (Customer Facing - Browse & Cart). It focuses on creating the public-facing homepage that displays active restaurants, allowing customers to browse and select restaurants for viewing their menus. This story lays the foundation for the customer journey from browsing to ordering.

## Detailed Requirements

- Create a public homepage route/page at the root route (`/`)
- Implement a tRPC procedure to fetch all active restaurants (not soft-deleted)
- Design a responsive grid layout for displaying restaurant cards
- Create a RestaurantCard component that displays:
  - Restaurant name
  - Restaurant image/logo (if available)
  - Optional: Brief description or cuisine type
- Make each restaurant card clickable, linking to the respective restaurant menu page
- Implement proper loading states for data fetching
- Handle empty state when no restaurants are available
- Set up all static text for localization (English and French)
- Apply styling consistent with the DoorDash-inspired orange theme
- Ensure the layout is responsive across different screen sizes (mobile, tablet, desktop)

## Acceptance Criteria (ACs)

- AC1: The homepage displays a grid of available restaurant cards
- AC2: Each restaurant card shows at minimum the restaurant name
- AC3: Restaurant data is fetched from the database via a public tRPC procedure
- AC4: Clicking on a restaurant card navigates to that restaurant's menu page
- AC5: Loading states are shown while restaurant data is being fetched
- AC6: An appropriate empty state is displayed when no restaurants are available
- AC7: All static text on the page is properly localized and language switching works
- AC8: The layout is responsive and adapts to different screen sizes
- AC9: The styling follows the project's design system using Shadcn UI components
- AC10: Only active (not soft-deleted) restaurants are displayed

## Technical Implementation Context

**Guidance:** Use the following details for implementation. Developer agent is expected to follow project standards and understand the project structure. Only story-specific details are included below.

### Relevant Files:

- **Files to Create/Modify:**
  - `app/page.tsx` - Homepage with restaurant listing
  - `components/restaurant/RestaurantCard.tsx` - Card component for restaurant display
  - `server/trpc/routers/public.ts` - Add tRPC procedure for fetching public restaurant listings
  - `server/schemas/restaurant.ts` - Schema for restaurant data validation if needed

### Key Technologies:

- Next.js App Router for page routing
- tRPC for data fetching
- Prisma for database access
- Shadcn UI components for UI elements
- Tailwind CSS for styling
- react-i18next for localization
- React server and client components where appropriate

### API Interactions / SDK Usage:

- tRPC public procedure for fetching active restaurant listings
- Optional: Image optimization with Next.js Image component for restaurant logos/images

### UI/UX Notes:

- Follow the DoorDash-inspired orange theme
- Use a responsive grid layout:
  - 1 column on mobile
  - 2 columns on tablet
  - 3+ columns on desktop
- Implement smooth hover effects on restaurant cards
- Display a loading skeleton UI during data fetching
- Show a friendly empty state message when no restaurants are available
- Ensure sufficient spacing between cards for readability
- Consider adding simple animation for page transitions

### Data Structures:

- Restaurant listing data structure:

  ```typescript
  interface RestaurantListing {
    id: string;
    name: string;
    slug?: string; // For URL routing
    description?: string; // Optional short description
    imageUrl?: string; // Optional restaurant image
  }
  ```

- tRPC query response structure:
  ```typescript
  interface GetRestaurantsResponse {
    restaurants: RestaurantListing[];
    totalCount: number; // For potential pagination in future
  }
  ```

### Environment Variables:

- N/A for this story (using existing configurations)

### Coding Standards Notes:

- Use server components for initial data fetching where possible
- Use client components for interactive elements
- Follow proper image optimization practices using Next.js Image component
- Implement proper loading states and error boundaries
- Use proper TypeScript typing for all components and data
- Follow the established localization patterns using translation keys
- Ensure semantic HTML for better accessibility (e.g., proper heading structure)

## Tasks / Subtasks

- [x] Create RestaurantCard component for displaying individual restaurants
- [x] Implement tRPC procedure to fetch active restaurants
- [ ] Create responsive grid layout for restaurant cards
- [ ] Add proper loading states during data fetching
- [ ] Implement empty state for when no restaurants are available
- [ ] Add navigation links to restaurant menu pages
- [ ] Set up localization for all static text
- [ ] Style all components according to the design system
- [ ] Ensure responsive design for different screen sizes
- [ ] Add proper error handling for data fetching
- [ ] Write tests for components and tRPC procedures

## Testing Requirements

**Guidance:** Verify implementation against the ACs using the following tests.

### Unit Tests:

- Test RestaurantCard component rendering with various props
- Test Empty state component rendering
- Test Loading state component rendering
- Test tRPC procedure for fetching active restaurants

### Integration Tests:

- Test homepage rendering with the application layout
- Test restaurant data fetching and display with actual data
- Test navigation from restaurant card to menu page
- Test language switching functionality on the homepage

### Manual/CLI Verification:

- Navigate to the homepage and verify restaurant cards display correctly
- Verify that only active restaurants are displayed
- Click on restaurant cards and verify navigation to their menu pages
- Switch language and verify that all text is properly translated
- Test the responsive layout on different screen sizes (mobile, tablet, desktop)
- Verify proper loading states during data fetching
- Verify the empty state when no restaurants are available (can be tested by modifying query temporarily)

## Story Wrap Up (Agent Populates After Execution)

**Agent Model Used:**
**Completion Notes:**

**Change Log:**

- Initial Draft: Created story structure for Homepage - Restaurant Listing
