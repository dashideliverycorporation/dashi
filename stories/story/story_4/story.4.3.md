# Story 4.3: Add Item to Cart (Frontend Logic)

Status: Ready

## Goal & Context

**User Story:** As a customer, I want to add menu items to my cart so that I can prepare to place an order.

**Context:** This is the third story in Epic 4 (Customer Facing - Browse & Cart). Building upon the restaurant menu page created in Story 4.2, this story implements the frontend logic for adding menu items to a shopping cart. This is a critical step in the customer journey, enabling the selection of desired items before proceeding to checkout in later stories.

## Detailed Requirements

- Add an "Add to Cart" button/control for each menu item on the restaurant menu page
- Implement client-side state management for the cart using React Context
- Create a CartProvider component to manage cart state across the application
- Store cart data structure in the context, including:
  - Restaurant ID and name
  - Array of menu items with ID, name, price, quantity
  - Calculated subtotal
- Implement the following cart operations:
  - Add item to cart with default quantity of 1
  - Store cart data in localStorage for persistence between page reloads
  - Handle adding items from a different restaurant (prompt user to clear cart)
- Create a confirmation dialog for clearing the cart when switching restaurants
- Update the cart icon/indicator in the header to show:
  - Number of items in cart
  - Visual indication that cart is not empty
- Provide visual feedback when items are added to cart (e.g., animation, toast notification)
- Ensure all cart functionality works with the localization setup
- Make cart state accessible throughout the application via React Context

## Acceptance Criteria (ACs)

- AC1: Each menu item has an "Add to Cart" button/control
- AC2: Clicking the button adds the item to the cart with quantity 1
- AC3: Cart state is managed using React Context and accessible throughout the application
- AC4: Cart state persists between page reloads using localStorage
- AC5: Adding an item from a different restaurant prompts the user to clear the existing cart
- AC6: User can confirm or cancel clearing the cart when prompted
- AC7: The cart icon/indicator in the header updates to show the number of items
- AC8: Visual feedback is provided when items are added to the cart
- AC9: All cart-related UI text is properly localized
- AC10: Cart correctly maintains association with a single restaurant

## Technical Implementation Context

**Guidance:** Use the following details for implementation. Developer agent is expected to follow project standards and understand the project structure. Only story-specific details are included below.

### Relevant Files:

- **Files to Create/Modify:**
  - `components/cart/CartProvider.tsx` - Context provider for cart state management
  - `components/cart/useCart.ts` - Custom hook for cart operations
  - `components/cart/CartIcon.tsx` - Cart icon with item count indicator
  - `components/cart/AddToCartButton.tsx` - Button component for adding items to cart
  - `components/cart/ClearCartDialog.tsx` - Confirmation dialog for clearing cart
  - `components/restaurant/MenuItem.tsx` - Update to include Add to Cart button
  - `components/layout/Header.tsx` - Update to include cart icon/indicator
  - `lib/types/cart.ts` - Types for cart state and operations

### Key Technologies:

- React Context API for state management
- React hooks for consuming context and cart operations
- localStorage for cart persistence
- Shadcn UI components for UI elements
- Tailwind CSS for styling
- react-i18next for localization
- Radix UI and/or Shadcn UI for dialog component

### API Interactions / SDK Usage:

- No direct API interactions for this story (client-side only)
- localStorage API for cart persistence
- Window/browser APIs for animations

### UI/UX Notes:

- Follow the DoorDash-inspired orange theme
- Design the Add to Cart button to be prominent and easily clickable
- Use a badge or counter on the cart icon to show item count
- Consider using subtle animations for feedback when adding to cart
- Use toast notifications for status messages (added to cart, cart cleared)
- Ensure the clear cart dialog is clear and user-friendly
- Make the cart icon visually indicate when it contains items
- Ensure all interactive elements have appropriate hover/active states
- Consider accessibility for all cart interactions

### Data Structures:

- Cart state structure:

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

- Cart context structure:

  ```typescript
  interface CartContext {
    state: CartState;
    addItem: (
      restaurantId: string,
      restaurantName: string,
      item: Omit<CartItem, "quantity">
    ) => void;
    clearCart: () => void;
    isCartEmpty: boolean;
    itemCount: number;
  }
  ```

- Add to cart button props:
  ```typescript
  interface AddToCartButtonProps {
    item: {
      id: string;
      name: string;
      price: number;
      imageUrl?: string;
    };
    restaurantId: string;
    restaurantName: string;
  }
  ```

### Environment Variables:

- N/A for this story (client-side implementation only)

### Coding Standards Notes:

- Use React Context API following best practices (provider, consumer pattern)
- Create a custom hook for cart operations to encapsulate logic
- Use TypeScript for type safety in all cart operations
- Implement memoization for expensive calculations (e.g., subtotal)
- Use proper error handling for localStorage operations
- Follow the established localization patterns using translation keys
- Use small, focused components with clear responsibilities
- Ensure components are reusable and properly typed
- Follow established patterns for confirmation dialogs and notifications

## Tasks / Subtasks

- [ ] Create CartState and CartContext types
- [ ] Implement CartProvider component with React Context
- [ ] Create useCart custom hook for cart operations
- [ ] Implement localStorage persistence for cart state
- [ ] Create AddToCartButton component
- [ ] Implement restaurant validation logic
- [ ] Create ClearCartDialog confirmation component
- [ ] Update MenuItem component to include Add to Cart button
- [ ] Create or update CartIcon component with item count
- [ ] Integrate CartIcon into Header component
- [ ] Implement visual feedback for cart actions
- [ ] Add localization for all cart-related text
- [ ] Implement cart subtotal calculation
- [ ] Add memoization for expensive calculations
- [ ] Ensure cart state is properly typed
- [ ] Write tests for cart functionality

## Testing Requirements

**Guidance:** Verify implementation against the ACs using the following tests.

### Unit Tests:

- Test CartProvider component and context setup
- Test useCart hook with various cart operations
- Test AddToCartButton component behavior
- Test ClearCartDialog component interactions
- Test cart state calculations (subtotal, item count)
- Test localStorage persistence functionality

### Integration Tests:

- Test adding items to cart from restaurant menu
- Test restaurant validation logic when adding items from different restaurants
- Test cart persistence between page reloads
- Test cart icon updates when items are added
- Test clearing cart functionality

### Manual/CLI Verification:

- Navigate to a restaurant menu page and add items to cart
- Verify that items appear in the cart with correct information
- Verify that the cart icon updates with the correct item count
- Navigate to a different restaurant and attempt to add items
- Verify that the confirmation dialog appears when adding items from a different restaurant
- Confirm and cancel clear cart actions and verify correct behavior
- Reload the page and verify that cart state persists
- Switch language and verify that all cart-related text is properly translated
- Verify visual feedback when adding items to cart
- Test the cart across different screen sizes

## Story Wrap Up (Agent Populates After Execution)

**Agent Model Used:**
**Completion Notes:**

**Change Log:**

- Initial Draft: Created story structure for Add Item to Cart (Frontend Logic)
