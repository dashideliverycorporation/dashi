# Story 5.6: Customer Order History Page

Status: Ready

## Goal & Context

**User Story:** As a logged-in customer, I want to view my order history so that I can track and reference my past orders.

**Context:** This is the sixth and final story in Epic 5 (Customer Ordering & History). It completes the customer order experience by providing a way for customers to access their order history after placing orders. This story creates a protected page where customers can view and explore their past orders, with detailed information about each order. This feature enhances customer experience by providing transparency and allowing customers to reference their previous orders.

## Detailed Requirements

- Create a protected order history page that:
  - Is only accessible to logged-in customers
  - Displays a list of all past orders placed by the customer
  - Shows summary information for each order including:
    - Restaurant name
    - Order date and time
    - Order status
    - Order total
  - Orders should be sorted with most recent orders first
  - Shows an appropriate message if the customer has no order history
- Implement order detail view functionality:
  - Allow clicking on an order to view its full details
  - Display comprehensive order details including:
    - Order ID/reference number
    - Restaurant name
    - Order status with visual indicator
    - Order date and time
    - List of items with quantities and prices
    - Order subtotal
    - Final total
    - Delivery address
    - Any notes provided
  - Consider implementing either a modal/dialog or a separate page for details
- Create protected tRPC procedures to:
  - Fetch a list of orders for the logged-in customer
  - Fetch detailed information for a specific order by ID
- Ensure proper authorization so customers can only view their own orders
- Ensure all static text is properly set up for localization (English and French)
- Apply styling consistent with the design system (orange theme)
- Ensure the page is fully responsive on all device sizes

## Acceptance Criteria (ACs)

- AC1: The order history page is only accessible to logged-in customers
- AC2: Customers can see a chronological list of all their past orders
- AC3: Each order in the list displays the restaurant, date, status, and total
- AC4: Customers can click on an order to view its complete details
- AC5: Order details view shows all items, quantities, prices, and other order information
- AC6: Customers can only view their own orders
- AC7: An appropriate message is shown when a customer has no order history
- AC8: All text content is properly localized and supports language switching
- AC9: The page is responsive and displays correctly on all screen sizes
- AC10: Order data is protected and fetched via secure tRPC procedures

## Technical Implementation Context

**Guidance:** Use the following details for implementation. Developer agent is expected to follow project standards and understand the project structure. Only story-specific details are included below.

### Relevant Files:

- **Files to Create:**
  - `app/order-history/page.tsx` - Protected order history page component
  - `components/order/OrderHistoryList.tsx` - Component to display list of past orders
  - `components/order/OrderDetailsDialog.tsx` - Modal/dialog for displaying order details
  - `components/order/OrderStatusBadge.tsx` - Component to display order status with visual indicator

- **Files to Modify:**
  - `server/trpc/routers/order.ts` - Add procedures to fetch customer orders and order details
  - `components/layout/Header.tsx` - Add link to order history page for logged-in customers
  - `middleware.ts` - Ensure protection for order-history route (if not already covered)

### Key Technologies:

- Next.js (App Router) for page routing and components
- TypeScript for type safety
- tRPC for type-safe API procedures
- Prisma for database operations
- Shadcn UI components (particularly Table, Dialog, Badge)
- Tailwind CSS for styling
- react-i18next for localization
- Auth.js for session and authentication checks

### API Interactions / SDK Usage:

- tRPC procedure for fetching list of customer orders
- tRPC procedure for fetching detailed order information by ID
- Auth.js `useSession` hook for authentication checks
- Prisma Client for database operations (in tRPC procedures)

### UI/UX Notes:

- Follow the DoorDash-inspired orange theme
- Use a table or card layout for the order history list
- Consider using the Shadcn UI Table component for desktop views
- For mobile, consider a card-based layout instead of a table
- Use status badges with distinct colors for different order statuses
- Implement either:
  - A slide-in dialog for order details (better for mobile)
  - Or a dedicated page with dynamic routing (e.g., `/order-history/[orderId]`)
