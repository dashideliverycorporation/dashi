# Story 6.2: Restaurant Dashboard - Order Details View

Status: Ready

## Goal & Context

**User Story:** As a restaurant user, I want to view the full details of an order so that I can prepare the order correctly.

**Context:** This is the second story in Epic 6 (Restaurant Order Management & Admin Sales Tracking). It builds upon Story 6.1 by adding the ability for restaurant users to click on an order in the list to view its complete details. This functionality is essential for restaurant staff to understand the exact items ordered, quantities, and any special notes from the customer.

## Detailed Requirements

- Create an order details view/component in the restaurant dashboard
- Implement functionality to view an order's details when clicked in the list
- Create a protected tRPC procedure to fetch detailed order data
- Display comprehensive order information:
  - All ordered items with quantities
  - Customer notes
  - Delivery address
  - Order status
  - Timestamp
  - Total amount
- Add a back button to return to the order list
- Ensure all static text is set up for localization (English and French)
- Apply styling consistent with the DoorDash-inspired orange theme
- Ensure the layout is responsive across different screen sizes (mobile, tablet, desktop)

## Acceptance Criteria (ACs)

- AC1: Clicking on an order in the list shows its full details
- AC2: Order details view displays all ordered items with quantities
- AC3: Customer notes and delivery address are clearly visible
- AC4: Order status and timestamp are displayed
- AC5: Total amount is shown correctly
- AC6: Back button returns to the order list view
- AC7: All static text on the page is properly localized and language switching works
- AC8: The layout is responsive and adapts to different screen sizes
- AC9: The styling follows the project's design system using Shadcn UI components
- AC10: Only orders belonging to the logged-in restaurant can be viewed in detail
- AC11: The view is properly protected and only accessible to authenticated restaurant users

## Technical Implementation Context

**Guidance:** Use the following details for implementation. Developer agent is expected to follow project standards and understand the project structure. Only story-specific details are included below.

### Relevant Files:

- **Files to Create/Modify:**
  - `app/restaurant/orders/[orderId]/page.tsx` - Order details page
  - `components/restaurant/OrderDetails.tsx` - Component for displaying detailed order information
  - `components/restaurant/OrderItemsList.tsx` - Component for displaying order items list
  - `server/trpc/routers/restaurant.ts` - Add tRPC procedure for fetching detailed order data
  - `server/schemas/order.ts` - Schema for order data validation if needed

### Key Technologies:

- Next.js App Router for page routing
- tRPC for data fetching
- Prisma for database access
- Shadcn UI components for UI elements
- Tailwind CSS for styling
- Auth.js for authentication and session management
- react-i18next for localization
- React server and client components where appropriate

### API Interactions / SDK Usage:

- tRPC protected procedure for fetching detailed order data
- Auth.js for session validation and user role verification
- Next.js dynamic routing for order-specific pages

### UI/UX Notes:

- Follow the DoorDash-inspired orange theme
- Use a clean, organized layout to present order details:
  - Order information section (ID, timestamp, status, total)
  - Customer information section (notes, delivery address)
  - Order items section (list of items with quantities and prices)
- Consider using a card-based layout for different sections
- Implement clear visual hierarchy for information
- Display a loading skeleton UI during data fetching
- Ensure back button is clearly visible for easy navigation
- Use appropriate typography for different types of information
- Consider using a table layout for order items on larger screens

### Data Structures:

- Order details data structure:

  ```typescript
  interface OrderDetails {
    id: string;
    createdAt: Date;
    status: 'NEW' | 'PREPARING' | 'READY';
    totalAmount: number;
    customerNotes?: string;
    deliveryAddress?: string;
    customer: {
      id: string;
      name?: string;
      email: string;
    };
    items: {
      id: string;
      name: string;
      quantity: number;
      price: number;
      total: number;
    }[];
  }
  ```

- tRPC query response structure:
  ```typescript
  interface GetOrderDetailsResponse {
    order: OrderDetails;
  }
  ```

### Environment Variables:

- N/A for this story (using existing configurations)

### Coding Standards Notes:

- Implement proper authentication and authorization checks
- Validate that the requested order belongs to the logged-in restaurant
- Use server components for initial data fetching where possible
- Use client components for interactive elements
- Follow proper TypeScript typing for all components and data
- Implement proper loading states and error boundaries
- Follow the established localization patterns using translation keys
- Ensure semantic HTML for better accessibility

## Tasks / Subtasks

- [ ] Create protected order details page with dynamic routing
- [ ] Implement tRPC procedure to fetch detailed order data
- [ ] Create OrderDetails component for displaying order information
- [ ] Create OrderItemsList component for displaying order items
- [ ] Add authorization check to ensure restaurant can only view their own orders
- [ ] Implement back button navigation to orders list
- [ ] Add proper loading states during data fetching
- [ ] Set up localization for all static text
- [ ] Style all components according to the design system
- [ ] Ensure responsive design for different screen sizes
- [ ] Add proper error handling for data fetching and authorization

## Testing Requirements

**Guidance:** Verify implementation against the ACs using the following tests.

### Unit Tests:

- Test OrderDetails component rendering with various props
- Test OrderItemsList component rendering
- Test Loading state component rendering
- Test tRPC procedure for fetching order details

### Integration Tests:

- Test order details page rendering with the application layout
- Test order data fetching and display with actual data
- Test authentication and authorization for the protected route
- Test navigation from orders list to order details and back
- Test language switching functionality on the order details page

### Manual/CLI Verification:

- Login as a restaurant user and navigate to the orders page
- Click on an order in the list and verify that it shows detailed information
- Verify that all required order information is displayed correctly
- Verify that the back button returns to the orders list
- Try to access an order that doesn't belong to the restaurant and verify that access is denied
- Switch language and verify that all text is properly translated
- Test the responsive layout on different screen sizes (mobile, tablet, desktop)
- Verify proper loading states during data fetching
- Verify error handling for invalid order IDs or unauthorized access

## Story Wrap Up (Agent Populates After Execution)

**Agent Model Used:**
**Completion Notes:**

**Change Log:**

- Initial Draft: Created story structure for Restaurant Dashboard - Order Details View
