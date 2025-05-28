# Epic 5: Customer Ordering & History

**Goal:** Enable customers to place orders and view their past orders.

**Deployability:** This epic delivers the essential ordering functionality that allows customers to complete purchases and track their order history. It establishes the critical connection between customers and restaurants, enabling the core business transaction of the platform. This functionality is vital for validating the primary value proposition of the Dashi platform with real users.

## Epic-Specific Technical Context

This epic builds upon the cart functionality established in Epic 4 and leverages the authentication system from Epic 1:

1. **Authentication Flow**: Utilizes Auth.js session for protected order placement and history viewing
2. **Database Operations**: Creates and manages order records with relationships to customers, restaurants, and menu items
3. **Protected API Layer**: Implements protected tRPC procedures for order placement and history retrieval
4. **Email Notifications**: Uses the Resend integration to notify restaurants of new orders
5. **Order Status Tracking**: Establishes the foundation for tracking order status throughout its lifecycle
6. **Localization**: Applies the localization framework to all customer-facing ordering content

## Local Testability & Command-Line Access

- **Local Development:**

  - Run `pnpm dev` to start the Next.js development server
  - Run `pnpm db:studio` to access Prisma Studio for database exploration
  - Run `pnpm test` to run the test suite

- **Command-Line Testing:**

  - `pnpm prisma db push` to sync schema changes to the database
  - `pnpm prisma studio` to visually explore the database and verify order relationships
  - `pnpm email:test` to test the email notification functionality

- **Environment Testing:**

  - Local: Use `.env.local` for development environment variables
  - Development: Vercel preview deployments for each PR
  - Production: Main branch deployment on Vercel

- **Testing Prerequisites:**
  - Local PostgreSQL database with seeded restaurant, menu item, and user data
  - Resend API key configured in environment variables
  - Test user accounts with Customer role
  - Test different screen sizes to verify responsive design
  - Test language switching to verify localization implementation

## Story List

### Story 5.1: Customer Registration Page

- **User Story / Goal:** As a new user, I want to register as a customer so that I can place orders on the platform.
- **Detailed Requirements:**
  - Create a dedicated customer registration page/form with fields for email and password
  - Implement client-side validation for form inputs using Zod
  - Submit registration data to Auth.js registration endpoint or tRPC procedure
  - Set the user role to "CUSTOMER" during registration
  - Create appropriate customer record linked to the user
  - Handle error cases (existing email, validation errors)
  - Display success confirmation and redirect to login
  - Ensure all static text is set up for localization
- **Acceptance Criteria (ACs):**
  - AC1: Registration form includes fields for email and password with proper validation
  - AC2: Form validation provides clear error messages for invalid inputs
  - AC3: Successful registration creates a user with the "CUSTOMER" role
  - AC4: Error cases are properly handled with user-friendly messages
  - AC5: Success message is displayed after registration
  - AC6: Static text is properly localized and language switching works
- **Tasks (Optional Initial Breakdown):**
  - [ ] Create customer registration page and form
  - [ ] Implement Zod schema for input validation
  - [ ] Create tRPC procedure or Auth.js handler for registration
  - [ ] Add error handling and success confirmation
  - [ ] Style components according to the design system
  - [ ] Set up localization for all static text
  - [ ] Create tests for the registration flow
- **Dependencies:** Epic 0 (Auth.js, Database), Epic 2 (UI Components)

---

### Story 5.2: Customer Login Page

- **User Story / Goal:** As a registered customer, I want to log in to my account so that I can place orders and view my order history.
- **Detailed Requirements:**
  - Create a dedicated customer login page/form with fields for email and password
  - Implement client-side validation for form inputs using Zod
  - Submit login data to Auth.js login endpoint or tRPC procedure
  - Handle authentication errors (invalid credentials, account not found)
  - Store user session using Auth.js
  - Redirect logged-in users to the homepage or a customer dashboard
  - Implement "remember me" functionality
  - Ensure all static text is set up for localization
- **Acceptance Criteria (ACs):**
  - AC1: Login form includes fields for email and password with proper validation
  - AC2: Form validation provides clear error messages for invalid inputs
  - AC3: Successful login creates a session and redirects the user
  - AC4: Authentication errors are properly handled with user-friendly messages
  - AC5: "Remember me" functionality works as expected
  - AC6: Static text is properly localized and language switching works
- **Tasks (Optional Initial Breakdown):**
  - [ ] Create customer login page and form
  - [ ] Implement Zod schema for input validation
  - [ ] Configure Auth.js for email/password authentication
  - [ ] Add error handling and redirection logic
  - [ ] Style components according to the design system
  - [ ] Set up localization for all static text
  - [ ] Create tests for the login flow
- **Dependencies:** Epic 0 (Auth.js, Database), Epic 2 (UI Components)

---

### Story 5.3: Checkout/Order Placement Page (Frontend)

- **User Story / Goal:** As a logged-in customer, I want to review my cart and provide delivery information so that I can place my order.
- **Detailed Requirements:**
  - Create a checkout page accessible only to logged-in users with items in cart
  - Implement session check using Auth.js
  - Display a summary of cart contents (items, quantities, prices, subtotal)
  - Show the restaurant name
  - Include a form field for delivery address/notes
  - Add a disclaimer about direct payment to restaurant
  - Implement "Place Order" button
  - Handle validation for required fields
  - Ensure all static text is set up for localization
  - Apply styling consistent with the design system
