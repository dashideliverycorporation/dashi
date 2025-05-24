# Epic 2: Core UI Layout & Static Pages

**Goal:** Build the fundamental application structure, apply the theme, ensure responsiveness, and add static content pages.

**Deployability:** This epic establishes the foundational user interface components and layout structure that will be used across the entire application. It delivers a consistent, responsive, and localized UI framework that ensures a seamless user experience across different devices and languages - a critical requirement for the target market in Goma, DRC.

## Epic-Specific Technical Context

This epic builds upon the UI framework established in Epic 0:

1. **UI Components**: Uses Shadcn UI components styled with the project's theme colors (orange palette)
2. **Layout Structure**: Creates reusable header and footer components with responsive behavior
3. **Localization**: Extends the i18n implementation to support language switching and localized static content
4. **Responsive Design**: Implements a mobile-first approach using Tailwind CSS breakpoints
5. **Static Content**: Establishes patterns for creating and managing static information pages

## Local Testability & Command-Line Access

- **Local Development:**

  - Run `pnpm dev` to start the Next.js development server
  - Run `pnpm test` to run the test suite specifically for UI components

- **Command-Line Testing:**

  - `pnpm test:e2e` for end-to-end testing of layouts and responsiveness
  - `pnpm lint` to verify component code quality and adherence to standards

- **Environment Testing:**

  - Local: Use browser dev tools to test responsiveness across different viewport sizes
  - Development: Vercel preview deployments for each PR
  - Production: Main branch deployment on Vercel

- **Testing Prerequisites:**
  - Browser with developer tools for responsive design testing
  - Multiple language configurations to test localization features

## Story List

### Story 2.1: Implement Core Application Layout (Header, Footer)

- **User Story / Goal:** As a user, I want to navigate the application through a consistent and well-designed interface so that I can access the platform's features easily.
- **Detailed Requirements:**
  - Create a root layout component that wraps all pages
  - Implement a Header component with the application logo and navigation links
  - Implement a Footer component with essential links and copyright information
  - Apply the defined orange theme colors using Tailwind CSS
  - Include basic navigation links in the Header (Home, Login/Logout, Cart icon)
  - Ensure Header displays different navigation options based on authentication state
  - Create a mobile-friendly navigation menu that collapses on smaller screens
- **Acceptance Criteria (ACs):**
  - AC1: Application has a consistent header across all pages
  - AC2: Application has a consistent footer across all pages
  - AC3: Header includes the Dashi logo, linking to the home page
  - AC4: Header shows appropriate navigation links based on authentication state
  - AC5: Navigation components use the defined orange theme colors
  - AC6: Header and footer are visible on all main application routes
- **Tasks (Optional Initial Breakdown):**
  - [ ] Create basic Header component with logo and navigation links
  - [ ] Create Footer component with essential information
  - [ ] Implement authentication-aware navigation options
  - [ ] Style components according to the orange theme
  - [ ] Integrate Header and Footer into the root layout
  - [ ] Create tests for layout components
- **Dependencies:** Epic 0 (Stories 0.4, 0.9)

---

### Story 2.2: Implement Responsiveness

- **User Story / Goal:** As a user, I want to access the application from different devices so that I can use it anywhere, regardless of screen size.
- **Detailed Requirements:**
  - Ensure the Header adapts to different screen sizes, collapsing into a hamburger menu on mobile
  - Make the Footer stack its content vertically on smaller screens
  - Implement responsive grid layouts for pages that display lists of items
  - Use Tailwind CSS breakpoints consistently across components
  - Test the layout on multiple viewport sizes (mobile, tablet, desktop)
  - Ensure touch targets are appropriately sized for mobile interaction
- **Acceptance Criteria (ACs):**
  - AC1: Header converts to a mobile-friendly menu on small screens
  - AC2: Footer content stacks appropriately on small screens
  - AC3: All UI elements are accessible and usable across device sizes
  - AC4: No horizontal scrolling occurs on standard content at any screen size
  - AC5: Touch targets meet minimum size requirements for mobile usability
- **Tasks (Optional Initial Breakdown):**
  - [ ] Update Header with responsive navigation menu
  - [ ] Modify Footer to stack content on small screens
  - [ ] Implement responsive grid layouts for list pages
  - [ ] Test on multiple viewport sizes
  - [ ] Fix any overflow or alignment issues
  - [ ] Create tests for responsive behavior
- **Dependencies:** Story 2.1

---

### Story 2.3: Add Language Switcher to Header

- **User Story / Goal:** As a user from Goma, I want to switch between English and French so that I can use the application in my preferred language.
- **Detailed Requirements:**
  - Integrate the language switcher component into the Header
  - Ensure the language selection persists across page navigation
  - Update all header and footer text to use translation keys
  - Apply the theme styling to the language switcher dropdown
  - Display the current language selection clearly
  - Ensure smooth transition when language is changed
- **Acceptance Criteria (ACs):**
  - AC1: Language switcher is visible in the Header
  - AC2: Clicking the language switcher allows selection between English and French
  - AC3: Language selection persists when navigating between pages
  - AC4: Header and footer text updates immediately when language is changed
  - AC5: Language switcher matches the application's theme
- **Tasks (Optional Initial Breakdown):**
  - [ ] Integrate language switcher into the Header
  - [ ] Update Header and Footer to use translation keys
  - [ ] Implement language persistence across navigation
  - [ ] Style the language switcher according to theme
  - [ ] Test language switching functionality
  - [ ] Create tests for language switching
- **Dependencies:** Story 2.1, Epic 0 (Story 0.9)

---

### Story 2.4: Create Static Pages ("About Us", "Contact", "How it Works")

- **User Story / Goal:** As a user, I want to access information about the platform so that I can learn more about its purpose, how to use it, and how to contact the team.
- **Detailed Requirements:**
  - Create routes for "About Us", "Contact", and "How it Works" pages
  - Implement page components with localized content
  - Add navigation links to these pages in the Footer
  - Style pages consistently with the rest of the application
  - Include appropriate heading structure and semantic HTML
  - Create a simple contact form on the Contact page (non-functional in this story)
- **Acceptance Criteria (ACs):**
  - AC1: "About Us", "Contact", and "How it Works" pages are accessible via URLs
  - AC2: Pages display placeholder or initial content using localization
  - AC3: Pages are linked from the Footer navigation
  - AC4: Content is styled consistently with the application theme
  - AC5: Language switching works on these static pages
  - AC6: Pages use semantic HTML for accessibility
- **Tasks (Optional Initial Breakdown):**
  - [ ] Create route structure for static pages
  - [ ] Implement basic page components with localized content
  - [ ] Add links to these pages in the Footer
  - [ ] Style pages according to the theme
  - [ ] Add translation keys for all static content
  - [ ] Create tests for static pages
- **Dependencies:** Story 2.1, Story 2.3

## Change Log

| Change        | Date       | Version | Description                          | Author         |
| ------------- | ---------- | ------- | ------------------------------------ | -------------- |
| Initial draft | 2025-05-24 | 0.1     | Created initial Epic 2 documentation | GitHub Copilot |

<!-- Generated by GitHub Copilot -->
