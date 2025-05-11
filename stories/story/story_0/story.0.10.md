# Story 0.10: UI/UX Specification and Design System Setup

Status: Completed

## Goal & Context

**User Story:** As a developer, I want to establish a cohesive UI/UX design system for Dashi that incorporates DoorDash-inspired styling, so that we can build a modern and consistent user interface across the entire application.

**Context:** This is the tenth story in Epic 0 (Initial Project & Core Infrastructure Setup). It focuses on defining the UI/UX specifications, including color palette, typography, component patterns, and layout guidelines. This design system will serve as the foundation for all visual elements in the Dashi platform, ensuring consistency, accessibility, and ease of development.

## Detailed Requirements

- Define the Dashi color palette with primary, secondary, and accent colors
- Establish typography guidelines including font families, sizes, and weights
- Create component design patterns leveraging Shadcn UI
- Define layout specifications for key screens (home, restaurant listing, menu, cart, checkout)
- Implement base styling configurations in the application
- Create reusable UI components that follow the design system
- Document the design system for future reference

## Acceptance Criteria (ACs)

- AC1: A comprehensive color palette is defined and implemented with variables
- AC2: Typography guidelines are established and implemented in the application
- AC3: Component patterns are documented using Shadcn UI components
- AC4: Layout specifications for key screens are defined
- AC5: Base styling configurations are implemented in the application
- AC6: Reusable UI components are created following the design system
- AC7: The design system is documented for developer reference

## Technical Implementation Context

**Guidance:** Use the following details for implementation. Developer agent is expected to follow project standards and understand the project structure. Only story-specific details are included below.

### Relevant Files:

- **Files to Create:**

  - `docs/ui-ux-spec.md` - Comprehensive documentation of the design system
  - `lib/constants/theme.ts` - Constants for colors, spacing, and other theme values
  - `components/ui-examples/ThemeShowcase.tsx` - A component to showcase theme elements

- **Files to Modify:**
  - `app/globals.css` - Update with color variables and base styling
  - `tailwind.config.ts` - Configure Tailwind with the design system colors
  - `components.json` - Update Shadcn UI configuration if needed

### Key Technologies:

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Shadcn UI
- CSS Variables

### Color Palette:

- **Primary Colors:**

  - Primary Orange: `#FF4F00` (Bright, energetic orange for primary actions)
  - Secondary Orange: `#E64600` (Slightly darker orange for secondary actions)

- **Neutral Colors:**

  - White: `#FFFFFF` (Backgrounds, cards)
  - Light Gray: `#F7F7F7` (Secondary backgrounds)
  - Medium Gray: `#D4D4D4` (Borders, dividers)
  - Dark Gray: `#333333` (Primary text)

- **Accent Colors:**
  - Success Green: `#4CAF50` (Success states, confirmations)
  - Error Red: `#F44336` (Error messages, warnings)
  - Info Blue: `#2196F3` (Informational elements)

### Typography:

- **Font Families:**

  - Primary: Inter (Sans-serif for all text)
  - Fallback: System UI fonts

- **Font Sizes:**

  - Display: 36px/2.25rem
  - Heading 1: 30px/1.875rem
  - Heading 2: 24px/1.5rem
  - Heading 3: 20px/1.25rem
  - Heading 4: 18px/1.125rem
  - Body Large: 16px/1rem
  - Body: 14px/0.875rem
  - Small: 12px/0.75rem

- **Font Weights:**
  - Light: 300
  - Regular: 400
  - Medium: 500
  - Semi-Bold: 600
  - Bold: 700

### UI Components:

Leverage Shadcn UI components with customized styling to match the Dashi design system:

- **Navigation:**

  - Main Header with logo, navigation links, language switcher, and auth buttons
  - Bottom navigation bar for mobile (home, search, orders, profile)

- **Cards:**

  - Restaurant Card (image, name, cuisine type, rating)
  - Menu Item Card (image, name, description, price, add button)
  - Order Summary Card (items, quantities, prices, total)

- **Buttons:**

  - Primary Button (solid orange background)
  - Secondary Button (outlined)
  - Icon Button (for actions like add to cart, remove)

- **Forms:**

  - Input fields with labels and validation
  - Dropdown menus for selection
  - Checkboxes and radio buttons
  - Form validation messaging

- **Layouts:**
  - Customer-facing pages (responsive grid layouts)
  - Restaurant dashboard (sidebar navigation with content area)
  - Admin dashboard (sidebar navigation with content area)

### Coding Standards Notes:

- Use Tailwind CSS utility classes for styling
- Implement CSS variables for theme colors and spacing
- Follow Mobile-First approach for responsive design
- Ensure accessibility (WCAG 2.1 AA compliance)
- Use semantic HTML elements
- Implement proper component composition patterns

## Tasks / Subtasks

- [x] Create `docs/ui-ux-spec.md` with comprehensive design system documentation
- [x] Create `lib/constants/theme.ts` with theme constants
- [x] Update `app/globals.css` with CSS variables and base styling
- [x] Create example components to showcase the design system
- [x] Update Shadcn UI component styling to match Dashi design system

## Testing Requirements

**Guidance:** Verify implementation against the ACs using the following tests.

### Visual Testing:

- Create a theme showcase page to display all UI elements
- Verify color contrast meets accessibility standards (WCAG 2.1 AA)
- Test responsive design across different device sizes

### Component Testing:

- Test Shadcn UI components with custom styling
- Verify component composition patterns work as expected

### Manual Verification:

- Review the design system documentation for completeness
- Verify visual consistency across components
- Ensure responsive design works on different device sizes
- Validate that the design aligns with the DoorDash-inspired modern look and feel

## Story Wrap Up (Agent Populates After Execution)

**Agent Model Used:**
**Completion Notes:**
**Change Log:**

- Initial Draft
