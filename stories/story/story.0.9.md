# Story 0.9: Localization Framework Setup (react-i18next)

Status: Completed

## Goal & Context

**User Story:** As a developer, I want to implement a localization framework using react-i18next so that our application can support both English and French languages, making it accessible to our target audience in Goma, DRC.

**Context:** This is the ninth story in Epic 0 (Initial Project & Core Infrastructure Setup). It focuses on setting up the localization infrastructure that will enable the application to support multiple languages as required in the PRD. The ability to switch between English and French is crucial for serving the diverse population in the target market, where both languages are commonly used.

## Detailed Requirements

- Install react-i18next and necessary dependencies
- Configure i18n instance with English and French locales
- Set up translation files structure for both languages
- Integrate i18n provider in the Next.js application
- Implement a language switcher component
- Create a custom hook for accessing translations
- Demonstrate usage in at least one component

## Acceptance Criteria (ACs)

- AC1: react-i18next and required dependencies are properly installed
- AC2: The i18n configuration supports English (default) and French locales
- AC3: Translation files are properly structured and organized by namespaces
- AC4: The i18n provider is integrated at the application root level
- AC5: A language switcher component allows users to toggle between English and French
- AC6: The language preference is persisted across page refreshes
- AC7: Static text can be translated using the framework

## Technical Implementation Context

**Guidance:** Use the following details for implementation. Developer agent is expected to follow project standards and understand the project structure. Only story-specific details are included below.

### Relevant Files:

- **Files to Create:**

  - `lib/i18n/index.ts` - Main i18n configuration
  - `lib/i18n/client.ts` - Client-side i18n configuration
  - `lib/i18n/server.ts` - Server-side i18n configuration
  - `lib/i18n/settings.ts` - Common i18n settings (languages, namespaces)
  - `app/i18n-provider.tsx` - Provider component to wrap the application
  - `components/i18n/LanguageSwitcher.tsx` - Language switching component
  - `components/i18n/LocalizedLink.tsx` - Helper component for localized routing
  - `public/locales/en/common.json` - English common translations
  - `public/locales/fr/common.json` - French common translations

- **Files to Modify:**
  - `app/layout.tsx` - Add i18n provider
  - `app/page.tsx` - Add language switcher component (temporary for testing)
  - `.env.example` - Add locale-related environment variables
  - `.env.local` - Add locale-related environment variables

### Key Technologies:

- Next.js (App Router)
- TypeScript
- react-i18next
- i18next
- next-i18next
- i18next-browser-languagedetector
- i18next-http-backend

### API Interactions / SDK Usage:

- i18next for translation management
- Browser language detection for automatic locale selection
- Local storage for persisting language preferences

### Data Structures:

- i18n configuration types
- Language settings interface
- Translation namespaces

### Environment Variables:

- `NEXT_PUBLIC_DEFAULT_LOCALE` - Default locale (e.g., "en")
- `NEXT_PUBLIC_SUPPORTED_LOCALES` - Comma-separated list of supported locales (e.g., "en,fr")

### Coding Standards Notes:

- Follow TypeScript best practices for type safety
- Use React context pattern for i18n provider
- Create reusable translation hooks
- Implement proper namespacing for translations
- Follow Next.js App Router internationalization best practices

## Tasks / Subtasks

- [x] Install required packages: `pnpm add react-i18next i18next i18next-browser-languagedetector i18next-http-backend`
- [x] Create i18n configuration files in the lib directory
- [x] Set up basic translation files for English and French
- [x] Create i18n provider component to wrap the application
- [x] Modify layout.tsx to include the i18n provider
- [x] Implement language detection based on browser settings
- [x] Create language switcher component with toggle functionality
- [x] Add language switcher to a page for testing
- [x] Implement local storage persistence for language preference
- [x] Create a custom hook for using translations
- [x] Update environment variables with locale settings
- [x] Write documentation for using the localization framework

## Testing Requirements

**Guidance:** Verify implementation against the ACs using the following tests.

### Unit Tests:

- Test the i18n configuration initialization
- Test language switcher component functionality
- Test custom translation hooks

### Integration Tests:

- Test integration with Next.js app router
- Test language persistence across page navigation

### Manual Verification:

- Verify that the application can switch between English and French
- Confirm that language preference is remembered after page refresh
- Check that all sample translations display correctly in both languages
- Verify that automatic language detection works based on browser settings

## Story Wrap Up (Agent Populates After Execution)

**Agent Model Used:**
**Completion Notes:**
**Change Log:**

- Initial Draft
