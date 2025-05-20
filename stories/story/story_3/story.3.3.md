# Story 3.3: Restaurant Dashboard - Add New Menu Item

Status: In-Progress

## Goal & Context

**User Story:** As a restaurant user, I want to add new menu items to my restaurant's offerings so that I can keep my menu up to date.

**Context:** This is the third story in Epic 3 (Restaurant Menu Management). Building on the menu item listing view created in story 3.2, this story focuses on implementing functionality to add new menu items. Restaurant users will be able to submit a form with menu item details, which will be validated and stored in the database.

## Detailed Requirements

- Create a "Add New Menu Item" button in the menu management section
- Implement a form to collect menu item details:
  - Name (required)
  - Description (optional)
  - Category (required)
  - Price (required, must be a positive number)
  - Image URL (required) - for displaying the menu item image
  - Initial Availability (boolean, defaulted to available)
- Validate input data using Zod schema
- Create a protected tRPC procedure to save the new menu item
- Link the new menu item to the logged-in restaurant
- Show appropriate loading and success states during submission
- Display validation errors in the form
- After successful creation, redirect or update the menu items list
- Ensure the form and procedure are only accessible to users with the Restaurant role

## Acceptance Criteria (ACs)

- AC1: A "Add New Menu Item" button exists on the menu management page
- AC2: Clicking the button opens a form with fields for name, description, category, price, image URL, and availability
- AC3: Form validates input data and displays appropriate error messages for invalid inputs
- AC4: Form submission is processed via a protected tRPC procedure
- AC5: New menu items are saved to the database and linked to the restaurant
- AC6: After successful creation, the menu items list is updated to include the new item
- AC7: Loading states are shown during form submission
- AC8: Success notification is displayed after successful creation
- AC9: Only users with the Restaurant role can access this functionality

## Technical Implementation Context

**Guidance:** Use the following details for implementation. Developer agent is expected to follow project standards and understand the project structure. Only story-specific details are included below.

### Relevant Files:

- **Files to Create/Modify:**
  - `app/restaurant/menu/add/page.tsx` - Page for adding a new menu item
  - `restaurant/components/menu/MenuItemForm.tsx` - Form component for menu item details
  - `server/trpc/routers/restaurant.ts` - Add tRPC procedure for creating menu items
  - `server/schemas/menuItem.ts` - Zod schema for menu item validation

### Key Technologies:

- Next.js App Router for routing
- tRPC for API procedures
- Prisma for database access
- Shadcn UI components for UI, including form components
- Zod for input validation
- React Hook Form for form handling
- Tailwind CSS for styling

### API Interactions / SDK Usage:

- tRPC procedure for creating menu items
- Auth.js for session verification and restaurant ID retrieval
- Prisma client for database access

### UI/UX Notes:

- Follow the DoorDash-inspired orange theme
- Use Shadcn UI form components with appropriate validation styling
- Ensure form is responsive and works on different screen sizes
- Show clear validation errors for each field
- Implement loading state during form submission
- Display success notification after successful creation
- Provide a way to return to menu listing page

### Data Structures:

- Menu Item creation input:

  ```typescript
  interface CreateMenuItemInput {
    name: string;
    description?: string; // Optional description
    price: number;
    category: string;
    imageUrl: string; // Required image URL
    available: boolean;
  }
  ```

- Zod schema structure:
  ```typescript
  const createMenuItemSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    price: z.number().positive("Price must be positive"),
    category: z.string().min(1, "Category is required"),
    imageUrl: z
      .string()
      .url("Must be a valid URL")
      .min(1, "Image URL is required"),
    available: z.boolean().default(true),
  });
  ```

### Environment Variables:

- N/A for this story (using existing configurations)

### Coding Standards Notes:

- Separate form component from page component
- Use proper TypeScript typing for all components and data
- Implement client-side validation using Zod schemas
- Create reusable form components when possible
- Follow established patterns for tRPC procedure implementation
- Use proper error handling for form submission
- Follow React best practices for form state management

## Tasks / Subtasks

- [x] Create "Add New Menu Item" button in the menu management page
- [x] Create menu item add page route at `/restaurant/menu/add`
- [x] Create MenuItemForm component with required fields
- [x] Implement tRPC procedure for creating menu items
- [ ] Implement form submission and error handling
- [ ] Add loading state during form submission
- [ ] Add success notification after successful creation
- [ ] Implement redirect or menu list update after successful creation
- [ ] Style the form using Shadcn UI components and the design system
- [ ] Ensure the form is responsive for different screen sizes
- [ ] Write tests for the form components and tRPC procedure

## Testing Requirements

**Guidance:** Verify implementation against the ACs using the following tests.

### Unit Tests:

- Test MenuItemForm component rendering
- Test form validation with valid and invalid inputs
- Test tRPC procedure for creating menu items
- Test Zod schema validation

### Integration Tests:

- Test form submission flow from UI to database
- Test protected route access for restaurant users vs non-restaurant users
- Test menu item creation and database persistence

### Manual/CLI Verification:

- Log in with a restaurant user and navigate to the menu management section
- Create a new menu item with valid inputs and verify it appears in the menu list
- Attempt to create a menu item with invalid inputs and verify validation errors
- Verify that the form is responsive and displays appropriately on different screen sizes
- Verify loading states during form submission
- Verify success notification after successful creation
- Verify that the new menu item is properly associated with the restaurant

## Story Wrap Up (Agent Populates After Execution)

**Agent Model Used:**
**Completion Notes:**

**Change Log:**

- Initial Draft: Created story structure for Restaurant Dashboard - Add New Menu Item