- Consider implementing pagination if a customer might have many orders
- Use appropriate loading states when fetching data
- Include a "No orders yet" state with illustration for customers with no order history
- Consider adding filters for order status or date ranges (optional enhancement)
- Ensure clear visual hierarchy with prominent restaurant names and order dates
- Use timestamps in a user-friendly format (e.g., "May 5, 2023 at 2:30 PM")
- Include subtle hover effects for clickable order rows

### Data Structures:

- Order history list item:

  ```typescript
  interface OrderHistoryItem {
    id: string;
    createdAt: Date;
    status: OrderStatus;
    total: number;
    restaurant: {
      id: string;
      name: string;
    };
  }
  ```

- Detailed order:

  ```typescript
  interface OrderDetails {
    id: string;
    createdAt: Date;
    status: OrderStatus;
    total: number;
    deliveryAddress: string;
    notes: string | null;
    customer: {
      name: string;
      email: string;
    };
    restaurant: {
      id: string;
      name: string;
    };
    items: Array<{
      id: string;
      name: string;
      price: number;
      quantity: number;
    }>;
  }
  ```

- Order status enum:

  ```typescript
  enum OrderStatus {
    NEW = "NEW",
    PREPARING = "PREPARING",
    READY = "READY",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"
  }
  ```

### Environment Variables:

- No new environment variables needed for this story

### Coding Standards Notes:

- Follow TypeScript strict mode with proper type definitions
- Use server components for initial data fetching
- Use client components for interactive elements
- Implement proper error handling for API calls
- Add authentication and authorization checks
- Ensure the page is only accessible to logged-in customers
- Create reusable, single-responsibility components
- Add appropriate accessibility attributes to all elements
- Follow established localization patterns using translation keys
- Ensure responsive design with appropriate Tailwind classes
- Document complex logic with JSDoc comments
- Use optimistic UI updates where appropriate

## Tasks / Subtasks

- [ ] Create tRPC procedure to fetch customer order history
- [ ] Create tRPC procedure to fetch detailed order information by ID
- [ ] Add the new procedures to the order router
- [ ] Create OrderStatusBadge component to visually represent order statuses
- [ ] Create OrderHistoryList component to display the list of past orders
- [ ] Create OrderDetailsDialog component for viewing detailed order information
- [ ] Create protected order history page with appropriate route
- [ ] Implement authentication and authorization checks
- [ ] Add link to order history in the Header component for logged-in customers
- [ ] Add middleware protection for the order history route
- [ ] Style all components according to design system
- [ ] Set up localization for all text content
- [ ] Add responsive styling for different screen sizes
- [ ] Implement empty state for customers with no order history
- [ ] Implement loading states for data fetching
- [ ] Add error handling for failed API calls
- [ ] Add client-side tests for components
- [ ] Add integration tests for protected routes and data fetching

## Testing Requirements

**Guidance:** Verify implementation against the ACs using the following tests.

### Unit Tests:

- Test OrderHistoryList component renders order list correctly
- Test OrderDetailsDialog component renders order details correctly
- Test OrderStatusBadge component displays different statuses
- Test authorization logic to ensure customers can only access their own orders

### Integration Tests:

- Test the complete flow of viewing order history and clicking to see details
- Test route protection for authenticated vs unauthenticated users
- Test data fetching with valid and invalid user sessions
- Test error handling for API failures

### Manual/CLI Verification:

- Log in as a customer and verify the order history page is accessible
- Verify orders are displayed in chronological order (newest first)
- Click on an order and verify all details are correctly displayed
- Attempt to access another customer's orders (should be denied)
- Test accessing the order history page while not logged in (expect redirect)
- Verify empty state is displayed for customers with no orders
- Test responsive design by viewing the page on different device sizes
- Test localization by switching between languages
- Verify accessibility using keyboard navigation and screen reader compatibility

## Story Wrap Up (Agent Populates After Execution)

**Agent Model Used:**
**Completion Notes:**

**Change Log:**

- Initial Draft: Created story structure for Customer Order History Page
