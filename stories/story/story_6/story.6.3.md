# Story 6.3: Restaurant Dashboard - Update Order Status

Status: Ready

## Goal & Context

**User Story:** As a restaurant user, I want to update the status of an order so that customers know the progress of their order.

**Context:** This is the third story in Epic 6 (Restaurant Order Management & Admin Sales Tracking). It builds upon Story 6.2 by adding functionality for restaurant users to update the status of orders. This capability allows restaurants to communicate the progress of orders to customers and is essential for managing the order lifecycle from receipt to delivery.

## Detailed Requirements

- Add status update interface (buttons or dropdown) to the order details view
- Support the following status updates: "New", "Preparing", and "Ready for Pickup/Delivery"
- Create a protected tRPC procedure to receive status updates
- Implement authorization check to ensure only the relevant restaurant can update their orders
- Update the order status in the database
- Show confirmation of successful status update
- Handle errors appropriately
- Ensure all static text is set up for localization (English and French)
- Apply styling consistent with the DoorDash-inspired orange theme
- Ensure the layout is responsive across different screen sizes (mobile, tablet, desktop)

## Acceptance Criteria (ACs)

- AC1: Order details view includes interface for status updates
- AC2: All required status options are available ("New", "Preparing", "Ready for Pickup/Delivery")
- AC3: Status updates are saved in the database
- AC4: Authorization check prevents updating other restaurants' orders
- AC5: Successful updates show confirmation to the user
- AC6: Error cases are handled appropriately with user-friendly messages
- AC7: All static text on the page is properly localized and language switching works
- AC8: The layout is responsive and adapts to different screen sizes
- AC9: The styling follows the project's design system using Shadcn UI components
- AC10: The order list view reflects updated status after changes

## Technical Implementation Context

**Guidance:** Use the following details for implementation. Developer agent is expected to follow project standards and understand the project structure. Only story-specific details are included below.

### Relevant Files:

- **Files to Create/Modify:**
  - `components/restaurant/OrderStatusUpdate.tsx` - Component for status update interface
  - `app/restaurant/orders/[orderId]/page.tsx` - Update order details page to include status update
  - `server/trpc/routers/restaurant.ts` - Add tRPC mutation for updating order status
  - `server/schemas/order.ts` - Schema for order status validation

### Key Technologies:

- Next.js App Router for page routing
- tRPC for data mutation
- Prisma for database access
- Shadcn UI components for UI elements
- Tailwind CSS for styling
- Auth.js for authentication and session management
- react-i18next for localization
- React server and client components where appropriate

### API Interactions / SDK Usage:

- tRPC protected mutation for updating order status
- Auth.js for session validation and user role verification
- Prisma to update order records in the database

### UI/UX Notes:

- Follow the DoorDash-inspired orange theme
- Use a clear, intuitive interface for status updates:
  - Consider using radio buttons, a segmented control, or a dropdown
  - Visually highlight the current status
  - Use color coding for different statuses (e.g., orange for "New", blue for "Preparing", green for "Ready")
- Show a loading state during status update
- Display a clear success confirmation after update
- Show error messages in a user-friendly way
- Ensure the status update interface is appropriately sized and positioned
- Consider adding a simple animation for status change confirmation

### Data Structures:

- Order status enumeration:

  ```typescript
  enum OrderStatus {
    NEW = 'NEW',
    PREPARING = 'PREPARING',
    READY = 'READY'
  }
  ```

- Status update request:

  ```typescript
  interface UpdateOrderStatusRequest {
    orderId: string;
    status: OrderStatus;
  }
  ```

- Status update response:
  ```typescript
  interface UpdateOrderStatusResponse {
    success: boolean;
    order: {
      id: string;
      status: OrderStatus;
      updatedAt: Date;
    };
  }
  ```

### Environment Variables:

- N/A for this story (using existing configurations)

### Coding Standards Notes:

- Implement proper authentication and authorization checks
- Validate input data using Zod schema
- Use optimistic UI updates for better user experience
- Handle error cases properly with user-friendly messages
- Use proper TypeScript typing for all components and data
- Follow the established localization patterns using translation keys
- Implement proper loading states during data submission
- Ensure semantic HTML for better accessibility
- Log important status changes for audit purposes

## Tasks / Subtasks

- [ ] Create OrderStatusUpdate component with status options
- [ ] Integrate the status update component into the order details page
- [ ] Implement tRPC mutation for updating order status
- [ ] Add authorization check to ensure restaurant can only update their own orders
- [ ] Create database update logic for order status
- [ ] Add optimistic UI updates for immediate feedback
- [ ] Implement success confirmation UI
- [ ] Add error handling and appropriate messages
- [ ] Set up localization for all static text
- [ ] Style all components according to the design system
- [ ] Ensure responsive design for different screen sizes
- [ ] Create tests for the status update functionality

## Testing Requirements

**Guidance:** Verify implementation against the ACs using the following tests.

### Unit Tests:

- Test OrderStatusUpdate component rendering with various props and states
- Test tRPC mutation for updating order status
- Test authorization logic for status updates
- Test input validation for status updates

### Integration Tests:

- Test end-to-end flow of updating order status
- Test UI updates after status change
- Test authentication and authorization for the protected mutation
- Test error handling and success states
- Test language switching functionality for the status update UI

### Manual/CLI Verification:

- Login as a restaurant user and navigate to the order details page
- Try updating the status of an order using each available option
- Verify that the status update is reflected in the UI immediately
- Refresh the page and verify that the status update persists
- Try to update the status of an order from another restaurant and verify that it is prevented
- Verify error handling for network issues or server errors
- Switch language and verify that all text is properly translated
- Test the responsive layout on different screen sizes (mobile, tablet, desktop)
- Check the database (using Prisma Studio) to verify that the status updates are saved correctly

## Story Wrap Up (Agent Populates After Execution)

**Agent Model Used:**
**Completion Notes:**

**Change Log:**

- Initial Draft: Created story structure for Restaurant Dashboard - Update Order Status
