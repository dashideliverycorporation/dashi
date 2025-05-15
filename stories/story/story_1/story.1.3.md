# Story 1.3: Admin Dashboard - Add & Link Restaurant and Restaurant User

Status: Draft

## Goal & C- [ ] Write tests for restaurant and user creation

- [ ] Write unit tests for restaurant creation tRPC procedure
  - [ ] Set up test file structure and test environment
  - [ ] Create mocks for Prisma client
  - [ ] Test successful restaurant creation with complete data
  - [ ] Test successful restaurant creation with minimal required data
  - [ ] Test error handling when database operations fail
  - [ ] Test validation for required fields (name, phone)
  - [ ] Test validation for field constraints (email format, name length)
- [ ] Write unit tests for user creation tRPC procedure
- [ ] Write tests for restaurant form validation using React Testing Library
- [ ] Write tests for user form validation using React Testing Library
- [ ] Create integration tests for the restaurant creation flow
- [ ] Create integration tests for the user creation flower Story:\*\* As an admin, I want to add restaurants and create associated user accounts so that restaurant owners can access the platform.

**Context:** This is the third story in Epic 1 (Authentication & User/Restaurant Admin Management). It focuses on implementing functionality for administrators to add new restaurants to the system and create associated user accounts with the Restaurant role. This is a critical feature for the onboarding process in the MVP.

## Detailed Requirements

- Create a database model for restaurants with required fields (name, description, contact info, service area)
- Establish a relationship between restaurants and users in the database schema
- Create a form for adding new restaurants with all required fields
- Implement tRPC procedure for saving restaurant data to the database
- Create a form for creating a new user account with the 'Restaurant' role linked to a specific restaurant
- Implement tRPC procedure for creating users with proper role assignment
- Add validation for all form inputs
- Add confirmation feedback after successful operations

## Acceptance Criteria (ACs)

- AC1: Database schema includes a Restaurant model with appropriate fields
- AC2: Database schema establishes a relationship between restaurants and users
- AC3: Admin can fill and submit a form to add a new restaurant
- AC4: Admin can create a new user account with 'Restaurant' role linked to a specific restaurant
- AC5: Restaurant data is saved correctly to the database
- AC6: User accounts are created with proper role and restaurant association
- AC7: Forms include validation for required fields with appropriate error messages
- AC8: Success confirmations are displayed after successful operations

## Technical Implementation Context

**Guidance:** Use the following details for implementation. Developer agent is expected to follow project standards and understand the project structure. Only story-specific details are included below.

### Relevant Files:

- **Files to Create/Modify:**
  - `prisma/schema.prisma` - Add Restaurant model and relations
  - `app/admin/restaurants/page.tsx` - Restaurant management page
  - `app/admin/restaurants/new/page.tsx` - Add new restaurant page
  - `app/admin/users/new/page.tsx` - Add new restaurant user page
  - `components/admin/RestaurantForm.tsx` - Form component for restaurant creation
  - `components/admin/UserForm.tsx` - Form component for user creation
  - `server/trpc/routers/restaurant.ts` - tRPC procedures for restaurant management
  - `server/trpc/routers/user.ts` - tRPC procedures for user management

### Key Technologies:

- Prisma for database schema and operations
- tRPC for type-safe procedure definitions
- Shadcn UI form components
- Zod for form validation
- React Hook Form for form state management
- Next.js App Router for routing

### API Interactions / SDK Usage:

- Prisma Client for database operations
- tRPC client for calling procedures
- Auth.js for user creation and roles

### UI/UX Notes:

- Forms should be clean, intuitive, and follow the Shadcn UI component patterns
- Include clear labels and helper text for form fields
- Show validation errors inline below the respective fields
- Display success messages after successful operations
- Include navigation to return to restaurant listing

### Data Structures:

- Restaurant model with name, description, contact info, and service area fields
- User model with role field and relation to Restaurant
- Form state for restaurant creation
- Form state for user creation

### Environment Variables:

- N/A for this story (using existing configuration)

### Coding Standards Notes:

- Use Zod for validation schemas that match Prisma models
- Properly handle async operations with loading states
- Implement proper error handling for database operations
- Follow the tRPC router pattern established in Epic 0
- Use React Hook Form with Zod resolver for form validation

## Tasks / Subtasks

- [x] Update Prisma schema to add Restaurant model
- [x] Add relation between User and Restaurant models
- [x] Run Prisma migration to update database schema
- [x] Create tRPC procedure for adding restaurants
- [x] Create tRPC procedure for creating restaurant users
- [x] Build restaurant creation form with Shadcn UI components
- [x] Build user creation form with restaurant selection
  - [x] Create getAllRestaurants query in restaurant router for dropdown
  - [x] Build UserForm component with form fields (name, email, password)
  - [x] Add restaurant selection dropdown to UserForm
  - [x] Create the users/new page component that uses UserForm
  - [x] Add navigation in admin UI to the user creation page
- [ ] Write tests for restaurant and user creation - [x] Write unit tests for restaurant creation tRPC procedure
  - [x] Set up test file structure and test environment
  - [x] Create mocks for Prisma client
  - [x] Test successful restaurant creation with complete data
  - [x] Test successful restaurant creation with minimal required data
  - [x] Test error handling when database operations fail
  - [ ] Write unit tests for user creation tRPC procedure
    - [x] Set up test file structure and test environment for user tests
    - [x] Create mocks for Prisma client (user and restaurant models)
    - [ ] Test successful user creation with complete data
    - [ ] Test successful user creation with minimal required data
    - [ ] Test error handling when database operations fail
    - [ ] Test validation for restaurant association (users with RESTAURANT_ADMIN role must have a restaurant)
    - [ ] Test validation for required fields (name, email, password, role)
    - [ ] Test validation for field constraints (email format, password strength)
  - [ ] Write tests for restaurant form validation using React Testing Library
  - [ ] Write tests for user form validation using React Testing Library
  - [ ] Create integration tests for the restaurant creation flow
  - [ ] Create integration tests for the user creation flow

## Testing Requirements

**Guidance:** Verify implementation against the ACs using the following tests.

### Unit Tests:

- Test restaurant creation tRPC procedure
- Test user creation tRPC procedure
- Test form validation logic for restaurant form
- Test form validation logic for user form

### Integration Tests:

- Test end-to-end restaurant creation flow
- Test end-to-end user creation flow with restaurant association
- Test form submission with valid and invalid data

### Manual/CLI Verification:

- Run `pnpm prisma migrate dev` to verify schema updates
- Use Prisma Studio to examine the new Restaurant model and relations
- Manually test restaurant creation form with valid and invalid data
- Manually test user creation form with valid and invalid data
- Verify created restaurants and users in the database

## Story Wrap Up (Agent Populates After Execution)

**Agent Model Used:**
**Completion Notes:**
**Change Log:**

- Initial Draft: Created story structure for restaurant and user management
