# Story 4.4: Cart View and Editing (Frontend)

Status: Ready

## Goal & Context

**User Story:** As a customer, I want to view my cart details and edit the items I've added so that I can manage my order before checking out.

**Context:** This is the fourth and final story in Epic 4 (Customer Facing - Browse & Cart). Building upon the add-to-cart functionality implemented in Story 4.3, this story implements a dedicated cart view page and the ability to edit cart contents. This interface allows customers to review, modify, and prepare their order before proceeding to checkout in a future story.

## Detailed Requirements

- Create a dedicated cart view page accessible from the cart icon in the header
- Display all items currently in the cart with the following information:
  - Item name
  - Quantity
  - Unit price
  - Total price for the item (unit price × quantity)
- Show the restaurant name at the top of the cart view
- Display a cart subtotal (sum of all item totals)
- Implement quantity adjustment functionality:
  - Allow increasing/decreasing the quantity of items
  - Provide a way to remove items from the cart
  - Show visual feedback for quantity changes
- Add a "Clear Cart" button to remove all items
- Add a "Proceed to Checkout" button (UI only, functionality in a future story)
- Show appropriate empty state when the cart is empty
- Allow returning to the restaurant menu from the cart view
- Ensure all cart operations update the persistent storage (localStorage)
- Implement responsive design for the cart view across all screen sizes
- Make cart view layout adapt appropriately on mobile devices
- Set up all static text for localization (English and French)

## Acceptance Criteria (ACs)

- AC1: A dedicated cart view page exists and is accessible from the cart icon
- AC2: The cart view shows all items with name, quantity, unit price, and total price
- AC3: The restaurant name is displayed prominently in the cart view
- AC4: Each item has controls to increase/decrease quantity
- AC5: Each item has a remove button to delete it from the cart
- AC6: A subtotal is calculated and displayed at the bottom of the cart
- AC7: The cart view has a "Clear Cart" button that removes all items
- AC8: An empty state is shown when there are no items in the cart
- AC9: The cart view is responsive and displays correctly on all screen sizes
- AC10: All cart view text is properly localized in both English and French

## Technical Implementation Context

**Guidance:** Use the following details for implementation. Developer agent is expected to follow project standards and understand the project structure. Only story-specific details are included below.

### Relevant Files:

- **Files to Create/Modify:**
  - `app/cart/page.tsx` - Cart view page component
  - `components/cart/CartItem.tsx` - Individual cart item component with editing controls
  - `components/cart/CartItemList.tsx` - Component to display list of cart items
  - `components/cart/CartSummary.tsx` - Component showing subtotal and checkout button
  - `components/cart/EmptyCart.tsx` - Component for empty cart state
  - `components/cart/CartActions.tsx` - Component with cart-level actions (clear, continue shopping)
  - `components/cart/useCart.ts` - Update to add additional cart operations if needed
  - `components/layout/Header.tsx` - Update cart icon to link to cart page
  - `app/globals.css` - Any additional global styles needed

### Key Technologies:

- React hooks and context (using existing CartProvider from 4.3)
- Next.js for page routing
- Shadcn UI components for UI elements
- Tailwind CSS for styling
- react-i18next for localization
- Client-side components with 'use client' directive

### API Interactions / SDK Usage:

- No direct backend API interactions for this story
- Use existing cart context and localStorage integration
- Window/browser APIs for responsive design considerations

### UI/UX Notes:

- Follow the DoorDash-inspired orange theme
- Design the cart view to be clean, organized, and easy to scan
- Quantity controls:
  - Use a counter with plus/minus buttons
  - Consider a dropdown for larger numbers
  - Ensure buttons are large enough for touch interaction
- Use clear visual hierarchy:
  - Restaurant name at top
  - Item list in middle
  - Summary and actions at bottom
