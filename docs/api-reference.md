# Dashi API Reference

## External APIs Consumed

### Resend Email API

- **Purpose:** Used for sending transactional emails for order notifications to restaurants
- **Base URL:** `https://api.resend.com`
- **Authentication:** API Key in Header (Header Name: `Authorization` with value `Bearer YOUR_API_KEY`)
- **Key Endpoints Used:**
  - **`POST /emails`:**
    - Description: Sends a transactional email
    - Request Body Schema:
      ```typescript
      interface SendEmailRequest {
        from: string;
        to: string | string[];
        subject: string;
        html?: string;
        text?: string;
        reply_to?: string;
        cc?: string | string[];
        bcc?: string | string[];
        attachments?: Array<{
          filename: string;
          content: string; // Base64 encoded
        }>;
      }
      ```
    - Example Request:
      ```typescript
      await resend.emails.send({
        from: "orders@dashi.com",
        to: "restaurant@example.com",
        subject: "New Order #1234",
        html: "<p>You have received a new order. Order details...</p>",
      });
      ```
    - Success Response Schema (Code: `200 OK`):
      ```typescript
      interface SendEmailResponse {
        id: string;
      }
      ```
    - Error Response Schema (Codes: `400`, `401`, `429`, `500`):
      ```typescript
      interface ErrorResponse {
        statusCode: number;
        message: string;
        name: string;
      }
      ```
- **Rate Limits:** 1000 emails per day on the free tier, higher limits on paid plans
- **Link to Official Docs:** https://resend.com/docs/api-reference/introduction

## Internal APIs Provided

### tRPC API

- **Purpose:** Provides type-safe API layer between frontend and backend
- **Base URL:** `/api/trpc` (Next.js API Route)
- **Authentication/Authorization:** Auth.js session-based authentication with role-based access control
- **Implementation:** Instead of traditional REST endpoints, Dashi uses tRPC procedures organized into routers:

#### Public Router

- **Purpose:** API procedures accessible without authentication
- **Key Procedures:**

  - **`getRestaurants`:**

    - Description: Retrieves list of all active restaurants
    - Input: None
    - Output: Array of restaurant summary objects
    - Example:

      ```typescript
      // Frontend
      const { data } = trpc.public.getRestaurants.useQuery();

      // Backend
      publicRouter.getRestaurants = t.procedure.query(async () => {
        return prisma.restaurant.findMany({
          where: { isDeleted: false },
          select: {
            id: true,
            name: true,
            description: true,
            // ...more fields
          },
        });
      });
      ```

  - **`getRestaurantMenu`:**
    - Description: Retrieves menu for a specific restaurant
    - Input: Restaurant ID or slug
    - Output: Restaurant details with menu items grouped by category
    - Example:

      ```typescript
      // Frontend
      const { data } = trpc.public.getRestaurantMenu.useQuery({
        restaurantId: "123",
      });

      // Backend
      publicRouter.getRestaurantMenu = t.procedure
        .input(
          z.object({
            restaurantId: z.string().optional(),
            restaurantSlug: z.string().optional(),
          })
        )
        .query(async ({ input }) => {
          // Implementation
        });
      ```

#### Customer Router

- **Purpose:** API procedures for authenticated customers
- **Key Procedures:**

  - **`placeOrder`:**

    - Description: Places a new food order
    - Input: Order details including restaurant ID, items, quantities, and notes
    - Output: Order confirmation details
    - Authorization: Requires authenticated customer
    - Example:

      ```typescript
      // Frontend
      const mutation = trpc.customer.placeOrder.useMutation();
      mutation.mutate({
        restaurantId: "123",
        items: [
          { menuItemId: "item1", quantity: 2 },
          { menuItemId: "item2", quantity: 1 },
        ],
        customerNotes: "Please deliver to back entrance",
      });

      // Backend
      customerRouter.placeOrder = t.procedure
        .input(
          z.object({
            restaurantId: z.string(),
            items: z.array(
              z.object({
                menuItemId: z.string(),
                quantity: z.number().int().positive(),
              })
            ),
            customerNotes: z.string().nullable(),
          })
        )
        .mutation(async ({ ctx, input }) => {
          // Validate customer is authenticated
          // Create order in database
          // Send notification email
          // Return order details
        });
      ```

  - **`getOrderHistory`:**
    - Description: Retrieves order history for current customer
    - Input: Optional filters
    - Output: Array of past orders with basic details
    - Authorization: Requires authenticated customer

#### Restaurant Router

- **Purpose:** API procedures for restaurant management
- **Key Procedures:**

  - **`getRestaurantOrders`:**

    - Description: Retrieves orders for the restaurant
    - Input: Optional filters (status, date range)
    - Output: Array of orders
    - Authorization: Requires authenticated restaurant user

  - **`updateOrderStatus`:**
    - Description: Updates the status of an order
    - Input: Order ID and new status
    - Output: Updated order details
    - Authorization: Requires authenticated restaurant user

#### Admin Router

- **Purpose:** API procedures for platform administration
- **Key Procedures:**

  - **`addRestaurant`:**

    - Description: Creates a new restaurant and assigns an owner
    - Input: Restaurant details and owner information
    - Output: Created restaurant details
    - Authorization: Requires authenticated admin user

  - **`getSalesData`:**
    - Description: Retrieves sales data across the platform
    - Input: Optional filters (date range, restaurant)
    - Output: Sales summary data
    - Authorization: Requires authenticated admin user

## External SDK Usage

### Prisma ORM

- **Purpose:** Type-safe database access for PostgreSQL
- **SDK Package:** `@prisma/client`
- **Key Operations Used:**
  - `findMany`: Retrieving multiple records matching criteria
  - `findUnique`: Retrieving a single record by unique identifier
  - `create`: Creating new records
  - `update`: Updating existing records
  - `transaction`: Performing multiple database operations atomically
- **Key Models:** User, Restaurant, MenuItem, Order, OrderItem

### Auth.js (NextAuth)

- **Purpose:** Authentication and session management
- **SDK Package:** `@auth/core`, `@auth/nextjs`
- **Key Operations Used:**
  - Session handling
  - User authentication with credentials provider
  - Role-based access control
  - Integration with Prisma for user storage

### Resend

- **Purpose:** Sending transactional emails for order notifications
- **SDK Package:** `resend`
- **Key Operations Used:**
  - `emails.send`: Sending emails with HTML/text content

## Change Log

| Change        | Date       | Version | Description                                 | Author         |
| ------------- | ---------- | ------- | ------------------------------------------- | -------------- |
| Initial draft | 2025-05-05 | 0.1     | Initial API reference based on architecture | GitHub Copilot |

<!-- Generated by Copilot -->
