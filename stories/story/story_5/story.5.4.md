# Story 5.4: Place Order (Backend Logic & Notification Trigger)

Status: Ready

## Goal & Context

**User Story:** As a customer, I want to place an order through the checkout page so that my order is recorded in the system and the restaurant is notified.

**Context:** This is the fourth story in Epic 5 (Customer Ordering & History). It implements the backend logic for the order placement process initiated in Story 5.3 (Checkout/Order Placement Page). This story handles the critical server-side validation, database operations, and notification mechanisms that ensure orders are properly recorded and restaurants are promptly notified of new orders. This backend component completes the order placement flow and enables the notification system that bridges customers and restaurants.

## Detailed Requirements

- Create a protected tRPC procedure that:
  - Receives order data from the checkout page form submission
  - Validates the user is authenticated via the session
  - Validates the cart contents are valid (items exist in the menu)
  - Verifies current menu prices against cart prices to prevent manipulation
  - Calculates the final total on the backend for security
- Save the complete order details to the database including:
  - Customer information (from session)
  - Restaurant information (ID and name)
  - Order items (names, quantities, prices)
  - Delivery address and additional notes
  - Order total (calculated on the backend)
  - Timestamp (created_at)
  - Initial status of "New"
- Implement order notification process:
  - Make the new order immediately visible in the restaurant's dashboard via database
  - Integrate with Resend email service to send an email notification
  - Email should include essential order details (order ID, items, customer notes, total)
  - Use a well-formatted HTML template for the email
- Handle error scenarios:
  - Invalid user session (unauthorized)
  - Empty cart or invalid cart data
  - Price discrepancies between cart and current menu
  - Restaurant not found
  - Email service failures
- Ensure proper type safety and validation throughout the procedure

## Acceptance Criteria (ACs)

- AC1: Customers can successfully place orders via the checkout page tRPC procedure
- AC2: The procedure validates the user's session before processing the order
- AC3: Cart contents are validated against current menu items and prices
- AC4: Order totals are recalculated on the backend for security
- AC5: Complete order details are saved to the database with status "New"
- AC6: New orders are immediately visible in the restaurant dashboard view
- AC7: Email notifications are sent to restaurants containing order details
- AC8: Appropriate error handling provides clear feedback on failures
- AC9: The system prevents order manipulation via price or item discrepancies
- AC10: Order timestamps are correctly recorded for tracking purposes

## Technical Implementation Context

**Guidance:** Use the following details for implementation. Developer agent is expected to follow project standards and understand the project structure. Only story-specific details are included below.

### Relevant Files:

- **Files to Create:**

  - `server/trpc/routers/order.ts` - tRPC router with order placement procedure
  - `server/schemas/order.schema.ts` - Zod schemas for order validation
  - `lib/email/order-notification.ts` - Email template and sending logic
  - `lib/order/validation.ts` - Helper functions for order validation

- **Files to Modify:**
  - `server/trpc/routers/_app.ts` - Add order router to the main router
  - `components/checkout/CheckoutForm.tsx` - Connect form to tRPC procedure
  - `prisma/schema.prisma` - Ensure Order model has all required fields

### Key Technologies:

- TypeScript for type safety
- tRPC for type-safe API procedures
- Prisma for database operations
- Zod for schema validation
- Resend for email notifications
- React Hook Form for frontend integration

### API Interactions / SDK Usage:

- tRPC procedure for order placement
- Prisma Client for database operations
- Resend SDK for email sending
- Auth.js for session validation

### UI/UX Notes:

- N/A for this story (backend focused)
- Frontend integration will connect the checkout form to this procedure

### Data Structures:

- Order placement input schema:

  ```typescript
  const createOrderSchema = z.object({
    restaurantId: z.string().cuid(),
    items: z.array(
      z.object({
        id: z.string().cuid(),
        name: z.string(),
        price: z.number().positive(),
        quantity: z.number().int().positive(),
      })
    ),
    deliveryAddress: z.string().min(1),
    notes: z.string().optional(),
  });
  ```

- Order response type:

  ```typescript
  interface OrderResponse {
    success: boolean;
    message: string;
    orderId?: string;
    error?: string;
  }
  ```

- Database Order model (in Prisma schema):

  ```prisma
  model Order {
    id            String          @id @default(cuid())
    createdAt     DateTime        @default(now())
    updatedAt     DateTime        @updatedAt
    status        OrderStatus     @default(NEW)
    total         Decimal         @db.Decimal(10, 2)
    deliveryAddress String
    notes         String?
    customer      User            @relation(fields: [customerId], references: [id])
    customerId    String
    restaurant    Restaurant      @relation(fields: [restaurantId], references: [id])
    restaurantId  String
    items         OrderItem[]

    @@index([customerId])
    @@index([restaurantId])
  }

  model OrderItem {
    id            String          @id @default(cuid())
    name          String
    price         Decimal         @db.Decimal(10, 2)
    quantity      Int
    order         Order           @relation(fields: [orderId], references: [id], onDelete: Cascade)
    orderId       String
    menuItemId    String?         // Optional reference to original menu item

    @@index([orderId])
  }

  enum OrderStatus {
    NEW
    PREPARING
    READY
    COMPLETED
    CANCELLED
  }
  ```

### Environment Variables:

- `RESEND_API_KEY` - API key for the Resend email service

### Coding Standards Notes:

- Follow TypeScript strict mode with proper type definitions
- Use zod for validating all input data
- Implement comprehensive error handling with specific error messages
- Create modular, testable functions with single responsibilities
- Add appropriate transaction handling for database operations
- Document complex validation logic with JSDoc comments
- Ensure secure handling of user data
- Add proper logging for errors and successful operations
- Follow established tRPC patterns from previous stories

## Tasks / Subtasks

- [ ] Create or update Order and OrderItem models in Prisma schema
- [ ] Run Prisma migration for the updated schema
- [ ] Create Zod schemas for order validation
- [ ] Create helper functions for validating cart contents against menu items
- [ ] Create helper functions for calculating order totals
- [ ] Create tRPC order router with protected placeOrder procedure
- [ ] Add order router to the main tRPC router
- [ ] Implement database transaction for order creation
- [ ] Create HTML email template for order notifications
- [ ] Integrate with Resend email service for sending notifications
- [ ] Implement error handling for email sending failures
- [ ] Connect checkout form to the tRPC procedure
- [ ] Add loading, error, and success states to checkout form
- [ ] Add client-side tests for order validation
- [ ] Add server-side tests for the order placement procedure
- [ ] Test email notification functionality
- [ ] Verify order creation in database

## Testing Requirements

**Guidance:** Verify implementation against the ACs using the following tests.

### Unit Tests:

- Test order schema validation with valid and invalid inputs
- Test price validation and total calculation functions
- Test email template generation with various order data
- Test error handling for various failure scenarios

### Integration Tests:

- Test complete order placement flow from form submission to database
- Test order notification email sending
- Test transaction handling to ensure atomicity of operations
- Test authentication requirements for the procedure

### Manual/CLI Verification:

- Place a test order through the UI and verify it's saved correctly in the database
- Check that order status is set to "New" by default
- Verify order total calculation is correct
- Verify email notification is received with the correct order details
- Test error handling by attempting to submit invalid orders
- Test price verification by manipulating cart prices in a request

## Story Wrap Up (Agent Populates After Execution)

**Agent Model Used:**
**Completion Notes:**

**Change Log:**

- Initial Draft: Created story structure for Place Order (Backend Logic & Notification Trigger)
