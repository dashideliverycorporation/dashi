# Story 3.4: Restaurant Dashboard - Edit Menu Item

Status: In-Progress

## Goal & Context

**User Story:** As a restaurant user, I want to edit existing menu items so that I can keep my menu information accurate and up to date.

**Context:** This is the fourth story in Epic 3 (Restaurant Menu Management). Building on the menu item listing view created in story 3.2 and the add functionality from story 3.3, this story focuses on implementing functionality to edit existing menu items. Restaurant users will be able to select an existing menu item, modify its details through a form, and save the changes to the database.

## Detailed Requirements

- Implement an "Edit" action for each menu item in the menu management listing
- When editing, populate a form with the current menu item data:
  - Name (required)
  - Description (optional)
  - Category (required)
  - Price (required, must be a positive number)
  - Image URL (required) - for displaying the menu item image
  - Availability status (boolean)
- Validate input data using Zod schema
- Create a protected tRPC procedure to update the existing menu item
- Ensure only the restaurant owner can edit their own menu items
- Show appropriate loading and success states during submission
- Display validation errors in the form
- After successful update, redirect back to the menu items list or show updated data
- Ensure the form and procedure are only accessible to users with the Restaurant role

## Acceptance Criteria (ACs)

- AC1: Each menu item in the listing has an "Edit" button or action
- AC2: Clicking "Edit" navigates to an edit form pre-populated with the item's current data
- AC3: Form validates input data and displays appropriate error messages for invalid inputs
- AC4: Form submission is processed via a protected tRPC procedure
- AC5: Updated menu items are saved to the database
- AC6: After successful update, the menu items list reflects the changes
- AC7: Loading states are shown during form submission
- AC8: Success notification is displayed after successful update
- AC9: Only the owner restaurant can edit their own menu items
- AC10: Only users with the Restaurant role can access this functionality

## Technical Implementation Context

**Guidance:** Use the following details for implementation. Developer agent is expected to follow project standards and understand the project structure. Only story-specific details are included below.

### Relevant Files:

- **Files to Create/Modify:**
  - `app/restaurant/menu/edit/[id]/page.tsx` - Page for editing an existing menu item
  - `restaurant/components/menu/MenuItemForm.tsx` - Reuse and enhance form component from story 3.3
  - `server/trpc/routers/restaurant.ts` - Add tRPC procedure for updating menu items
  - `server/schemas/menuItem.ts` - Reuse Zod schema for menu item validation

### Key Technologies:

- Next.js App Router for routing and dynamic route parameters
- tRPC for API procedures
- Prisma for database access
- Shadcn UI components for UI, including form components
- Zod for input validation
- React Hook Form for form handling
- Tailwind CSS for styling

### API Interactions / SDK Usage:

- tRPC procedure for fetching a single menu item details
- tRPC procedure for updating menu items
- Auth.js for session verification and restaurant ID retrieval
- Prisma client for database access

### UI/UX Notes:

- Follow the DoorDash-inspired orange theme
- Use Shadcn UI form components with appropriate validation styling
- Ensure form is responsive and works on different screen sizes
- Show clear validation errors for each field
- Implement loading state during form submission
- Display success notification after successful update
- Provide a way to return to menu listing page or cancel the edit
- Reuse the MenuItemForm component from story 3.3 with enhancements for edit mode

### Data Structures:

- Menu Item update input:

  ```typescript
  interface UpdateMenuItemInput {
    id: string;
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
  const updateMenuItemSchema = z.object({
    id: z.string().min(1, "Item ID is required"),
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

- Reuse the MenuItemForm component from story 3.3 to maintain consistency
- Separate data fetching logic from presentation components
- Use proper TypeScript typing for all components and data
- Implement client-side validation using Zod schemas
- Follow established patterns for tRPC procedure implementation
- Use proper error handling for form submission and data fetching
- Follow React best practices for form state management
- Implement proper authorization checks to ensure restaurants can only edit their own menu items

## Tasks / Subtasks

- [ ] Add "Edit" action to each menu item in the menu listing page
- [ ] Create menu item edit page route at `/restaurant/menu/edit/[id]`
- [ ] Implement tRPC procedure to fetch a single menu item by ID
- [ ] Enhance MenuItemForm component to support edit mode
- [ ] Pre-populate form fields with existing menu item data
- [ ] Implement client-side form validation using Zod and React Hook Form
- [ ] Create Zod schema for menu item update validation
- [ ] Implement tRPC procedure for updating menu items
- [ ] Add restaurant ownership verification to ensure only owners can edit their items
- [ ] Implement form submission and error handling
- [ ] Add loading state during form submission and data fetching
- [ ] Add success notification after successful update
- [ ] Implement redirect back to menu list after successful update
- [ ] Style the form using Shadcn UI components and the design system
- [ ] Ensure the form is responsive for different screen sizes
- [ ] Write tests for the edit functionality and tRPC procedures

## Testing Requirements

**Guidance:** Verify implementation against the ACs using the following tests.

### Unit Tests:

- Test MenuItemForm component rendering in edit mode
- Test form validation with valid and invalid inputs
- Test tRPC procedure for fetching a single menu item
- Test tRPC procedure for updating menu items
- Test Zod schema validation for updates

### Integration Tests:

- Test edit form pre-population with existing menu item data
- Test form submission flow from UI to database
- Test authorization checks for restaurant ownership
- Test protected route access for restaurant users vs non-restaurant users
- Test menu item update and database persistence

### Manual/CLI Verification:

- Log in with a restaurant user and navigate to the menu management section
- Click edit on an existing menu item and verify the form is pre-populated with current data
- Edit the menu item with valid inputs and verify the changes are saved
- Attempt to edit a menu item with invalid inputs and verify validation errors
- Verify that the form is responsive and displays appropriately on different screen sizes
- Verify loading states during form submission
- Verify success notification after successful update
- Verify that another restaurant user cannot edit menu items they don't own

## Story Wrap Up (Agent Populates After Execution)

**Agent Model Used:**
**Completion Notes:**

**Change Log:**

- Initial Draft: Created story structure for Restaurant Dashboard - Edit Menu Item
