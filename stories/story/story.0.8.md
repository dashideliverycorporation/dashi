# Story 0.8: Email Service Setup (Resend)

Status: Planning

## Goal & Context

**User Story:** As a developer, I want to integrate the Resend email service with our application so that we can reliably send transactional emails to users and restaurants.

**Context:** This is the eighth story in Epic 0 (Initial Project & Core Infrastructure Setup). It focuses on setting up Resend as our email service provider. Resend will enable us to send important emails such as order confirmations, notifications, and account-related communications. This integration is crucial for the platform to notify restaurants about new orders and provide users with necessary updates.

## Detailed Requirements

- Create a Resend account and verify domain/email
- Obtain a Resend API key
- Install Resend SDK
- Add the Resend API key to environment variables
- Create a basic helper function to send emails using Resend
- Implement a test function to verify the email service works correctly

## Acceptance Criteria (ACs)

- AC1: Resend account is created and domain/email is verified
- AC2: Resend SDK is properly installed and configured
- AC3: Environment variables are configured with the Resend API key
- AC4: A helper function exists that can send emails via Resend
- AC5: A test email can be successfully sent through the helper function

## Technical Implementation Context

**Guidance:** Use the following details for implementation. Developer agent is expected to follow project standards and understand the project structure. Only story-specific details are included below.

### Relevant Files:

- **Files to Create:**

  - `lib/email/resend.ts` - Resend client configuration and helper functions
  - `lib/email/templates/test.ts` - Test email template
  - `.env.local` - Local environment variables file to add the Resend API key
  - `.env.example` - Example environment variables file

- **Files to Modify:**
  - `app/page.tsx` - Add a test button/function to verify email sending (temporary for testing)

### Key Technologies:

- Next.js (App Router)
- TypeScript
- Resend SDK
- Email templating with React components (optional for this story)

### API Interactions / SDK Usage:

- Resend API for sending emails
- Environment variables for secure API key storage

### Data Structures:

- Email configuration interface
- Email template types

### Environment Variables:

- `RESEND_API_KEY` - API key for Resend service

### Coding Standards Notes:

- Follow TypeScript best practices for type safety
- Implement error handling for email sending failures
- Create reusable email helper functions
- Document the email sending process clearly
- Use environment variables for sensitive information

## Tasks / Subtasks

- [x] Create a Resend account at https://resend.com
- [x] Verify domain or email for sending
- [x] Generate a Resend API key
- [x] Install Resend SDK: `pnpm add resend`
- [x] Create .env.local file with RESEND_API_KEY
- [x] Update .env.example to include RESEND_API_KEY placeholder
- [x] Create Resend client configuration file
- [x] Implement basic email sending helper function
- [x] Create a simple test email template
- [x] Add a test function to verify email sending

## Testing Requirements

**Guidance:** Verify implementation against the ACs using the following tests.

### Unit Tests:

- Test email helper function with mocked Resend client

### Integration Tests:

- Test actual email sending using a test API key

### Manual Verification:

- Send a test email to verify the integration works end-to-end
- Confirm the email is received in the inbox
- Check that the email format and content are correct

## Story Wrap Up (Agent Populates After Execution)

**Agent Model Used:**
**Completion Notes:**
**Change Log:**

- Initial Draft