- Empty state should be visually appealing and guide users back to browsing
- "Proceed to Checkout" button should be prominent and use the primary color
- Include appropriate loading and transition states
- Consider subtle animations for quantity changes and item removal
- Ensure sufficient contrast for text and interactive elements
- Consider using icons alongside text for clarity

### Data Structures:

- Use existing cart state structure from story 4.3:

  ```typescript
  interface CartState {
    restaurantId: string | null;
    restaurantName: string | null;
    items: CartItem[];
    subtotal: number;
  }

  interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string;
  }
  ```

- Extend cart context with additional operations:

  ```typescript
  interface CartContext {
    // Existing operations from 4.3
    state: CartState;
    addItem: (
      restaurantId: string,
      restaurantName: string,
      item: Omit<CartItem, "quantity">
    ) => void;
    clearCart: () => void;
    isCartEmpty: boolean;
    itemCount: number;

    // New operations for 4.4
    updateQuantity: (itemId: string, quantity: number) => void;
    removeItem: (itemId: string) => void;
    getItemTotal: (item: CartItem) => number;
  }
  ```

- Cart item component props:
  ```typescript
  interface CartItemProps {
    item: CartItem;
    onUpdateQuantity: (id: string, quantity: number) => void;
    onRemove: (id: string) => void;
  }
  ```

### Environment Variables:

- N/A for this story (client-side implementation only)

### Coding Standards Notes:

- Use React hooks and context following best practices
- Create small, focused components with clear responsibilities
- Use appropriate TypeScript types for all components and functions
- Follow established patterns for handling user interactions
- Use memoization for expensive calculations (e.g., subtotal)
- Follow Shadcn UI patterns for consistent component design
- Ensure responsive design with appropriate Tailwind classes
- Follow the established localization patterns using translation keys
- Use meaningful variable and function names
- Add appropriate error handling for edge cases
- Ensure accessibility is maintained throughout the cart view

## Tasks / Subtasks

- [ ] Update useCart hook with additional cart operations
- [ ] Create basic cart page layout (`app/cart/page.tsx`)
- [ ] Implement CartItem component with quantity controls
- [ ] Create CartItemList component to display cart items
- [ ] Implement CartSummary component with subtotal calculation
- [ ] Create EmptyCart component for empty state
- [ ] Implement CartActions component with clear cart button
- [ ] Add "Proceed to Checkout" button (UI only)
- [ ] Connect cart view to cart context
- [ ] Update cart icon in header to link to cart page
- [ ] Implement responsive styling for cart view
- [ ] Add animations for cart item changes
- [ ] Set up localization for all cart view text
- [ ] Test cart operations (update quantity, remove item)
- [ ] Implement edge case handling (e.g., trying to set quantity to 0 or negative)
- [ ] Add return to restaurant functionality

## Testing Requirements

**Guidance:** Verify implementation against the ACs using the following tests.

### Unit Tests:

- Test CartItem component with quantity controls
- Test CartItemList component rendering
- Test CartSummary component subtotal calculation
- Test EmptyCart component rendering
- Test CartActions component functionality
- Test new useCart hook functions

### Integration Tests:

- Test navigating to the cart view from the header cart icon
- Test updating item quantities in the cart
- Test removing items from the cart
- Test clearing the entire cart
- Test empty state display when all items are removed
- Test the "return to restaurant" functionality

### Manual/CLI Verification:

- Add several items to cart from a restaurant menu
- Navigate to the cart view from the header cart icon
- Verify all items display with correct information
- Test increasing and decreasing item quantities
- Test removing items from the cart
- Verify subtotal updates correctly after each change
- Clear the cart and verify empty state is displayed
- Test the cart view on different screen sizes
- Switch between languages and verify all text is properly translated
- Verify visual feedback and animations work properly
- Test the cart view with a large number of items

## Story Wrap Up (Agent Populates After Execution)

**Agent Model Used:**
**Completion Notes:**

**Change Log:**

- Initial Draft: Created story structure for Cart View and Editing (Frontend)
