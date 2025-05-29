# Story 5.3: Checkout/Order Placement Page (Frontend)

Status: Ready

## Goal & Context

**User Story:** As a logged-in customer with items in my cart, I want to access a checkout page so that I can review my order and provide delivery information before placing it.

**Context:** This is the third story in Epic 5 (Customer Ordering & History). It builds upon the customer login functionality implemented in Story 5.2 and the cart functionality from Epic 4. This story creates the checkout experience where customers can review their cart contents one final time, add delivery information, and place their order. This frontend component is a critical step in the order flow, preceding the backend order placement logic that will be implemented in Story 5.4.

## Detailed Requirements

- Create a checkout page that is accessible only when:
  - The user is logged in (authenticated with Auth.js)
  - The cart contains at least one item
- Display a comprehensive summary of cart contents including:
  - List of all items with names, quantities, and individual prices
  - Subtotal for each item (quantity × price)
  - Order total amount
- Include a form with the following fields:
  - Delivery address (required, textarea for multi-line input)
  - Additional notes (optional, textarea for special instructions)
- Clearly state that payment is made directly to the restaurant (cash on delivery)
- Implement a prominent "Place Order" button
- Handle authentication and cart state:
  - Redirect unauthenticated users to the login page with a return URL
  - Redirect users with empty carts to the homepage with an appropriate message
  - Store cart contents and delivery information in state for submission
- Ensure all static text is properly set up for localization (English and French)
- Apply styling consistent with the design system (orange theme)
- Ensure the page is fully responsive on all device sizes

## Acceptance Criteria (ACs)

- AC1: Only logged-in users with items in their cart can access the checkout page
- AC2: Unauthenticated users are redirected to the login page with a return URL
- AC3: Users with empty carts are redirected to the homepage with an appropriate message
- AC4: The checkout page displays a complete summary of cart contents and total
- AC5: A form for delivery address and notes is prominently displayed
- AC6: The page clearly states that payment is made directly to the restaurant
- AC7: A prominent "Place Order" button is available
- AC8: Form validation ensures delivery address is provided before order placement
- AC9: All text content is properly localized and supports language switching
- AC10: The page is responsive and displays correctly on all screen sizes

## Technical Implementation Context

**Guidance:** Use the following details for implementation. Developer agent is expected to follow project standards and understand the project structure. Only story-specific details are included below.

### Relevant Files:

- **Files to Create:**

  - `app/checkout/page.tsx` - The protected checkout page component
  - `components/checkout/CheckoutForm.tsx` - Checkout form component with address and notes fields
  - `components/checkout/OrderSummary.tsx` - Component to display cart items and totals
  - `server/schemas/order.schema.ts` - Zod schema for order validation

- **Files to Modify:**
  - `components/cart/CartSheet.tsx` - Add a "Proceed to Checkout" button with authentication check
  - `middleware.ts` - Add protection for /checkout route (require authentication)

### Key Technologies:

- Next.js (App Router) for page routing and components
- TypeScript for type safety
- React Hook Form with Zod for form validation
- Auth.js for authentication checks
- Shadcn UI components for form elements and layout
- Tailwind CSS for styling
- react-i18next for localization
- useCart hook for cart state management

### API Interactions / SDK Usage:

- Auth.js `useSession` hook for authentication checks
- `useCart` custom hook for retrieving cart contents
- `next/navigation` for routing and redirection

### UI/UX Notes:

- Follow the DoorDash-inspired orange theme
- Use Shadcn UI form components for consistency
- Clear visual hierarchy with order summary at the top
- Delivery form fields should be prominent and clearly labeled
- Include a visual indicator (icon or text) showing payment method (cash on delivery)
- "Place Order" button should be large, prominent, and use the primary color
- Consider a simple animation or visual feedback when clicking "Place Order"
- Include a brief summary of the number of items and total at the top
- Make sure form inputs are large enough for easy input on mobile devices
- Consider adding a "Back to Cart" link for users who want to modify their order

### Data Structures:

- Order schema:

  ```typescript
  const checkoutSchema = z.object({
    deliveryAddress: z
      .string()
      .min(1, { message: "Delivery address is required" }),
    notes: z.string().optional(),
  });
  ```

- Form values type:

  ```typescript
  type CheckoutFormValues = z.infer<typeof checkoutSchema>;
  ```

- Cart data structure (from existing useCart hook):

  ```typescript
  interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    restaurantId: string;
  }

  interface Cart {
    items: CartItem[];
    restaurantId: string | null;
    restaurantName: string | null;
  }
  ```

### Environment Variables:

- No new environment variables needed for this story

### Coding Standards Notes:

- Follow TypeScript strict mode with proper type definitions
- Use zod for validating all input data
- Implement proper error handling for form validation and submission
- Create reusable, single-responsibility components
- Add appropriate accessibility attributes to form elements
- Follow established localization patterns using translation keys
- Use server components where appropriate for initial rendering
- Use client components for interactive elements
- Ensure responsive design with appropriate Tailwind classes
- Document complex logic with JSDoc comments
- Follow project UI/UX standards for form design

## Tasks / Subtasks

- [x] Create CheckoutForm component with address and notes fields
- [x] Add "Proceed to Checkout" button in CartSheet component
- [x] Create OrderSummary component to display cart contents and total
- [ ] Create checkout page with OrderSummary and CheckoutForm
- [ ] Create Zod schema for checkout form validation
- [ ] Create middleware protection for the checkout route
- [ ] Implement cart checking logic to ensure it's not empty
- [ ] Implement form validation for required fields
- [ ] Add redirection logic for unauthenticated users or empty carts
- [ ] Style the checkout page according to design system
- [ ] Set up localization for all text content
- [ ] Implement responsive styling for different screen sizes
- [ ] Add client-side tests for form validation
- [ ] Add integration tests for checkout flow
- [ ] Test protected route behavior with authenticated and unauthenticated users
- [ ] Test checkout flow with various cart states

## Testing Requirements

**Guidance:** Verify implementation against the ACs using the following tests.

### Unit Tests:

- Test checkout form validation with valid and invalid inputs
- Test OrderSummary component renders cart items correctly
- Test cart total calculation accuracy
- Test protected route middleware redirects appropriately

### Integration Tests:

- Test complete checkout flow from cart to checkout page
- Test authentication requirements and redirection
- Test empty cart detection and handling

### Manual/CLI Verification:

- Test checkout page access with logged-in user and items in cart
- Test accessing checkout page while not logged in (expect redirect)
- Test accessing checkout page with empty cart (expect redirect)
- Verify cart contents are displayed correctly in the order summary
- Test form submission with valid and invalid delivery address
- Test responsive design by viewing the checkout page on different device sizes
- Test localization by switching between languages
- Verify accessibility using keyboard navigation and screen reader compatibility

## Story Wrap Up (Agent Populates After Execution)

**Agent Model Used:**
**Completion Notes:**

**Change Log:**

- Initial Draft: Created story structure for Checkout/Order Placement Page (Frontend)
