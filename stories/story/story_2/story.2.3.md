# Story 2.3: Add Language Switcher to Header

Status: Ready

## Goal & Context

**User Story:** As a user, I want to switch between English and French languages directly from the header so that I can view the application in my preferred language.

**Context:** This is the third story in Epic 2 (Core UI Layout & Static Pages). Building on the header implementation from Story 2.1, this story focuses on integrating the language switcher component (previously developed in Story 0.9) into the application header, enhancing the accessibility of the platform for both English and French-speaking users in Goma, DRC.

## Detailed Requirements

- Integrate the existing language switcher component into the Header
- Position the language switcher in an accessible location within the Header
- Ensure the language switcher is visually consistent with the rest of the header elements
- Implement responsive design for the language switcher on different screen sizes
- Verify that changing the language updates all localized text throughout the application
- Preserve selected language preference between page navigation and sessions
- Show appropriate visual feedback when switching languages

## Acceptance Criteria (ACs)

- AC1: The language switcher is visible and accessible in the Header on all pages
- AC2: Users can switch between English and French languages using the header control
- AC3: The interface language updates immediately when a new language is selected
- AC4: The language switcher maintains the correct selected state based on the current language
- AC5: The language selection is preserved when navigating between pages
- AC6: The language switcher is visually aligned with the application's design system
- AC7: The language switcher is properly displayed on both mobile and desktop views

## Technical Implementation Context

**Guidance:** Use the following details for implementation. Developer agent is expected to follow project standards and understand the project structure. Only story-specific details are included below.

### Relevant Files:

- **Files to Create/Modify:**
  - `components/layout/Header.tsx` - Modify to include language switcher
  - `components/i18n/LanguageSwitcher.tsx` - Ensure this component from Story 0.9 works with the header
  - `lib/i18n/settings.ts` - May need adjustments for integration with header

### Key Technologies:

- i18n library (from Story 0.9) for language switching functionality
- Next.js for routing and state preservation
- React Context for language state management
- Shadcn UI components for consistent styling
- Tailwind CSS for responsive design

### API Interactions / SDK Usage:

- i18n library APIs for language switching
- Local storage or cookies for persisting language preference

### UI/UX Notes:

- Follow the DoorDash-inspired orange theme for the language switcher
- Position the language switcher appropriately in the header (suggestion: near the right side before auth buttons)
- Use clear language indicators (e.g., "EN", "FR" or country flags)
- Ensure the switcher is accessible with proper ARIA attributes
- Make the language switcher responsive:
  - On desktop: Visible in header
  - On mobile: Include in the mobile menu

### Data Structures:

- Language options:
  ```typescript
  type Language = "en" | "fr";
  ```

### Environment Variables:

- N/A for this story (using existing configuration)

### Coding Standards Notes:

- Follow React best practices for integrating components
- Use proper TypeScript typing for all components and data
- Ensure accessibility standards are met (ARIA labels, keyboard navigation)
- Follow established patterns for i18n implementation
- Keep the header component clean and maintainable

## Tasks / Subtasks

- [x] Import the language switcher component into the Header
- [x] Position the language switcher appropriately in the desktop header
- [x] Add language switcher to mobile menu for responsive design
- [x] Style the language switcher to match the header design
- [x] Verify that language selection persists between page navigation
- [x] Ensure proper accessibility attributes on the language switcher
- [x] Update any UI text in the Header to use localized strings

## Testing Requirements

**Guidance:** Verify implementation against the ACs using the following tests.

### Unit Tests:

- Test Header component with language switcher integration
- Test language switcher behavior in header context
- Test language persistence between navigations

### Integration Tests:

- Test language switching from header and its effect on the application content
- Test language state preservation across page navigation
- Test mobile and desktop responsive designs

### Manual/CLI Verification:

- Verify that the language switcher is properly positioned in the header
- Test switching between English and French and verify UI text changes appropriately
- Check that selected language is preserved when navigating between pages
- Verify proper display and functionality on mobile devices
- Check that the language switcher is accessible via keyboard navigation
- Verify that the language switcher maintains proper styling when selected/unselected

## Story Wrap Up (Agent Populates After Execution)

**Agent Model Used:**
**Completion Notes:**

**Change Log:**

- Initial Draft: Created story structure for adding language switcher to header
