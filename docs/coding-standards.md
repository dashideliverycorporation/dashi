# Dashi Coding Standards and Patterns

## Architectural / Design Patterns Adopted

- **Modular Monolith with Next.js App Router:** Using Next.js App Router to structure the application as a modular monolith, allowing logical separation into modules (customer, restaurant, admin, auth, API) - _Rationale/Reference:_ See `docs/architecture.md` - Simplifies deployment and development while providing structure for future scaling.
- **Type-Safe API Layer with tRPC:** End-to-end type safety between frontend and backend using tRPC - _Rationale/Reference:_ Provides type safety, reducing bugs and increasing development velocity after initial setup.
- **Service/Repository Pattern:** Abstracting database interactions and business logic into service functions - _Rationale/Reference:_ Improves code organization, testability, and maintainability.

## Coding Standards

- **Primary Language(s):** TypeScript 5.7.x
- **Primary Runtime(s):** Node.js 22.x, Next.js (App Router)
- **Style Guide & Linter:** ESLint with Airbnb config, Prettier - _Configuration:_ See `eslint.config.js` for ESLint configuration
- **Naming Conventions:**
  - Variables: `camelCase`
  - Functions: `camelCase`
  - Classes/Types/Interfaces: `PascalCase`
  - Constants: `UPPER_SNAKE_CASE`
  - Private Class Fields: Must use underscore prefix (`_privateField`)
  - Files: `kebab-case.tsx` or `kebab-case.ts` for TypeScript files
  - Component Files: `PascalCase.tsx` for React components
- **File Structure:** Adhere to the Next.js App Router layout defined in `docs/architecture.md` Section 10.
- **Asynchronous Operations:** Use `async`/`await` for all asynchronous operations; avoid direct Promise chains.
- **Type Safety:**
  - Use TypeScript strict mode throughout the application
  - Avoid using `any` type - use proper typing or `unknown` with type guards when necessary
  - Use Zod for runtime validation, especially in tRPC procedures
  - Define shared types in dedicated files (e.g., `/b/types.ts`)
- **Comments & Documentation:**
  - Use JSDoc for public functions and components
  - Document props for React components
  - Include purpose and usage comments for complex logic
  - Keep README.md files updated with relevant information
- **Dependency Management:**
  - Use pnpm as the package manager
  - Get approval before adding new dependencies
  - Prefer well-maintained, typed libraries with active communities
  - Document the purpose of each dependency in a comment when adding it

## Error Handling Strategy

- **General Approach:** Use structured error handling with specific error types; prefer throwing typed errors over returning null/undefined
- **Logging:**
  - Library/Method: Use Next.js logger or structured console logging
  - Format: JSON in production, formatted text in development
  - Levels: DEBUG, INFO, WARN, ERROR
  - Context: Include request ID, user context (when available), timestamp, and relevant state information
- **Specific Handling Patterns:**
  - **tRPC Errors:** Use `TRPCError` with appropriate codes (`NOT_FOUND`, `BAD_REQUEST`, `UNAUTHORIZED`, etc.)
  - **External API Calls:** Wrap in try/catch blocks, implement retries with exponential backoff for transient errors
  - **Input Validation:** Use Zod schemas for all tRPC procedure inputs and form data
  - **UI Error States:** Provide user-friendly error messages while logging detailed errors

## Testing Standards

- **Unit Testing:**

  - Use Jest and React Testing Library
  - Co-locate test files with implementation (e.g., `component.tsx` and `component.test.tsx`)
  - Test business logic and UI components separately
  - Aim for high coverage of business logic and critical paths

- **Integration Testing:**

  - Test API routes and database interactions
  - Verify end-to-end workflows across multiple components
  - Integration tests should be in a separate directory (`__tests__/integration`)

- **Test Naming and Structure:**
  - Use descriptive test names (`describe`, `it` blocks should read as sentences)
  - Follow the Arrange-Act-Assert pattern
  - Isolate tests from each other (no shared state)

## Security Best Practices

- **Input Sanitization/Validation:**

  - Use Zod schemas for all user inputs
  - Never trust client-side data
  - Apply validation on both client and server

- **Secrets Management:**

  - Store all secrets in environment variables
  - Never commit secrets to the repository
  - Use `.env.local` for local development (included in `.gitignore`)
  - Configure secrets in Vercel for deployment environments

- **Authentication/Authorization:**

  - Use Auth.js for authentication
  - Implement authorization checks in tRPC middlewares
  - Separate public and protected routes/procedures

- **Database Security:**
  - Use Prisma's type-safe queries to prevent SQL injection
  - Apply proper access controls on database operations
  - Never expose sensitive data in API responses

## Accessibility Standards

- Use semantic HTML elements
- Ensure proper color contrast (WCAG AA compliance)
- Provide alternative text for images
- Ensure keyboard navigability
- Test with screen readers when possible

## Internationalization (i18n) Standards

- Use react-i18next for translations
- Keep translation keys organized by feature
- Use proper pluralization and formatting
- Never hardcode user-facing strings

## Change Log

| Change        | Date       | Version | Description                        | Author         |
| ------------- | ---------- | ------- | ---------------------------------- | -------------- |
| Initial draft | 2025-05-05 | 0.1     | Initial coding standards for Dashi | GitHub Copilot |

<!-- Generated by Copilot -->
