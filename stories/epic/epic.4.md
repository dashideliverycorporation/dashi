# Epic 4: Customer Facing - Browse & Cart

**Goal:** Allow customers to browse restaurants and menus and manage a shopping cart.

**Deployability:** This epic delivers the core customer-facing experience for browsing restaurants and their menus, and managing a shopping cart. It establishes the public interface for customers to discover restaurants, view their menu items, and collect desired items in a cart - essential functionality that will directly enable the ordering features in later epics.

## Epic-Specific Technical Context

This epic builds upon the user interface framework established in Epic 2 and the restaurant menu management functionality from Epic 3:

1. **Public Routes**: Creates public-facing routes for restaurant listings and individual restaurant menus
2. **Client-Side State Management**: Implements shopping cart state management using React Context/Providers
3. **Public API Layer**: Develops public tRPC procedures for fetching restaurant and menu data
4. **Responsive Design**: Ensures a mobile-first responsive design for optimal user experience
5. **Localization**: Applies the localization framework to all customer-facing content

## Local Testability & Command-Line Access

- **Local Development:**

  - Run `pnpm dev` to start the Next.js development server
  - Run `pnpm db:studio` to access Prisma Studio for database exploration
  - Run `pnpm test` to run the test suite

- **Command-Line Testing:**

  - `pnpm prisma db push` to sync schema changes to the database
  - `pnpm prisma studio` to visually explore the database and verify menu item relationships

- **Environment Testing:**

  - Local: Use `.env.local` for development environment variables
  - Development: Vercel preview deployments for each PR
  - Production: Main branch deployment on Vercel

- **Testing Prerequisites:**
  - Local PostgreSQL database with seeded restaurant and menu item data
  - Test different screen sizes to verify responsive design
  - Test language switching to verify localization implementation

## Story List

### Story 4.1: Homepage - Restaurant Listing

- **User Story / Goal:** As a customer, I want to see a list of available restaurants on the homepage so that I can choose where to order from.
- **Detailed Requirements:**
  - Create a public homepage route/page with a restaurant listing section
  - Implement a tRPC procedure to fetch active restaurants (not soft-deleted)
  - Display each restaurant with essential information (name, logo/image if available)
  - Create navigation links to each restaurant's menu page
  - Implement responsive grid layout for restaurant cards
  - Ensure all static text is set up for localization
  - Apply styling consistent with the design system
- **Acceptance Criteria (ACs):**
  - AC1: Homepage displays a grid of available restaurants
  - AC2: Each restaurant card shows the restaurant name and image (if available)
  - AC3: Data is fetched from the database using a public tRPC procedure
  - AC4: Restaurant cards link to the respective restaurant menu pages
  - AC5: Layout is responsive across different screen sizes
  - AC6: Static text is properly localized and language switching works
- **Tasks (Optional Initial Breakdown):**
  - [ ] Create homepage route with restaurant listing section
  - [ ] Implement tRPC procedure to fetch active restaurants
  - [ ] Create RestaurantCard component
  - [ ] Build responsive grid layout for restaurant cards
  - [ ] Add links to restaurant menu pages
  - [ ] Set up localization for all static text
  - [ ] Apply styling according to the design system
- **Dependencies:** Epic 0 (Database, tRPC), Epic 2 (Core UI Layout, Localization)

---

### Story 4.2: Restaurant Menu Page

- **User Story / Goal:** As a customer, I want to view a restaurant's menu so that I can see what food items are available.
- **Detailed Requirements:**
  - Create a dynamic route for individual restaurant menus (`/restaurants/[slug]`)
  - Implement tRPC procedure to fetch restaurant details and menu items
  - Display restaurant information (name, description, etc.)
  - Show available menu items (not soft-deleted) grouped by category
  - Display item details including name, description, price, and image (if available)
  - Implement responsive layout for menu items
  - Ensure all static text is set up for localization
  - Handle cases where restaurant doesn't exist or has no menu items
- **Acceptance Criteria (ACs):**
  - AC1: Dynamic restaurant menu page shows restaurant details and menu items
  - AC2: Menu items are grouped by category for easier browsing
  - AC3: Each menu item displays name, description, price, and image (if available)
  - AC4: Only available items (not marked as unavailable or soft-deleted) are shown
  - AC5: Data is fetched from the database using public tRPC procedures
  - AC6: Page handles error states (restaurant not found, no items available)
  - AC7: Layout is responsive across different screen sizes
  - AC8: Static text is properly localized and language switching works
