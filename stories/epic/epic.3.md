# Epic 3: Restaurant Menu Management

**Goal:** Enable restaurant users to manage their menu items via their dashboard.

**Deployability:** This epic establishes the restaurant dashboard and menu management capabilities necessary for restaurants to create and maintain their menus. It delivers the interface and backend functionality for restaurant users to add, edit, and manage their menu items, which is a prerequisite for the customer-facing menu browsing and ordering features in later epics.

## Epic-Specific Technical Context

This epic builds upon the authentication and database infrastructure established in Epic 0 and Epic 1:

1. **Authentication**: Utilizes Auth.js session context and role-based access control for Restaurant users
2. **Database Models**: Creates and manages menu item models and their relationship to restaurants
3. **API Layer**: Implements tRPC procedures for menu item creation, reading, updating, and soft deletion
4. **Protected Routes**: Establishes restaurant-specific protected routes and dashboard views
5. **Restaurant Dashboard**: Creates the restaurant dashboard interface using Shadcn UI components

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
  - Local PostgreSQL database with Auth.js tables created
  - Test restaurant user accounts with 'Restaurant' role
  - Restaurant records linked to test restaurant users

## Story List

### Story 3.1: Restaurant Dashboard - Protected Route & Basic View

- **User Story / Goal:** As a restaurant user, I want to access a protected dashboard so that I can manage my restaurant's menu items.
- **Detailed Requirements:**
  - Create a protected `/restaurant` route accessible only to users with the 'Restaurant' role
  - Implement route protection using Auth.js session and middleware
  - Create basic restaurant dashboard layout with navigation
  - Implement session check and redirect for non-restaurant users
  - Display the name of the logged-in restaurant
  - Style dashboard using Shadcn UI components
- **Acceptance Criteria (ACs):**
  - AC1: `/restaurant` route exists and loads correctly for restaurant users
  - AC2: Non-restaurant users are redirected to an access denied page or login
  - AC3: Restaurant dashboard displays the name of the logged-in restaurant
  - AC4: Dashboard has a navigation menu with links to different sections
  - AC5: Dashboard UI follows the established design system
- **Tasks (Optional Initial Breakdown):**
  - [ ] Create restaurant dashboard page structure
  - [ ] Implement Auth.js session check middleware for restaurant role
  - [ ] Create access denied redirect for non-restaurant users
  - [ ] Build dashboard layout with navigation
  - [ ] Add restaurant name display component
  - [ ] Style with Shadcn UI components
- **Dependencies:** Epic 0 (Database, tRPC), Epic 1 (Restaurant Authentication)

---

### Story 3.2: Restaurant Dashboard - Menu Item Listing

- **User Story / Goal:** As a restaurant user, I want to view all menu items associated with my restaurant so that I can manage my menu.
- **Detailed Requirements:**
  - Create a menu items table view in the restaurant dashboard
  - Implement tRPC procedure to fetch all menu items associated with the logged-in restaurant
  - Display item name, description, category, price, and availability status
  - Add pagination if number of menu items exceeds display limit
  - Implement sorting and filtering options
  - Style view using Shadcn UI components
- **Acceptance Criteria (ACs):**
  - AC1: Restaurant dashboard displays a table of all menu items for the logged-in restaurant
  - AC2: Table shows menu item details (name, description, category, price, availability status)
  - AC3: Data is fetched from the database using a protected tRPC procedure
  - AC4: Table supports pagination if needed
  - AC5: Table supports basic sorting and filtering
- **Tasks (Optional Initial Breakdown):**
  - [ ] Create menu item listing page in restaurant dashboard
  - [ ] Implement tRPC procedure to fetch restaurant's menu items
  - [ ] Build responsive table component with Shadcn UI
  - [ ] Add pagination component
  - [ ] Implement basic sorting and filtering
  - [ ] Add placeholder edit/delete links
- **Dependencies:** Story 3.1

---

### Story 3.3: Restaurant Dashboard - Add New Menu Item

