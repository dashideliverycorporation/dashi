# Story 0.4: UI Library Setup (Shadcn UI)

Status: Completed

## Goal & Context

**User Story:** As a developer, I want to integrate Shadcn UI into the project and configure it with the specified theme colors to establish a consistent UI foundation for the Dashi platform.

**Context:** This is the fourth story in Epic 0 (Initial Project & Core Infrastructure Setup). It focuses on setting up the UI library infrastructure using Shadcn UI and configuring it with an orange color theme inspired by DoorDash as specified in the PRD. This UI foundation will provide consistent, accessible, and aesthetically pleasing components for all user interfaces in the project.

## Detailed Requirements

- Install and configure Shadcn UI in the Next.js project
- Set up Tailwind CSS with the orange theme color scheme
- Create a test page to demonstrate Shadcn UI components with the theme
- Ensure the components render correctly with the custom theme

## Acceptance Criteria (ACs)

- AC1: Shadcn UI is properly integrated into the Next.js project
- AC2: The Tailwind configuration includes Shadcn UI configurations and orange theme colors
- AC3: A test page demonstrates at least one Shadcn UI component styled with the configured theme
- AC4: The component test verifies that the UI components render correctly

## Technical Implementation Context

**Guidance:** Use the following details for implementation. Developer agent is expected to follow project standards and understand the project structure. Only story-specific details are included below.

### Relevant Files:

- **Files to Create:**

  - `app/test-ui/page.tsx` - Test page to demonstrate Shadcn UI components
  - `app/test-ui/page.test.tsx` - Component test for the test page

- **Files to Modify:**
  - `tailwind.config.js` - Update to include Shadcn UI configurations and theme colors
  - Other configuration files that may be created during Shadcn UI initialization

### Key Technologies:

- Next.js (App Router)
- Tailwind CSS
- Shadcn UI
- React Testing Library

### API Interactions / SDK Usage:

- N/A for this UI setup story

### UI/UX Notes:

- The theme should adopt an orange color scheme inspired by DoorDash
- The UI components should be visually consistent and follow modern design practices
- The test page should demonstrate that components properly use the theme colors

### Data Structures:

- N/A for this UI setup story

### Environment Variables:

- N/A for this UI setup story

### Coding Standards Notes:

- Follow Shadcn UI best practices for component usage
- Ensure proper TypeScript typing for components
- Use semantic HTML within components
- Ensure components are accessible (follow WCAG guidelines)
- Document theme color choices with appropriate comments

## Tasks / Subtasks

- [x] Ensure the project has Tailwind CSS configured (done during `create-next-app`)
- [x] Install Shadcn UI via the recommended CLI command: `pnpm dlx shadcn-ui@latest init`
- [x] Follow the prompts during the `init` process (confirm Tailwind usage, select appropriate directory, configure CSS variables if prompted)
- [x] Update `tailwind.config.js` to customize the theme colors, adding orange colors based on a "DoorDash-like aesthetic"
- [x] Add a basic test page (`app/test-ui/page.tsx`)
- [x] Import and use simple Shadcn UI components (e.g., Button, Card) on the test page
- [x] Write a basic component test to ensure the test Shadcn UI component renders without crashing
- [x] Verify the components render correctly and utilize the configured theme colors by running the app locally
- [x] Document the theme configuration choices

## Testing Requirements

**Guidance:** Verify implementation against the ACs using the following tests.

### Unit Tests:

- Write a basic component test using React Testing Library to ensure the test page with Shadcn UI components renders without crashing

### Integration Tests:

- N/A for this UI setup story

### Manual Verification:

- Run the application locally and navigate to the test page
- Verify that Shadcn UI components render correctly with the orange theme colors
- Verify that the components are visually consistent with the DoorDash-inspired aesthetic
- Test the page on different screen sizes to ensure responsive design

## Story Wrap Up (Agent Populates After Execution)

**Agent Model Used:** GitHub Copilot
**Completion Notes:** Successfully integrated Shadcn UI into the project and configured it with a DoorDash-inspired orange theme. Created a test page that demonstrates various Shadcn UI components using the custom theme. The components render correctly with the orange color scheme, providing a visually consistent UI foundation for the Dashi platform. Added component tests to ensure proper rendering.
**Change Log:**

- Initial Draft
- May 7, 2025: Completed UI Library Setup
