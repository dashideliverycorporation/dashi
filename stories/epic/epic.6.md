# Epic 6: Restaurant Order Management & Admin Sales Tracking

**Goal:** Enable restaurant users to view and update incoming orders and administrators to track basic sales.

**Deployability:** This epic delivers essential restaurant-facing functionality that allows restaurant operators to manage incoming orders and administrators to track sales across the platform. It completes the order management lifecycle by enabling restaurants to respond to orders and update their status, while also providing administrators with basic sales metrics to monitor platform performance. This functionality is critical for validating the business model with real restaurants and administrators.

## Epic-Specific Technical Context

This epic builds upon the order placement functionality established in Epic 5 and leverages the authentication system from Epic 1:

1. **Authentication Flow**: Utilizes Auth.js session for protected restaurant and admin dashboard access
2. **Database Operations**: Retrieves and updates order records with relationships to restaurants and customers
3. **Protected API Layer**: Implements protected tRPC procedures for order management and sales data retrieval
4. **Real-time Updates**: Implements basic polling mechanism for order notifications
5. **Order Status Management**: Establishes the functionality for restaurants to update order status
6. **Sales Tracking**: Creates foundation for monitoring platform performance through basic sales metrics
7. **Localization**: Applies the localization framework to restaurant-facing and admin-facing content

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
  - Local PostgreSQL database with seeded restaurant, menu item, user, and order data
  - Test user accounts with Restaurant and Admin roles
  - Test orders in various states
  - Test different screen sizes to verify responsive design
  - Test language switching to verify localization implementation

## Story List

### Story 6.1: Restaurant Dashboard - Incoming Order List & Display (incl. Polling)

- **User Story / Goal:** As a restaurant user, I want to see a list of new and in-progress orders so that I can manage my incoming orders efficiently without manually refreshing.
- **Detailed Requirements:**
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
  - Ensure all static text is set up for localization
  - Apply styling consistent with the design system
- **Acceptance Criteria (ACs):**
  - AC1: Restaurant dashboard shows a list of orders relevant to the logged-in restaurant
  - AC2: Each order in the list displays key information (ID, timestamp, customer notes, status, total)
  - AC3: New orders appear automatically without manual refresh via polling
  - AC4: Orders are sorted with newest first
  - AC5: New orders are visually highlighted
  - AC6: Empty state is handled appropriately
  - AC7: Static text is properly localized and language switching works
  - AC8: Layout is responsive across different screen sizes
- **Tasks (Optional Initial Breakdown):**
  - [ ] Create protected restaurant dashboard order list component
  - [ ] Implement session check with redirection if needed
  - [ ] Create tRPC procedure to fetch restaurant orders
  - [ ] Build order list component with key information
  - [ ] Implement polling using React Query
  - [ ] Add visual highlighting for new orders
  - [ ] Implement empty state handling
  - [ ] Style components according to the design system
  - [ ] Set up localization for all static text
  - [ ] Create tests for the order list functionality
- **Dependencies:** Epic 1 (Restaurant Authentication), Epic 5 (Order Placement)

---

### Story 6.2: Restaurant Dashboard - Order Details View

- **User Story / Goal:** As a restaurant user, I want to view the full details of an order so that I can prepare the order correctly.
- **Detailed Requirements:**
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
  - Ensure all static text is set up for localization
  - Apply styling consistent with the design system
- **Acceptance Criteria (ACs):**
  - AC1: Clicking on an order in the list shows its full details
  - AC2: Order details view displays all ordered items with quantities
  - AC3: Customer notes and delivery address are clearly visible
  - AC4: Order status and timestamp are displayed
  - AC5: Total amount is shown correctly
  - AC6: Back button returns to the order list view
  - AC7: Static text is properly localized and language switching works
  - AC8: Layout is responsive across different screen sizes
