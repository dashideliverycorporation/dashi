# Story 5.1: Customer Registration Page

Status: Ready

## Goal & Context

**User Story:** As a new user, I want to register as a customer so that I can place orders on the Dashi platform.

**Context:** This is the first story in Epic 5 (Customer Ordering & History). It establishes the customer registration flow which is a prerequisite for placing orders. This story creates a dedicated registration page for customers that ensures they can create an account with the appropriate "CUSTOMER" role, enabling them to use the ordering functionality in subsequent stories.

## Detailed Requirements

- Create a dedicated customer registration page with a form containing the following fields:
  - Email address (required, must be valid email format)
  - Password (required, minimum 8 characters)
  - Name (required, for order identification)
  - Phone number (required, for order communication)
  - Address (optional, can be provided later during checkout)
- Implement client-side validation for all form inputs using Zod
- Display clear validation errors when inputs don't meet requirements
- Submit registration data to a backend tRPC procedure that:
  - Validates incoming data
  - Checks for existing users with the same email
  - Creates a new user with the "CUSTOMER" role
  - Creates an associated customer record with additional fields
  - Securely hashes the password before storage
- Handle form submission states:
  - Loading state during submission
  - Error states (existing email, server errors)
  - Success state with confirmation message
- Redirect successful registrations to the login page
- Include "Already have an account?" link to the login page
- Ensure all static text is properly set up for localization (English and French)
- Apply styling consistent with the design system (orange theme)
- Ensure the form is fully responsive on all device sizes

## Acceptance Criteria (ACs)

- AC1: A dedicated registration form exists with fields for email, password, name, and phone number
- AC2: All form inputs have appropriate client-side validation with clear error messages
- AC3: Submitting valid data creates a new user with the "CUSTOMER" role in the database
- AC4: Password is securely hashed before storage
- AC5: A customer record is created and linked to the user record
- AC6: Duplicate email addresses are detected and prevented with appropriate error messages
- AC7: Form shows appropriate loading state during submission
- AC8: Success state redirects to login page with a success message
- AC9: The form includes a link to the login page for existing users
- AC10: All text content is properly localized and supports language switching
- AC11: The page is responsive and displays correctly on all screen sizes

## Technical Implementation Context

**Guidance:** Use the following details for implementation. Developer agent is expected to follow project standards and understand the project structure. Only story-specific details are included below.

### Relevant Files:

- **Files to Create:**

  - `app/register/page.tsx` - Customer registration page component
  - `components/auth/SignUpForm.tsx` - Registration form component
  - `server/schemas/customer.schema.ts` - Zod schema for customer registration validation
  - `server/trpc/routers/customer.ts` - tRPC router with customer registration procedure

- **Files to Modify:**
  - `server/trpc/routers/_app.ts` - Add customer router to the main router
  - `components/layout/Header.tsx` - Update with link to registration page if not exists

### Key Technologies:

- Next.js (App Router) for page routing and components
- TypeScript for type safety
- React Hook Form with Zod for form validation
- tRPC for type-safe API calls
- Prisma for database operations
- Shadcn UI components for form elements
- Tailwind CSS for styling
- react-i18next for localization

### API Interactions / SDK Usage:

- tRPC procedure for customer registration
- Prisma Client for database operations
- Auth.js functions for session management

### UI/UX Notes:

- Follow the DoorDash-inspired orange theme
- Use Shadcn UI form components for consistency
- Show validation errors inline with form fields
- Include appropriate loading indicators during form submission
- Display success and error messages prominently
- Design a clean, simple form layout with clear section headings
- Ensure adequate spacing between form elements
- Use clear, descriptive labels and placeholder text
- Make form layout responsive with full width on mobile and appropriate width on larger screens
- Consider password strength indicator or requirements list
- Ensure "Register" button is prominent and uses the primary color

### Data Structures:

- Customer registration input schema:

  ```typescript
  interface CustomerRegistrationInput {
    email: string; // Email address (must be valid format)
    password: string; // Password (minimum 8 characters)
    name: string; // Full name
    phoneNumber: string; // Contact phone number
    address?: string; // Optional address
  }
  ```

- Customer registration response:

  ```typescript
  interface CustomerRegistrationResponse {
    success: boolean;
    message: string;
    userId?: string;
  }
  ```

### Environment Variables:

- No new environment variables needed for this story

### Coding Standards Notes:

- Follow TypeScript strict mode with proper type definitions
- Use zod for validating all input data
- Implement proper error handling for form validation and submission
- Create reusable, single-responsibility components
- Add appropriate accessibility attributes to form elements
- Follow established localization patterns using translation keys
- Ensure responsive design with appropriate Tailwind classes
- Document complex logic with JSDoc comments
- Follow project UI/UX standards for form design

## Tasks / Subtasks

- [x] Create registration form component
- [ ] Create Zod schema for customer registration validation
- [ ] Create customer registration tRPC procedure
- [ ] Add customer router to main tRPC router
- [ ] Implement form submission logic with tRPC
- [ ] Add loading, error, and success states
- [ ] Create registration page with form component
- [ ] Style the form according to design system
- [ ] Set up localization for all text content
- [ ] Add link to login page for existing users
- [ ] Implement responsive styling for different screen sizes
- [ ] Add client-side tests for form validation
- [ ] Add server-side tests for registration procedure
- [ ] Test form submission with valid and invalid data
- [ ] Test form validation for all required fields
- [ ] Test duplicate email detection and error handling

## Testing Requirements

**Guidance:** Verify implementation against the ACs using the following tests.

### Unit Tests:

- Test form validation with valid and invalid inputs
- Test registration procedure with valid data
- Test error handling for duplicate emails
- Test customer schema validation

### Integration Tests:

- Test complete registration flow from form submission to database storage
- Test redirection after successful registration
- Verify correct role assignment and customer record creation

### Manual/CLI Verification:

- Test form submission with valid data and verify user creation in database
- Test form validation by submitting invalid data (email format, password length)
- Test duplicate email handling by attempting to register with an existing email
- Verify password hashing by checking the stored password in the database
- Test responsive design by viewing the form on different device sizes
- Test localization by switching between languages
- Verify accessibility using keyboard navigation and screen reader compatibility

## Story Wrap Up (Agent Populates After Execution)

**Agent Model Used:**
**Completion Notes:**

**Change Log:**

- Initial Draft: Created story structure for Customer Registration Page
