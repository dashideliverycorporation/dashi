# Story 5.2: Customer Login Page

Status: Ready

## Goal & Context

**User Story:** As a registered customer, I want to log in to my account so that I can place orders and view my order history.

**Context:** This is the second story in Epic 5 (Customer Ordering & History). It builds upon the customer registration functionality implemented in Story 5.1 and provides the authentication mechanism necessary for customers to access personalized features like placing orders and viewing order history. This story ensures a secure and user-friendly login experience specifically tailored to the needs of customers.

## Detailed Requirements

- Create a dedicated customer login page with a form containing the following fields:
  - Email address (required, must be valid email format)
  - Password (required)
- Implement client-side validation for all form inputs using Zod
- Display clear validation errors when inputs don't meet requirements
- Submit login data to Auth.js login endpoint using the credentials provider
- Handle form submission states:
  - Loading state during submission
  - Error states (invalid credentials, server errors)
  - Success state with redirect
- Implement "Remember me" functionality using persistent sessions
- Provide a "Forgot password?" link (non-functional in this story, just UI)
- Add a link to the registration page for new users
- Redirect successful logins based on user role:
  - Customers should be directed to the homepage or last visited page
  - Admin users should be directed to the admin dashboard
  - Restaurant users should be directed to the restaurant dashboard
- Ensure all static text is properly set up for localization (English and French)
- Apply styling consistent with the design system (orange theme)
- Ensure the form is fully responsive on all device sizes

## Acceptance Criteria (ACs)

- AC1: A dedicated login form exists with fields for email and password
- AC2: All form inputs have appropriate client-side validation with clear error messages
- AC3: Submitting valid credentials creates an authenticated session
- AC4: Invalid credentials result in appropriate error messages
- AC5: Form shows appropriate loading state during submission
- AC6: Successful login redirects customers to the homepage or last visited page
- AC7: "Remember me" functionality persists the session as expected
- AC8: The form includes a link to the registration page for new users
- AC9: The login page is properly protected - already logged-in users are redirected
- AC10: All text content is properly localized and supports language switching
- AC11: The page is responsive and displays correctly on all screen sizes

## Technical Implementation Context

**Guidance:** Use the following details for implementation. Developer agent is expected to follow project standards and understand the project structure. Only story-specific details are included below.

### Relevant Files:

- **Files to Create:**

  - `app/login/page.tsx` - Customer login page component
  - `components/auth/CustomerLoginForm.tsx` - Login form component specifically for customers

- **Files to Modify:**
  - `app/signin/page.tsx` - Update with redirection logic for already authenticated users
  - `components/layout/Header.tsx` - Update with login/logout conditional display if needed
  - `components/auth/SignInForm.tsx` - Consider refactoring to share code with customer login form

### Key Technologies:

- Next.js (App Router) for page routing and components
- TypeScript for type safety
- React Hook Form with Zod for form validation
- Auth.js (previously NextAuth) for authentication
- Shadcn UI components for form elements
- Tailwind CSS for styling
- react-i18next for localization

### API Interactions / SDK Usage:

- Auth.js `signIn` function for authentication
- Auth.js `useSession` hook for checking authentication status
- `next/navigation` for routing and redirection

### UI/UX Notes:

- Follow the DoorDash-inspired orange theme
- Use Shadcn UI form components for consistency
- Show validation errors inline with form fields
- Include appropriate loading indicators during form submission
- Display error messages prominently using the Alert component
- Password field should have a toggle to show/hide the password
- "Remember me" checkbox should be easily clickable
- Make login button prominent with the primary color
- "Sign up" link should be clearly visible for new users
- Form should be centered on the page with appropriate width
- Form controls should have appropriate spacing and padding
- Consider adding subtle animations for form submission states

### Data Structures:

- Login form schema:

  ```typescript
  const loginSchema = z.object({
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email("Invalid email address"),
    password: z.string().min(1, { message: "Password is required" }),
  });
  ```

- Login form values type:

  ```typescript
  type LoginFormValues = z.infer<typeof loginSchema>;
  ```

- Auth.js signIn parameters:

  ```typescript
  interface SignInParams {
    email: string;
    password: string;
    redirect: boolean;
    callbackUrl: string;
  }
  ```

### Environment Variables:

- No new environment variables needed for this story (using existing Auth.js configuration)

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

- [ ] Create Zod schema for login form validation
- [ ] Create dedicated customer login page with appropriate routing
- [ ] Create customer login form component with validation
- [ ] Implement form submission logic with Auth.js
- [ ] Add loading, error, and success states
- [ ] Implement "Remember me" functionality
- [ ] Add redirection logic based on user role
- [ ] Add protection to redirect already authenticated users
- [ ] Style the form according to design system
- [ ] Set up localization for all text content
- [ ] Add link to registration page for new users
- [ ] Implement responsive styling for different screen sizes
- [ ] Add client-side tests for form validation
- [ ] Add integration tests for login functionality
- [ ] Test login with valid and invalid credentials
- [ ] Test redirection logic for different user roles

## Testing Requirements

**Guidance:** Verify implementation against the ACs using the following tests.

### Unit Tests:

- Test form validation with valid and invalid inputs
- Test error handling for invalid credentials
- Test loading state during form submission
- Test password visibility toggle functionality

### Integration Tests:

- Test complete login flow from form submission to successful authentication
- Test redirection based on user role (customer, admin, restaurant)
- Test "Remember me" functionality for session persistence
- Test protection for already authenticated users

### Manual/CLI Verification:

- Test login with valid credentials for customer, admin, and restaurant users
- Test form validation by submitting invalid data (email format, empty fields)
- Test error handling by attempting to login with incorrect credentials
- Verify redirection behavior for different user roles
- Test "Remember me" functionality by closing browser and returning
- Test responsive design by viewing the form on different device sizes
- Test localization by switching between languages
- Verify accessibility using keyboard navigation and screen reader compatibility

## Story Wrap Up (Agent Populates After Execution)

**Agent Model Used:**
**Completion Notes:**

**Change Log:**

- Initial Draft: Created story structure for Customer Login Page
