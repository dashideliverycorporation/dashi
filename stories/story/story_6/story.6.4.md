# Story 6.4: Admin Dashboard - Basic Sales View

Status: Ready

## Goal & Context

**User Story:** As an administrator, I want to view sales data for each restaurant so that I can track platform performance.

**Context:** This is the fourth story in Epic 6 (Restaurant Order Management & Admin Sales Tracking). It focuses on creating a view in the admin dashboard that displays sales data grouped by restaurant. This functionality is essential for platform administrators to monitor the business performance of restaurants and calculate commissions.

## Detailed Requirements

- Create a new protected view in the admin dashboard for sales tracking
- Implement session check using Auth.js to verify admin user role
- Create a protected tRPC procedure to fetch relevant order data
- Query completed orders from the database
- Group orders by restaurant and calculate total sales for each
- Display a list showing each restaurant and its total sales value
- Consider adding basic date range filtering (optional for MVP)
- Handle empty state (no orders/sales data)
- Ensure all static text is set up for localization (English and French)
- Apply styling consistent with the DoorDash-inspired orange theme
- Ensure the layout is responsive across different screen sizes (mobile, tablet, desktop)

## Acceptance Criteria (ACs)

- AC1: Admin dashboard includes a protected sales tracking view
- AC2: View shows a list of restaurants with their total sales value
- AC3: Sales data is accurately calculated based on completed orders
- AC4: Data is grouped by restaurant
- AC5: Admin can see the total sales for the entire platform
- AC6: An appropriate empty state is displayed when no sales data is available
- AC7: All static text on the page is properly localized and language switching works
- AC8: The layout is responsive and adapts to different screen sizes
- AC9: The styling follows the project's design system using Shadcn UI components
- AC10: Only users with admin role can access the view
- AC11: Sufficient loading states are implemented during data fetching

## Technical Implementation Context

**Guidance:** Use the following details for implementation. Developer agent is expected to follow project standards and understand the project structure. Only story-specific details are included below.

### Relevant Files:

- **Files to Create/Modify:**
  - `app/admin/sales/page.tsx` - Admin sales dashboard page
  - `components/admin/SalesTable.tsx` - Component for displaying sales data by restaurant
  - `components/admin/SalesSummary.tsx` - Component for displaying overall sales data
  - `server/trpc/routers/admin.ts` - Add tRPC procedure for fetching sales data
  - `server/schemas/sales.ts` - Schema for sales data validation if needed

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

- tRPC protected procedure for fetching sales data
- Auth.js for session validation and user role verification
- Prisma for complex database queries and aggregations

### UI/UX Notes:

- Follow the DoorDash-inspired orange theme
- Use a clean table layout for displaying restaurant sales data
- Consider including:
  - Restaurant name
  - Total number of orders
  - Total sales value
  - Optional: Average order value
- Add a summary section showing platform-wide totals
- Display a loading skeleton UI during data fetching
- Show a friendly empty state message when no sales data is available
- Ensure clear typography and visual hierarchy
- Consider adding a simple date range selector (if implementing optional filtering)
- Use appropriate formatting for currency values

### Data Structures:

- Restaurant sales data structure:

  ```typescript
  interface RestaurantSales {
    restaurantId: string;
    restaurantName: string;
    orderCount: number;
    totalSales: number;
    averageOrderValue?: number;
  }
  ```

- Sales summary data structure:

  ```typescript
  interface SalesSummary {
    totalOrderCount: number;
    totalSales: number;
    restaurantCount: number;
    averageOrderValue: number;
  }
  ```

- tRPC query response structure:
  ```typescript
  interface GetSalesDataResponse {
    restaurantSales: RestaurantSales[];
    summary: SalesSummary;
  }
  ```

### Environment Variables:

- N/A for this story (using existing configurations)

### Coding Standards Notes:

- Implement proper authentication and authorization checks
- Use server components for initial data fetching where possible
- Optimize database queries for better performance
- Implement proper error handling for complex data aggregations
- Use proper TypeScript typing for all components and data
- Follow the established localization patterns using translation keys
- Ensure semantic HTML for better accessibility (e.g., proper table structure)
- Use appropriate number formatting for currency and other numerical values

## Tasks / Subtasks

- [ ] Create protected admin sales dashboard page
- [ ] Implement session check with redirection if user is not an admin
- [ ] Create tRPC procedure to fetch and calculate sales data
- [ ] Build SalesTable component for restaurant sales display
- [ ] Create SalesSummary component for overall sales data
- [ ] Implement data grouping and calculation logic
- [ ] Add empty state handling
- [ ] Add proper loading states during data fetching
- [ ] Set up localization for all static text
- [ ] Style all components according to the design system
- [ ] Ensure responsive design for different screen sizes
- [ ] Add proper error handling for data fetching

## Testing Requirements

**Guidance:** Verify implementation against the ACs using the following tests.

### Unit Tests:

- Test SalesTable component rendering with various props
- Test SalesSummary component rendering
- Test Empty state component rendering
- Test Loading state component rendering
- Test tRPC procedure for fetching and calculating sales data

### Integration Tests:

- Test admin sales page rendering with the application layout
- Test sales data fetching and display with actual data
- Test authentication and authorization for the protected route
- Test calculation logic for sales data
- Test language switching functionality on the sales page

### Manual/CLI Verification:

- Login as an admin user and navigate to the sales dashboard
- Verify that the sales data is correctly displayed for each restaurant
- Verify that the total sales data is accurately calculated
- Login as a non-admin user and verify that access to the sales dashboard is denied
- Create test orders and verify that they are properly reflected in the sales data
- Switch language and verify that all text is properly translated
- Test the responsive layout on different screen sizes (mobile, tablet, desktop)
- Verify proper loading states during data fetching
- Verify the empty state when no sales data is available (can be tested with a fresh database)

## Story Wrap Up (Agent Populates After Execution)

**Agent Model Used:**
**Completion Notes:**

**Change Log:**

- Initial Draft: Created story structure for Admin Dashboard - Basic Sales View