- **Tasks (Optional Initial Breakdown):**
  - [ ] Create order details component
  - [ ] Create tRPC procedure to fetch detailed order data
  - [ ] Implement navigation between order list and detail views
  - [ ] Build order items display
  - [ ] Add customer notes and delivery address section
  - [ ] Include order metadata (status, timestamp, total)
  - [ ] Implement back button functionality
  - [ ] Style components according to the design system
  - [ ] Set up localization for all static text
  - [ ] Create tests for the order details view
- **Dependencies:** Story 6.1

---

### Story 6.3: Restaurant Dashboard - Update Order Status

- **User Story / Goal:** As a restaurant user, I want to update the status of an order so that customers know the progress of their order.
- **Detailed Requirements:**
  - Add status update interface (buttons or dropdown) to the order details view
  - Support the following status updates: "New", "Preparing", and "Ready for Pickup/Delivery"
  - Create a protected tRPC procedure to receive status updates
  - Implement authorization check to ensure only the relevant restaurant can update their orders
  - Update the order status in the database
  - Show confirmation of successful status update
  - Handle errors appropriately
  - Ensure all static text is set up for localization
  - Apply styling consistent with the design system
- **Acceptance Criteria (ACs):**
  - AC1: Order details view includes interface for status updates
  - AC2: All required status options are available
  - AC3: Status updates are saved in the database
  - AC4: Authorization check prevents updating other restaurants' orders
  - AC5: Successful updates show confirmation to the user
  - AC6: Error cases are handled appropriately with user-friendly messages
  - AC7: Static text is properly localized and language switching works
- **Tasks (Optional Initial Breakdown):**
  - [ ] Add status update interface to order details view
  - [ ] Create tRPC procedure for updating order status
  - [ ] Implement authorization check for restaurant-specific orders
  - [ ] Add database update logic for order status
  - [ ] Implement success confirmation UI
  - [ ] Add error handling and appropriate messages
  - [ ] Style components according to the design system
  - [ ] Set up localization for all static text
  - [ ] Create tests for the status update functionality
- **Dependencies:** Story 6.2

---

### Story 6.4: Admin Dashboard - Basic Sales View

- **User Story / Goal:** As an administrator, I want to view sales data for each restaurant so that I can track platform performance.
- **Detailed Requirements:**
  - Create a new protected view in the admin dashboard for sales tracking
  - Implement session check using Auth.js to verify admin user role
  - Create a protected tRPC procedure to fetch relevant order data
  - Query completed orders from the database
  - Group orders by restaurant and calculate total sales for each
  - Display a list showing each restaurant and its total sales value
  - Consider adding basic date range filtering (optional for MVP)
  - Handle empty state (no orders/sales data)
  - Ensure all static text is set up for localization
  - Apply styling consistent with the design system
- **Acceptance Criteria (ACs):**
  - AC1: Admin dashboard includes a sales tracking view
  - AC2: View shows a list of restaurants with their total sales value
  - AC3: Sales data is accurately calculated
  - AC4: Data is grouped by restaurant
  - AC5: Empty state is handled appropriately
  - AC6: Static text is properly localized and language switching works
  - AC7: Layout is responsive across different screen sizes
- **Tasks (Optional Initial Breakdown):**
  - [ ] Create protected sales view in admin dashboard
  - [ ] Implement session check with redirection if needed
  - [ ] Create tRPC procedure to fetch and calculate sales data
  - [ ] Build restaurant sales list component
  - [ ] Implement data grouping and calculation logic
  - [ ] Add empty state handling
  - [ ] Style components according to the design system
  - [ ] Set up localization for all static text
  - [ ] Create tests for the sales view functionality
- **Dependencies:** Epic 1 (Admin Authentication), Story 6.3

## Change Log

| Change        | Date       | Version | Description                          | Author         |
| ------------- | ---------- | ------- | ------------------------------------ | -------------- |
| Initial draft | 2025-06-25 | 0.1     | Created initial Epic 6 documentation | GitHub Copilot |

<!-- Generated by GitHub Copilot -->