- **Tasks (Optional Initial Breakdown):**
  - [ ] Create dynamic route for restaurant menus
  - [ ] Implement tRPC procedures to fetch restaurant details and menu items
  - [ ] Create components for restaurant header/info section
  - [ ] Create components for menu item categories and items
  - [ ] Implement responsive layout for different screen sizes
  - [ ] Handle error and empty states
  - [ ] Set up localization for all static text
  - [ ] Apply styling according to the design system
- **Dependencies:** Story 4.1

---

### Story 4.3: Add Item to Cart (Frontend Logic)

- **User Story / Goal:** As a customer, I want to add menu items to my cart so that I can prepare to place an order.
- **Detailed Requirements:**
  - Add "Add to Cart" buttons for each menu item on the restaurant menu page
  - Implement client-side state management for the cart using React Context
  - Create cart provider to manage cart state across the application
  - Implement logic to add items (with default quantity 1) to the cart
  - Ensure cart only contains items from a single restaurant
  - Implement prompt/confirmation when attempting to add items from a different restaurant
  - Add visual feedback when items are added to cart (e.g., animation, notification)
  - Update cart icon/indicator in header to show number of items
  - Store cart state in localStorage for persistence between page reloads
- **Acceptance Criteria (ACs):**
  - AC1: Each menu item has an "Add to Cart" button
  - AC2: Clicking the button adds the item to the cart with quantity 1
  - AC3: The cart icon in the header updates to show the number of items
  - AC4: Visual feedback is provided when an item is added to cart
  - AC5: Cart state persists between page reloads using localStorage
  - AC6: Adding an item from a different restaurant prompts to clear the existing cart
  - AC7: Cart state is accessible throughout the application using React Context
- **Tasks (Optional Initial Breakdown):**
  - [ ] Create CartProvider component using React Context
  - [ ] Implement cart state management functions (add, remove, update quantity)
  - [ ] Create "Add to Cart" button component for menu items
  - [ ] Implement restaurant validation logic to prevent mixing items
  - [ ] Create confirmation dialog for clearing cart
  - [ ] Add visual feedback for cart actions
  - [ ] Update header component to display cart item count
  - [ ] Implement localStorage persistence for cart state
- **Dependencies:** Story 4.2

---

### Story 4.4: Cart View and Editing (Frontend)

- **User Story / Goal:** As a customer, I want to view and edit the contents of my cart so that I can finalize my order before checkout.
- **Detailed Requirements:**
  - Create a dedicated cart view/page or modal component
  - Display all items in the cart with name, price, quantity, and subtotal
  - Show the overall cart subtotal
  - Display the restaurant name associated with the cart items
  - Implement controls to adjust item quantities
  - Implement controls to remove items from the cart
  - Update subtotal in real-time when quantities change
  - Implement empty cart state
  - Add "Proceed to Checkout" button (non-functional for this story)
  - Ensure all static text is set up for localization
- **Acceptance Criteria (ACs):**
  - AC1: Cart view displays all items with their details (name, price, quantity, subtotal)
  - AC2: Overall cart subtotal is calculated and displayed
  - AC3: Users can adjust item quantities using increment/decrement controls
  - AC4: Users can remove items from the cart
  - AC5: Subtotal updates in real-time when quantities change
  - AC6: Empty cart state is handled appropriately
  - AC7: The restaurant name associated with the cart is displayed
  - AC8: Layout is responsive across different screen sizes
  - AC9: Static text is properly localized and language switching works
- **Tasks (Optional Initial Breakdown):**
  - [ ] Create cart page or modal component
  - [ ] Implement cart item display with quantity controls
  - [ ] Create empty cart state view
  - [ ] Implement real-time subtotal calculation
  - [ ] Connect cart view to CartProvider context
  - [ ] Style cart view according to design system
  - [ ] Set up localization for all static text
  - [ ] Ensure responsive design for different screen sizes
- **Dependencies:** Story 4.3

## Change Log

| Change        | Date       | Version | Description                          | Author         |
| ------------- | ---------- | ------- | ------------------------------------ | -------------- |
| Initial draft | 2025-05-26 | 0.1     | Created initial Epic 4 documentation | GitHub Copilot |

<!-- Generated by GitHub Copilot -->
