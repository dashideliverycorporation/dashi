# Story 1.2: Admin Dashboard - Protected Route & Basic View

Status: Draft

## Goal & C- [x] Write tests for admin route protection [x] Write tests for admin route protectionntext

**User Story:** As an admin, I want to access a protected dashboard so that I can manage restaurants and restaurant users.

**Context:** This is the second story in Epic 1 (Authentication & User/Restaurant Admin Management). It focuses on creating a protected admin dashboard route accessible only to users with the Admin role. This dashboard will serve as the foundation for all administrative functions in the platform, starting with restaurant management.

## Detailed Requirements

- Create a protected `/admin` route accessible only to users with the 'Admin' role
- Implement route protection using Auth.js session and middleware
- Create a basic admin dashboard layout with navigation structure
- Implement session check and redirect logic for non-admin users
- Create a placeholder for dashboard metrics/overview
- Style dashboard components using Shadcn UI following the design system

## Acceptance Criteria (ACs)

- AC1: A protected `/admin` route exists that checks for Admin role in the session
- AC2: Non-admin users are redirected to an access denied page or login page
- AC3: Admin dashboard has a navigation menu with links to different sections (even if they're placeholders)
- AC4: Dashboard displays the logged-in admin's information from the session
- AC5: Dashboard UI follows the established design system using Shadcn UI components
- AC6: The dashboard is responsive and works on different screen sizes

## Technical Implementation Context

**Guidance:** Use the following details for implementation. Developer agent is expected to follow project standards and understand the project structure. Only story-specific details are included below.

### Relevant Files:

- **Files to Create/Modify:**
  - `app/admin/layout.tsx` - Admin dashboard layout with navigation and session check
  - `app/admin/page.tsx` - Main admin dashboard page with overview
  - `app/admin/denied/page.tsx` - Access denied page for non-admin users
  - `components/admin/Sidebar.tsx` - Navigation sidebar for admin dashboard
  - `components/admin/Header.tsx` - Header component for admin dashboard
  - `middleware.ts` - Extend to protect admin routes

### Key Technologies:

- Next.js App Router for routing and layouts
- Auth.js for session management and protection
- Shadcn UI components for dashboard UI
- Tailwind CSS for styling
- React server components and client components

### API Interactions / SDK Usage:

- Auth.js for session verification
- tRPC for data fetching (minimal in this story)

### UI/UX Notes:

- Dashboard should follow the DoorDash-inspired orange theme
- Use a sidebar layout with navigation items
- Include a header with user info and logout button
- Design should be clean, modern, and responsive

### Data Structures:

- Auth.js session with user role information
- Navigation item structure for sidebar

### Environment Variables:

- N/A for this story (using existing Auth.js configuration)

### Coding Standards Notes:

- Properly separate server and client components
- Use proper TypeScript typing for all components and data
- Implement responsive design using Tailwind CSS utilities
- Follow component structure established in Epic 0
- Use proper error boundaries for handling authentication failures

## Tasks / Subtasks

- [x] Create admin dashboard layout with navigation structure
- [x] Implement session check to verify Admin role
- [x] Create redirect logic for non-admin users
- [x] Build access denied page for unauthorized access attempts
- [x] Create sidebar navigation component with menu items
- [x] Create dashboard header with user information
- [x] Add placeholder for dashboard metrics/overview
- [x] Style all components using Shadcn UI and the design system
- [x] Implement responsive design for different screen sizes
- [x] Update middleware to protect admin routes
- [x] Write tests for admin route protection

## Testing Requirements

**Guidance:** Verify implementation against the ACs using the following tests.

### Unit Tests:

- Test admin route protection logic
- Test sidebar navigation component rendering
- Test header component with user information

### Integration Tests:

- Test admin dashboard access with admin user
- Test redirect with non-admin user
- Test complete dashboard rendering with session data

### Manual/CLI Verification:

- Log in with an admin user and verify access to the admin dashboard
- Log in with a non-admin user and verify redirect to access denied page
- Check dashboard rendering on different screen sizes for responsive design
- Verify that all navigation elements are properly styled and clickable

## Story Wrap Up (Agent Populates After Execution)

**Agent Model Used:**
**Completion Notes:**
**Change Log:**

- Initial Draft: Created story structure for admin dashboard protected route
