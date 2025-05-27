# Story 4.2: Restaurant Menu Page

Status: Ready

## Goal & Context

**User Story:** As a customer, I want to view a restaurant's menu so that I can see what food items are available.

**Context:** This is the second story in Epic 4 (Customer Facing - Browse & Cart). Building upon the homepage with restaurant listings created in Story 4.1, this story focuses on implementing the individual restaurant menu pages. This allows customers to view specific restaurant information and browse available menu items grouped by category, which is a critical step before adding items to their cart.

## Detailed Requirements

- Create a dynamic route/page for individual restaurant menus (e.g., `/restaurants/[slug]`)
- Implement tRPC procedures to:
  - Fetch restaurant details by slug/id
  - Fetch available menu items (not marked as unavailable or soft-deleted) for the selected restaurant
- Display restaurant information:
  - Name
  - Description (if available)
  - Logo/image (if available)
  - Other relevant information (e.g., contact details, hours)
- Group menu items by category and display them in sections
- For each menu item, display:
  - Name
  - Description
  - Price
  - Image (if available)
- Implement proper loading states for data fetching
- Handle error states (restaurant not found, no menu items available)
- Set up all static text for localization (English and French)
- Apply styling consistent with the DoorDash-inspired orange theme
- Ensure the layout is responsive across different screen sizes (mobile, tablet, desktop)

## Acceptance Criteria (ACs)

- AC1: A dynamic route/page exists for viewing individual restaurant menus
- AC2: The page displays the restaurant's name, description, and other relevant details
- AC3: Menu items are fetched from the database via public tRPC procedures
- AC4: Menu items are grouped by category and displayed in a logical, easy-to-browse layout
- AC5: Each menu item displays its name, description, and price
- AC6: Only available menu items (not marked as unavailable or soft-deleted) are shown
- AC7: Appropriate loading states are shown while data is being fetched
- AC8: Error states are handled gracefully (restaurant not found, no menu items)
- AC9: All static text on the page is properly localized and language switching works
- AC10: The layout is responsive and adapts to different screen sizes

## Technical Implementation Context

**Guidance:** Use the following details for implementation. Developer agent is expected to follow project standards and understand the project structure. Only story-specific details are included below.

### Relevant Files:

- **Files to Create/Modify:**
  - `app/restaurants/[slug]/page.tsx` - Dynamic page for restaurant menu
  - `app/restaurants/[slug]/loading.tsx` - Loading state for menu page
  - `app/restaurants/[slug]/not-found.tsx` - Not found state for invalid restaurant
  - `components/restaurant/RestaurantInfo.tsx` - Component to display restaurant information
  - `components/restaurant/MenuList.tsx` - Component to display the menu items list
  - `components/restaurant/MenuCategory.tsx` - Component for displaying a category of menu items
  - `components/restaurant/MenuItem.tsx` - Component for displaying individual menu items
  - `server/trpc/routers/public.ts` - Add tRPC procedures for fetching restaurant details and menu items

### Key Technologies:

- Next.js App Router for dynamic routing
- tRPC for data fetching
- Prisma for database access
- Shadcn UI components for UI elements
- Tailwind CSS for styling
- react-i18next for localization
- React server components and client components where appropriate

### API Interactions / SDK Usage:

- tRPC public procedure for fetching restaurant details by slug/id
- tRPC public procedure for fetching available menu items by restaurant id
- Optional: Image optimization with Next.js Image component for menu item images

### UI/UX Notes:

- Follow the DoorDash-inspired orange theme
- Use a sticky restaurant header with key information
- Implement a category navigation system:
  - Mobile: Horizontal scrollable tabs/buttons
  - Desktop: Sticky sidebar or horizontal navigation
- Display menu items in a responsive grid or list:
  - Mobile: List view with items stacked vertically
  - Desktop: Grid or enhanced list with more details
- Show clear visual separation between categories
- Use appropriate spacing and typography for readability
- Consider implementing smooth scrolling between categories
- Display appropriate placeholders for missing images

### Data Structures:

- Restaurant details structure:

  ```typescript
  interface RestaurantDetails {
    id: string;
    name: string;
    slug: string;
    description?: string;
    imageUrl?: string;
    address?: string;
    contactInfo?: string;
    // Any other relevant restaurant info
  }
  ```

- Menu item structure:

  ```typescript
  interface MenuItem {
    id: string;
    name: string;
    description?: string;
    price: number;
    category: string;
    imageUrl?: string;
    // Any other relevant menu item info
  }
  ```

- tRPC query response structures:

  ```typescript
  interface GetRestaurantResponse {
    restaurant: RestaurantDetails | null;
  }

  interface GetMenuItemsResponse {
    menuItems: MenuItem[];
    categories: string[]; // Distinct categories
  }
  ```

### Environment Variables:

- N/A for this story (using existing configurations)

### Coding Standards Notes:

- Use server components for initial data fetching where possible
- Use client components for interactive elements
- Follow proper image optimization practices using Next.js Image component
- Use the Next.js not-found API for handling non-existent restaurants
- Implement proper loading states and error boundaries
- Use proper TypeScript typing for all components and data
- Follow the established localization patterns using translation keys
- Ensure semantic HTML for better accessibility (e.g., proper heading structure for categories)
- Format prices using appropriate locale formatting

## Tasks / Subtasks

- [ ] Create dynamic route for restaurant menu page
- [ ] Create loading and not-found states for the route
- [ ] Implement tRPC procedure to fetch restaurant details by slug/id
- [ ] Implement tRPC procedure to fetch available menu items by restaurant id
- [ ] Create RestaurantInfo component to display restaurant details
- [ ] Create MenuCategory component for displaying menu item categories
- [ ] Create MenuItem component for displaying individual menu items
- [ ] Implement category grouping logic for menu items
- [ ] Create responsive layout for the menu page
- [ ] Add category navigation system
- [ ] Set up localization for all static text
- [ ] Style all components according to the design system
- [ ] Implement proper loading states during data fetching
- [ ] Add error handling for not found restaurants and empty menus
- [ ] Write tests for components and tRPC procedures

## Testing Requirements

**Guidance:** Verify implementation against the ACs using the following tests.

### Unit Tests:

- Test RestaurantInfo component rendering with various props
- Test MenuList component with different categories and items
- Test MenuItem component rendering with various props
- Test Empty state component rendering
- Test Loading state component rendering
- Test tRPC procedures for fetching restaurant details and menu items

### Integration Tests:

- Test restaurant menu page rendering with the application layout
- Test restaurant and menu item data fetching with actual data
- Test category grouping functionality
- Test language switching functionality on the menu page

### Manual/CLI Verification:

- Navigate to a restaurant menu page using a valid restaurant slug
- Verify that restaurant details are displayed correctly
- Verify that menu items are grouped by category
- Verify that only available items are displayed
- Verify item details (name, description, price) are displayed correctly
- Switch language and verify that all text is properly translated
- Test the responsive layout on different screen sizes (mobile, tablet, desktop)
- Verify proper loading states during data fetching
- Test error states by navigating to a non-existent restaurant slug
- Verify empty state when a restaurant has no menu items

## Story Wrap Up (Agent Populates After Execution)

**Agent Model Used:**
**Completion Notes:**

**Change Log:**

- Initial Draft: Created story structure for Restaurant Menu Page
