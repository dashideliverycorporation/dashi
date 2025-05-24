# Story 2.1: Implement Core Application Layout (Header, Footer)

Status: Ready

## Goal & Context

**User Story:** As a user, I want to navigate the application through a consistent and well-designed interface so that I can access the platform's features easily.

**Context:** This is the first story in Epic 2 (Core UI Layout & Static Pages). It focuses on creating the fundamental application structure that will be used across all pages, establishing the visual identity of the platform, and providing consistent navigation elements.

## Detailed Requirements

- Create a root layout component that wraps all pages of the application
- Implement a Header component with the application logo and navigation links
- Implement a Footer component with essential links and copyright information
- Apply the defined orange theme colors using Tailwind CSS
- Include basic navigation links in the Header (Home, Login/Logout, Cart icon)
- Ensure Header displays different navigation options based on authentication state
- Create mobile-friendly navigation structures for the Header
- Use Shadcn UI components styled according to the project's theme
- Ensure the layout provides appropriate spacing and container widths

## Acceptance Criteria (ACs)

- AC1: Application has a consistent header visible across all pages
- AC2: Application has a consistent footer visible across all pages
- AC3: Header includes the Dashi logo, linking to the home page
- AC4: Header shows appropriate navigation links based on authentication state (Login/Signup when logged out, Profile/Logout when logged in)
- AC5: Navigation components use the defined orange theme colors
- AC6: Footer includes links to important static pages and copyright information
- AC7: Layout components follow the established design system using Shadcn UI
- AC8: Root layout applies consistent padding and maximum width constraints

## Technical Implementation Context

**Guidance:** Use the following details for implementation. Developer agent is expected to follow project standards and understand the project structure. Only story-specific details are included below.

### Relevant Files:

- **Files to Create/Modify:**
  - `components/layout/Header.tsx` - Main navigation header component
  - `components/layout/Footer.tsx` - Footer component with links and info
  - `components/layout/NavLinks.tsx` - Navigation links component with authentication awareness
  - `components/layout/Logo.tsx` - Logo component for consistent usage
  - `components/layout/Container.tsx` - Container component for consistent width constraints
  - `app/globals.css` - Ensure theme colors are properly defined

### Key Technologies:

- Next.js App Router for layout structure
- Auth.js for session detection in navigation
- Shadcn UI components for UI elements
- Tailwind CSS for styling and responsive design
- React server components for layout structure

### API Interactions / SDK Usage:

- Auth.js for checking authentication status
- Next.js navigation APIs for links and routing

### UI/UX Notes:

- Follow the DoorDash-inspired orange theme
- Create a clean, modern navigation layout
- Ensure proper spacing between elements
- Use appropriate hover/active states for interactive elements
- Header should be sticky on desktop and static on mobile

### Data Structures:

- Auth.js session data for conditional rendering based on auth state
- Navigation item structure (label, href, icon)

### Environment Variables:

- N/A for this story (using existing configuration)

### Coding Standards Notes:

- Properly separate server and client components
- Use proper TypeScript typing for all components and data
- Use Tailwind CSS utility classes consistently
- Avoid inline styles in favor of Tailwind classes
- Extract reusable UI patterns into separate components
- Use semantic HTML elements for accessibility

## Tasks / Subtasks

- [x] Create Container component for consistent width constraints
- [x] Implement Header component with navigation links
- [x] Create NavLinks component with authentication-aware rendering
- [x] Implement Footer component with links and copyright information

## Testing Requirements

**Guidance:** Verify implementation against the ACs using the following tests.

### Unit Tests:

- Test Logo component rendering
- Test NavLinks component with different auth states
- Test Container component with different widths
- Test Header component structure and elements
- Test Footer component structure and elements

### Integration Tests:

- Test complete layout rendering with Header and Footer
- Test navigation link behavior with authentication
- Test theme application across components

### Manual/CLI Verification:

- Check Header and Footer appearance across different pages
- Verify authentication-based navigation options by logging in/out
- Test Header and Footer rendering on different screen sizes
- Verify all navigation links work correctly
- Check that the logo links to the home page
- Verify the theme colors are applied correctly to all elements
- Confirm container widths and spacing are consistent

## Story Wrap Up (Agent Populates After Execution)

**Agent Model Used:**
**Completion Notes:**

**Change Log:**

- Initial Draft: Created story structure for core application layout
- May 24, 2025: Created Container component for consistent width constraints
- May 24, 2025: Implemented Header component with navigation links and mobile menu
- May 24, 2025: Implemented Footer component with links and copyright information