- **Acceptance Criteria (ACs):**
  - AC1: Checkout page is protected and only accessible to logged-in users with items in cart
  - AC2: Cart summary displays all items, quantities, prices, and subtotal
  - AC3: Form includes field for delivery address/notes
  - AC4: Payment disclaimer is clearly visible to users
  - AC5: Form validation works for required fields
  - AC6: "Place Order" button initiates the order submission
  - AC7: Static text is properly localized and language switching works
  - AC8: Layout is responsive across different screen sizes
- **Tasks (Optional Initial Breakdown):**
  - [ ] Create protected checkout page
  - [ ] Implement session and cart check with redirection if needed
  - [ ] Build cart summary display component
  - [ ] Create delivery information form
  - [ ] Add payment disclaimer
  - [ ] Implement "Place Order" button and form submission
  - [ ] Style components according to the design system
  - [ ] Set up localization for all static text
  - [ ] Create tests for the checkout page
- **Dependencies:** Story 5.2, Epic 4 (Cart Functionality)

---

### Story 5.4: Place Order (Backend Logic & Notification Trigger)

- **User Story / Goal:** As a logged-in customer, I want to submit my order to the restaurant so that they can prepare my food.
- **Detailed Requirements:**
  - Create a protected tRPC procedure to receive order data from checkout
  - Validate user session and access rights
  - Verify cart contents against current menu prices using Zod
  - Calculate the final order total on the server-side
  - Create an order record in the database with:
    - User/customer information
    - Restaurant information
    - Order items with quantities and prices
    - Delivery address/notes
    - Initial status as "NEW"
    - Timestamp
  - Make the order visible in the restaurant dashboard
  - Send an email notification to the restaurant using Resend
  - Handle potential errors in the process
  - Return order confirmation with order ID
- **Acceptance Criteria (ACs):**
  - AC1: tRPC procedure validates user session and input data
  - AC2: Final total is calculated correctly on the server
  - AC3: Order data is saved to the database with correct relationships
  - AC4: Order is assigned "NEW" status initially
  - AC5: Email notification is sent to the restaurant
  - AC6: Successful response includes order confirmation data
  - AC7: Error cases are properly handled
- **Tasks (Optional Initial Breakdown):**
  - [ ] Create protected tRPC procedure for order placement
  - [ ] Implement Zod schema for order data validation
  - [ ] Add server-side price verification and total calculation
  - [ ] Create database transaction for storing order data
  - [ ] Implement order notification email template
  - [ ] Add email sending logic using Resend
  - [ ] Add error handling and appropriate responses
  - [ ] Create tests for the order placement functionality
- **Dependencies:** Story 5.3, Epic 0 (Resend)

---

### Story 5.5: Order Confirmation Page/View

- **User Story / Goal:** As a customer who has placed an order, I want to see a confirmation so that I know my order was successful.
- **Detailed Requirements:**
  - Create an order confirmation page/view
  - Display order acknowledgement message
  - Show summary of order details (items, quantities, total)
  - Include restaurant information
  - Provide information about payment method (direct to restaurant)
  - Add a message about order preparation by the restaurant
  - Include a link to view order in history
  - Ensure all static text is set up for localization
  - Apply styling consistent with the design system
- **Acceptance Criteria (ACs):**
  - AC1: Confirmation page shows a success message after order placement
  - AC2: Order details are accurately displayed (items, quantities, total)
  - AC3: Restaurant information is shown
  - AC4: Payment and preparation information is clearly communicated
  - AC5: Link to order history is provided
  - AC6: Static text is properly localized and language switching works
  - AC7: Layout is responsive across different screen sizes
- **Tasks (Optional Initial Breakdown):**
  - [ ] Create order confirmation page
  - [ ] Build order summary component
  - [ ] Add restaurant information display
  - [ ] Include payment and preparation information
  - [ ] Add navigation link to order history
  - [ ] Style components according to the design system
  - [ ] Set up localization for all static text
  - [ ] Create tests for the confirmation page
- **Dependencies:** Story 5.4

---

### Story 5.6: Customer Order History Page

- **User Story / Goal:** As a logged-in customer, I want to view my order history so that I can track and reference my past orders.
- **Detailed Requirements:**
  - Create a protected order history page for logged-in customers
  - Implement session check using Auth.js
  - Create a tRPC procedure to fetch the customer's orders
  - Display orders in a list showing:
    - Restaurant name
    - Order date/time
    - Order status
    - Order total
  - Allow clicking on an order to view details
  - Show full order details when selected (items, quantities, notes, total)
  - Sort orders by most recent first
  - Handle empty state (no orders)
  - Ensure all static text is set up for localization
  - Apply styling consistent with the design system
- **Acceptance Criteria (ACs):**
  - AC1: Order history page is protected and only accessible to logged-in users
  - AC2: Page displays a list of the customer's past orders
  - AC3: Each order entry shows essential information
  - AC4: Clicking an order shows its full details
  - AC5: Orders are sorted with most recent first
  - AC6: Empty state is handled appropriately
  - AC7: Static text is properly localized and language switching works
  - AC8: Layout is responsive across different screen sizes
- **Tasks (Optional Initial Breakdown):**
  - [ ] Create protected order history page
  - [ ] Implement session check with redirection if needed
  - [ ] Create tRPC procedure to fetch customer orders
  - [ ] Build order list component
  - [ ] Create order details view component
  - [ ] Implement empty state handling
  - [ ] Style components according to the design system
  - [ ] Set up localization for all static text
  - [ ] Create tests for the order history functionality
- **Dependencies:** Story 5.2, Story 5.4

## Change Log

| Change        | Date       | Version | Description                          | Author         |
| ------------- | ---------- | ------- | ------------------------------------ | -------------- |
| Initial draft | 2025-05-28 | 0.1     | Created initial Epic 5 documentation | GitHub Copilot |

<!-- Generated by GitHub Copilot -->
