# Story 3.5: Restaurant Dashboard - Toggle Availability & Soft Delete

Status: In-Progress

## Goal & Context

**User Story:** As a restaurant user, I want to quickly toggle menu items' availability status and remove items I no longer offer, so that I can efficiently manage my active menu selection.

**Context:** This is the fifth story in Epic 3 (Restaurant Menu Management). Building on the menu item listing (story 3.2), add (story 3.3), and edit (story 3.4) functionality, this story focuses on implementing quick status changes and item removal. The availability toggle allows restaurants to temporarily hide items without deleting them, while the soft delete enables removing items from the menu while preserving their data in the database.

## Detailed Requirements

- Add a toggle or switch control for each menu item in the listing to change availability status
- Implement immediate status change without needing to navigate to an edit form
- Add a delete button/action for each menu item in the listing
- Implement a confirmation dialog before deleting a menu item
- Create protected tRPC procedures to:
  - Toggle an item's availability status
  - Soft-delete a menu item (mark as deleted in database)
- Update the menu listing to hide soft-deleted items by default
- Ensure only the restaurant owner can modify availability or delete their own menu items
- Show appropriate loading, success, and error states during these operations
- Ensure all UI updates immediately reflect the changed item status

## Acceptance Criteria (ACs)

- AC1: Each menu item in the listing has a toggle/switch control for availability status
- AC2: The availability toggle immediately updates the item status without page navigation
- AC3: Each menu item has a delete action with confirmation dialog
- AC4: Status changes are processed via protected tRPC procedures
- AC5: Deleted items are soft-deleted (marked as deleted in database, not permanently removed)
- AC6: Soft-deleted items do not appear in the default menu listing
- AC7: Only the owner restaurant can modify availability or delete their own menu items
- AC8: Loading states are shown during status change operations
- AC9: Success notifications are displayed after successful status changes
- AC10: The UI immediately reflects status changes without requiring page refresh

## Technical Implementation Context

**Guidance:** Use the following details for implementation. Developer agent is expected to follow project standards and understand the project structure. Only story-specific details are included below.

### Relevant Files:

- **Files to Create/Modify:**
  - `app/restaurant/menu/page.tsx` - Update menu listing to include status toggle and delete actions
  - `restaurant/components/menu/DeleteConfirmationDialog.tsx` - Create confirmation dialog component
  - `server/trpc/routers/restaurant.ts` - Add tRPC procedures for toggling availability and soft-deleting
  - `server/schemas/menuItem.ts` - Update schemas if needed for these operations

### Key Technologies:

- Next.js App Router for routing
- tRPC for API procedures
- Prisma for database access
- Shadcn UI components for UI, including Switch and Dialog components
- Tailwind CSS for styling
- React server components and client components where appropriate

### API Interactions / SDK Usage:

- tRPC procedure for toggling menu item availability
- tRPC procedure for soft-deleting menu items
- Auth.js for session verification and restaurant ID retrieval
- Prisma client for database access

### UI/UX Notes:

- Follow the DoorDash-inspired orange theme
- Use Shadcn UI Switch component for the availability toggle
- Use Shadcn UI Dialog component for delete confirmation
- Implement optimistic UI updates for immediate feedback
- Show clear loading states during operations
- Display concise success notifications
- Ensure delete action is visually distinct (e.g., red button) to indicate destructive action
- Consider adding a visual indicator for unavailable items in the list

### Data Structures:

- Menu Item update for availability toggle:

  ```typescript
  interface ToggleMenuItemAvailabilityInput {
    id: string;
    available: boolean;
  }
  ```

- Menu Item soft delete input:

  ```typescript
  interface SoftDeleteMenuItemInput {
    id: string;
  }
  ```

- In the database schema, menu items should have:
  ```
  - available: boolean
  - deleted: boolean (or deletedAt: DateTime | null)
  ```

### Environment Variables:

- N/A for this story (using existing configurations)

### Coding Standards Notes:

- Use client components for interactive elements like toggles and confirmation dialogs
- Implement optimistic updates for better UX
- Separate data mutation logic from presentation components
- Use proper TypeScript typing for all components and data
- Follow established patterns for tRPC procedure implementation
- Use proper error handling and rollback for failed operations
- Implement proper authorization checks to ensure restaurants can only modify their own menu items

## Tasks / Subtasks

- [ ] Add availability toggle/switch to each menu item in the listing
- [ ] Create MenuItemActions component to house toggle and delete controls
- [ ] Create DeleteConfirmationDialog component for delete action
- [ ] Implement client-side toggle functionality with optimistic updates
- [ ] Implement delete action with confirmation flow
- [ ] Update Prisma schema if needed to support soft delete (e.g., add deleted field)
- [ ] Create tRPC procedure for toggling menu item availability
- [ ] Create tRPC procedure for soft-deleting menu items
- [ ] Add restaurant ownership verification for both procedures
- [ ] Implement filtering to hide soft-deleted items from the default menu listing
- [ ] Add loading states for toggle and delete operations
- [ ] Add success notifications for successful operations
- [ ] Add error handling and recovery for failed operations
- [ ] Style the toggle and delete components using Shadcn UI and the design system
- [ ] Ensure all components are responsive for different screen sizes
- [ ] Write tests for the toggle, delete functionality, and tRPC procedures

## Testing Requirements

**Guidance:** Verify implementation against the ACs using the following tests.

### Unit Tests:

- Test MenuItemActions component rendering
- Test DeleteConfirmationDialog component rendering and interactions
- Test tRPC procedure for toggling availability
- Test tRPC procedure for soft-deleting menu items
- Test optimistic UI update functionality

### Integration Tests:

- Test toggle availability flow from UI to database and back
- Test delete flow from UI to database
- Test authorization checks for restaurant ownership
- Test soft-deleted items being properly filtered from listing
- Test error handling and recovery for failed operations

### Manual/CLI Verification:

- Log in with a restaurant user and navigate to the menu management section
- Toggle the availability of a menu item and verify the change is immediate and persists
- Delete a menu item and verify it no longer appears in the listing
- Verify that soft-deleted items are not permanently removed from the database
- Verify loading states during toggle and delete operations
- Verify success notifications after successful operations
- Verify that another restaurant user cannot modify items they don't own
- Verify the UI is responsive and displays appropriately on different screen sizes

## Story Wrap Up (Agent Populates After Execution)

**Agent Model Used:**
**Completion Notes:**

**Change Log:**

- Initial Draft: Created story structure for Restaurant Dashboard - Toggle Availability & Soft Delete
