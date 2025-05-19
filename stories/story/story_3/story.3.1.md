# Story 3.1: Restaurant Dashboard - Protected Route & Basic View

Status: Completed

## Goal & Context

**User Story:** As a restaurant user, I want to access a protected dashboard so that I can manage my restaurant's menu items.

**Context:** This is the first story in Epic 3 (Restaurant Menu Management). It focuses on creating a protected restaurant dashboard route accessible only to users with the Restaurant role. This dashboard will serve as the foundation for restaurant-specific functions in the platform, starting with menu management.

## Detailed Requirements

- Create a protected `/restaurant` route accessible only to users with the 'Restaurant' role
- Implement route protection using Auth.js session and middleware
- Create a basic restaurant dashboard layout with navigation structure
- Implement session check and redirect logic for non-restaurant users
- Display the name of the logged-in restaurant retrieved from the session
- Create a placeholder for restaurant menu management
- Style dashboard components using Shadcn UI following the design system

## Acceptance Criteria (ACs)

- AC1: A protected `/restaurant` route exists that checks for Restaurant role in the session
- AC2: Non-restaurant users are redirected to an access denied page or login page
- AC3: Restaurant dashboard has a navigation menu with links to different sections (even if they're placeholders)
- AC4: Dashboard displays the logged-in restaurant's name from the session
- AC5: Dashboard UI follows the established design system using Shadcn UI components
- AC6: The dashboard is responsive and works on different screen sizes

## Technical Implementation Context

**Guidance:** Use the following details for implementation. Developer agent is expected to follow project standards and understand the project structure. Only story-specific details are included below.

### Relevant Files:

- **Files to Create/Modify:**
  - `app/restaurant/layout.tsx` - Restaurant dashboard layout with navigation and session check
  - `app/restaurant/page.tsx` - Main restaurant dashboard page with overview
  - `app/restaurant/denied/page.tsx` - Access denied page for non-restaurant users
  - `components/restaurant/Sidebar.tsx` - Navigation sidebar for restaurant dashboard
  - `components/restaurant/Header.tsx` - Header component for restaurant dashboard
  - `middleware.ts` - Extend to protect restaurant routes

### Key Technologies:

- Next.js App Router for routing and layouts
- Auth.js for session management and protection
- Shadcn UI components for dashboard UI
- Tailwind CSS for styling
- React server components and client components

### API Interactions / SDK Usage:

- Auth.js for session verification
- tRPC for fetching restaurant data

### UI/UX Notes:

- Dashboard should follow the DoorDash-inspired orange theme
- Use a sidebar layout with navigation items
- Include a header with restaurant name and logout button
- Design should be clean, modern, and responsive

### Data Structures:

- Auth.js session with user role information and restaurant ID
- Restaurant data structure including name and ID
- Navigation item structure for sidebar

### Environment Variables:

- N/A for this story (using existing Auth.js configuration)

### Coding Standards Notes:

- Properly separate server and client components
- Use proper TypeScript typing for all components and data
- Implement responsive design using Tailwind CSS utilities
- Follow component structure established in Epic 0 and Epic 1
- Use proper error boundaries for handling authentication failures

## Tasks / Subtasks

- [x] Create restaurant dashboard layout with navigation structure
- [x] Implement session check to verify Restaurant role
- [x] Create redirect logic for non-restaurant users
- [x] Build access denied page for unauthorized access attempts
- [x] Create sidebar navigation component with menu items
- [x] Create dashboard header with restaurant information
- [x] Add placeholder for menu management section
- [x] Add tRPC procedure to fetch restaurant data if needed
- [x] Style all components using Shadcn UI and the design system
- [x] Implement responsive design for different screen sizes
- [x] Update middleware to protect restaurant routes
- [x] Write tests for restaurant route protection

## Testing Requirements

**Guidance:** Verify implementation against the ACs using the following tests.

### Unit Tests:

- Test restaurant route protection logic
- Test sidebar navigation component rendering
- Test header component with restaurant information

### Integration Tests:

- Test restaurant dashboard access with restaurant user
- Test redirect with non-restaurant user
- Test complete dashboard rendering with restaurant data from session

### Manual/CLI Verification:

- Log in with a restaurant user and verify access to the restaurant dashboard
- Log in with a non-restaurant user and verify redirect to access denied page
- Verify that the correct restaurant name is displayed in the header
- Check dashboard rendering on different screen sizes for responsive design
- Verify that all navigation elements are properly styled and clickable

## Story Wrap Up (Agent Populates After Execution)

**Agent Model Used:** GitHub Copilot
**Completion Notes:** Successfully implemented the restaurant dashboard with protected routes, sidebar navigation, and role-based access control. All acceptance criteria have been met, and the restaurant dashboard now matches the design system and provides proper security through the middleware.

**Change Log:**

- Initial Draft: Created story structure for restaurant dashboard protected route
- May 19, 2025: Completed restaurant dashboard layout implementation
- May 19, 2025: Added middleware protection for restaurant routes
- May 19, 2025: Implemented sidebar and header components
- May 19, 2025: Updated sign-in redirection for restaurant users
- May 19, 2025: Implemented and styled responsive dashboard layout
- May 19, 2025: Marked story as completed