- **User Story / Goal:** As a restaurant user, I want to add new menu items so that I can expand my restaurant's offerings.
- **Detailed Requirements:**
  - Create a form for adding new menu items with required fields (name, description, category, price, availability status)
  - Implement tRPC procedure for saving menu item data to the database
  - Link menu items to the logged-in restaurant
  - Add validation for required fields using Zod
  - Implement form submission and error handling
  - Style form using Shadcn UI components
- **Acceptance Criteria (ACs):**
  - AC1: Restaurant user can fill and submit a form to add a new menu item
  - AC2: Menu item data is validated using Zod
  - AC3: Menu item is saved to the database and linked to the restaurant
  - AC4: New items appear in the menu list after submission
  - AC5: Form validation prevents submission of invalid data
- **Tasks (Optional Initial Breakdown):**
  - [ ] Update Prisma schema for menu item model if needed
  - [ ] Create menu item addition form
  - [ ] Implement Zod schema for menu item validation
  - [ ] Implement tRPC procedure for adding menu items
  - [ ] Link menu items to restaurant in the database
  - [ ] Add form validation and error handling
  - [ ] Style form with Shadcn UI components
- **Dependencies:** Story 3.2

---

### Story 3.4: Restaurant Dashboard - Edit Menu Item

- **User Story / Goal:** As a restaurant user, I want to edit existing menu items so that I can keep my menu information accurate and up-to-date.
- **Detailed Requirements:**
  - Implement functionality to select an existing menu item for editing
  - Create a form pre-populated with the selected menu item's current data
  - Implement tRPC procedure for updating menu item data in the database
  - Add validation for required fields using Zod
  - Implement form submission and error handling
  - Style form using Shadcn UI components
- **Acceptance Criteria (ACs):**
  - AC1: Restaurant user can select a menu item to edit
  - AC2: Edit form is pre-populated with the selected item's current data
  - AC3: Menu item data is validated using Zod
  - AC4: Updated menu item data is saved to the database
  - AC5: Changes appear in the menu list after submission
- **Tasks (Optional Initial Breakdown):**
  - [ ] Create edit functionality in menu item list
  - [ ] Create menu item edit form
  - [ ] Pre-populate form with selected item data
  - [ ] Implement Zod schema for menu item validation
  - [ ] Implement tRPC procedure for updating menu items
  - [ ] Add form validation and error handling
  - [ ] Style form with Shadcn UI components
- **Dependencies:** Story 3.3

---

### Story 3.5: Restaurant Dashboard - Toggle Availability & Soft Delete

- **User Story / Goal:** As a restaurant user, I want to mark menu items as available/unavailable and remove items no longer offered so that customers see an accurate menu.
- **Detailed Requirements:**
  - Add toggle controls for changing item availability status
  - Add delete button/option for menu items
  - Implement tRPC procedure for toggling menu item availability
  - Implement tRPC procedure for soft-deleting menu items (marking as inactive/deleted in DB)
  - Update UI to reflect item status changes
  - Add confirmation dialog for delete action
- **Acceptance Criteria (ACs):**
  - AC1: Restaurant user can toggle menu item availability status
  - AC2: Availability status is updated in the database
  - AC3: Restaurant user can initiate a soft-delete for menu items
  - AC4: Soft-deleted items are marked accordingly in the database
  - AC5: UI reflects the current status of menu items
- **Tasks (Optional Initial Breakdown):**
  - [ ] Add availability toggle control to menu item list
  - [ ] Add delete button to menu item list
  - [ ] Create confirmation dialog for delete action
  - [ ] Implement tRPC procedure for toggling availability
  - [ ] Implement tRPC procedure for soft-deleting menu items
  - [ ] Update UI to reflect status changes
  - [ ] Style controls with Shadcn UI components
- **Dependencies:** Story 3.4

## Change Log

| Change        | Date       | Version | Description                          | Author         |
| ------------- | ---------- | ------- | ------------------------------------ | -------------- |
| Initial draft | 2025-05-19 | 0.1     | Created initial Epic 3 documentation | GitHub Copilot |

<!-- Generated by GitHub Copilot -->
