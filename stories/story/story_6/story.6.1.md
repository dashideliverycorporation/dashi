# Story 6.1: Restaurant Dashboard - Incoming Order List & Display (incl. Polling)

Status: Ready

## Goal & Context

**User Story:** As a restaurant user, I want to see a list of new and in-progress orders so that I can manage my incoming orders efficiently without manually refreshing.

**Context:** This is the first story in Epic 6 (Restaurant Order Management & Admin Sales Tracking). It focuses on creating a section in the restaurant dashboard that displays incoming orders, allowing restaurant staff to monitor new orders as they arrive. The implementation includes automatic polling to ensure restaurant users see new orders without having to manually refresh the page.

## Detailed Requirements

- Create a protected section/view in the restaurant dashboard
- Implement session check using Auth.js to verify restaurant user role
- Create a protected tRPC procedure to fetch orders for the logged-in restaurant
- Display orders in a list showing:
  - Order ID
  - Timestamp
  - Customer notes
  - Status
  - Total amount
- Implement polling using React Query to automatically refresh orders (e.g., every 30 seconds)
- Sort orders with newest first
- Highlight new orders visually
- Handle empty state (no orders)
- Ensure all static text is set up for localization (English and French)
- Apply styling consistent with the DoorDash-inspired orange theme
- Ensure the layout is responsive across different screen sizes (mobile, tablet, desktop)

## Acceptance Criteria (ACs)

- AC1: The restaurant dashboard shows a list of orders relevant to the logged-in restaurant
- AC2: Each order in the list displays key information (ID, timestamp, customer notes, status, total)
- AC3: New orders appear automatically without manual refresh via polling
- AC4: Orders are sorted with newest first
- AC5: New orders are visually highlighted
- AC6: An appropriate empty state is displayed when no orders are available
- AC7: All static text on the page is properly localized and language switching works
- AC8: The layout is responsive and adapts to different screen sizes
- AC9: The styling follows the project's design system using Shadcn UI components
- AC10: Only orders belonging to the logged-in restaurant are displayed
- AC11: The view is properly protected and only accessible to authenticated restaurant users

## Technical Implementation Context

**Guidance:** Use the following details for implementation. Developer agent is expected to follow project standards and understand the project structure. Only story-specific details are included below.

### Relevant Files:

- **Files to Create/Modify:**
  - `app/restaurant/orders/page.tsx` - Restaurant orders list page
  - `components/restaurant/OrdersList.tsx` - Component for displaying the list of orders
  - `components/restaurant/OrderItem.tsx` - Component for displaying individual order summary
  - `server/trpc/routers/restaurant.ts` - Add tRPC procedure for fetching restaurant orders
  - `server/schemas/order.ts` - Schema for order data validation if needed

### Key Technologies:

- Next.js App Router for page routing
- tRPC for data fetching
- Prisma for database access
- Shadcn UI components for UI elements
- Tailwind CSS for styling
- React Query for data fetching and polling
- Auth.js for authentication and session management
- react-i18next for localization
- React server and client components where appropriate

### API Interactions / SDK Usage:

- tRPC protected procedure for fetching restaurant-specific orders
- Auth.js for session validation and user role verification
- React Query's polling functionality for automatic data refresh

### UI/UX Notes:

- Follow the DoorDash-inspired orange theme
- Use a responsive table/list layout:
  - Scrollable horizontal table on mobile
  - Expanded table view on larger screens
- Implement visual highlighting for new orders (e.g., subtle animation or color change)
- Display a loading skeleton UI during data fetching
- Show a friendly empty state message when no orders are available
- Consider using status badges with appropriate colors for different order statuses
- Ensure sufficient spacing between list items for readability
- Use appropriate typography for readability of order details

### Data Structures:

- Order listing data structure:

  ```typescript
  interface OrderListing {
    id: string;
    createdAt: Date;
    customerNotes?: string;
    status: 'NEW' | 'PREPARING' | 'READY';
    totalAmount: number;
    items?: {
      id: string;
      name: string;
      quantity: number;
      price: number;
    }[];
    customer?: {
      id: string;
      name?: string;
      email: string;
    };
  }
  ```

- tRPC query response structure:
  ```typescript
  interface GetRestaurantOrdersResponse {
    orders: OrderListing[];
    totalCount: number;
  }
  ```

### Environment Variables:

- N/A for this story (using existing configurations)

### Coding Standards Notes:

- Implement polling with an appropriate refresh interval (e.g., 30 seconds)
- Use proper state management for tracking new orders
- Implement proper authentication checks for protected routes
- Use server components for initial data fetching where possible
- Use client components for interactive elements and polling
- Follow proper TypeScript typing for all components and data
- Implement proper loading states and error boundaries
- Follow the established localization patterns using translation keys
- Ensure semantic HTML for better accessibility (e.g., proper table or list structure)

## Tasks / Subtasks

- [ ] Create protected restaurant orders page with session check
- [ ] Implement tRPC procedure to fetch restaurant-specific orders
- [ ] Create OrdersList component for displaying orders
- [ ] Create OrderItem component for individual order summary
- [ ] Implement React Query polling for automatic data refresh
- [ ] Add visual highlighting for new orders
- [ ] Implement proper sorting (newest first)
- [ ] Add empty state for when no orders are available
- [ ] Add proper loading states during data fetching
- [ ] Set up localization for all static text
- [ ] Style all components according to the design system
- [ ] Ensure responsive design for different screen sizes
- [ ] Add proper error handling for data fetching and authentication

## Testing Requirements

**Guidance:** Verify implementation against the ACs using the following tests.

### Unit Tests:

- Test OrdersList component rendering with various props
- Test OrderItem component rendering with different order states
- Test Empty state component rendering
- Test Loading state component rendering
- Test tRPC procedure for fetching restaurant orders

### Integration Tests:

- Test restaurant orders page rendering with the application layout
- Test order data fetching and display with actual data
- Test authentication and authorization for the protected route
- Test polling mechanism for automatic data refresh
- Test language switching functionality on the orders page

### Manual/CLI Verification:

- Login as a restaurant user and navigate to the orders page
- Verify that only orders for the logged-in restaurant are displayed
- Verify the initial loading and display of orders
- Create a new test order and verify that it appears automatically via polling
- Verify that orders are sorted with newest first
- Switch language and verify that all text is properly translated
- Test the responsive layout on different screen sizes (mobile, tablet, desktop)
- Verify proper loading states during data fetching
- Verify the empty state when no orders are available (can be tested by modifying query temporarily)
- Attempt to access the page as a non-restaurant user and verify that access is denied

## Story Wrap Up (Agent Populates After Execution)

**Agent Model Used:**
**Completion Notes:**

**Change Log:**

- Initial Draft: Created story structure for Restaurant Dashboard - Incoming Order List & Display (incl. Polling)
