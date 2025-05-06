# Dashi Product Requirements Document (PRD)

## Status: Draft

## Intro

This document outlines the requirements for the Minimum Viable Product (MVP) of the **Dashi** platform. The core problem addressed is the significant lack of accessible and affordable digital infrastructure for local restaurants in Goma, DRC, which limits their online presence and ability to offer food delivery. Consequently, customers face inconvenience due to limited access to menus and cumbersome ordering methods.

The **Dashi** MVP aims to validate the market need for an online food ordering platform in Goma by providing a simple, accessible web-based solution. It will connect local restaurants with customers, initially focusing on core ordering functionality and manual processes for payments and delivery, with a goal to inform future development based on real-world usage and feedback.

## Goals and Context

The primary goals for the **Dashi** MVP, as outlined in the project brief, are:

- **Onboard Restaurants:** Successfully partner with and onboard at least 10 local restaurants onto the platform.
- **Drive Order Volume:** Facilitate a total of at least 1,000 orders per month across all participating restaurants within the MVP validation period.
- **Validate Market Need:** Confirm the core assumptions that (a) Local restaurants are seeking an affordable online solution, and (b) Customers in the target area are willing to adopt online ordering.
- **Inform Future Development:** Gather essential data, user feedback, and operational insights from the web MVP to prioritize and guide the development of future features (e.g., native mobile apps, integrated payments, delivery logistics).

**Audience:**

- **Customers:** Primarily tech-savvy students, young professionals, and expatriates in Goma seeking convenient access to local food delivery.
- **Restaurants:** "Normal" local eateries specializing in popular, accessible cuisines (pizza, burgers, chips, rice) currently relying on traditional ordering methods and lacking digital infrastructure. Excludes upscale/hotel restaurants.

**Success Criteria & KPIs:**

- Number of restaurants successfully onboarded onto the platform.
- Total number of orders placed through the platform monthly.
- Completion rate of orders placed.
- Qualitative feedback gathered from both restaurants and customers regarding usability and value.

## Scope and Requirements (MVP / Current Version)

### Functional Requirements

The **Dashi** platform must support the following core functions:

1. **Restaurant Onboarding (Manual/Admin):**
   - An administrator must be able to create and manage restaurant profiles, including name, description, contact information, and potentially a service area description (text only).
   - An administrator must be able to create user accounts linked to each restaurant for management access.
2. **Restaurant Menu Management (Basic):**
   - Restaurant users (or admin on their behalf) must be able to add, edit, and remove menu items.
   - Each menu item must include a name, description, category (basic categorization), and price.
   - Restaurant users must be able to mark menu items as available or unavailable.
3. **Customer Account Creation/Login:**
   - Customers must be able to create a personal account using email/password.
   - Customers must be able to log in to their existing accounts.
4. **Restaurant Listing & Browse:**
   - Customers must be able to view a list of available restaurants on the platform's homepage or a dedicated page.
   - Each listing should show essential information like the restaurant name.
5. **Restaurant Menu Viewing:**
   - Customers must be able to click on a restaurant listing to view its full menu, including categories, item names, descriptions, and prices.
6. **Add Items to Cart:**
   - Customers must be able to select menu items from a restaurant's menu and add them to a shopping cart associated with that specific restaurant.
7. **Shopping Cart Review & Editing:**
   - Customers must be able to view the contents of their shopping cart, showing selected items, quantities, and subtotal.
   - Customers must be able to adjust the quantity of items or remove items from the cart.
8. **Order Placement:**
   - Customers must be able to proceed from the cart to a simple order placement process.
   - Customers must provide necessary order details (e.g., delivery address/notes - free text field).
   - Customers must confirm the order based on the cart contents and total price.
   - The system must record the order details, including customer information, restaurant, items ordered, quantities, prices, and the total amount.
9. **Order Notification to Restaurant:**
   - Upon a new order being placed by a customer, the platform must immediately make the order visible in a dedicated section of the restaurant's dashboard view.
   - Simultaneously, an email notification containing the essential order details (order ID, items, customer notes, total amount) must be sent to the restaurant's registered email address.
10. **Basic Order Details View (Restaurant):**
    - Restaurant users must have a simple interface (dashboard view) to see a list of incoming and current orders.
    - Restaurant users must be able to click on an order to view its full details (customer notes, items, quantities, total).
11. **Basic Order Status Update (Manual by Restaurant):**
    - On the order details view, restaurant users must be able to manually update the status of an order.
    - The required statuses for MVP are: "New", "Preparing", and "Ready for Pickup/Delivery". A simple button or dropdown interface should be provided for this.
12. **Order History (Customer):**
    - Logged-in customers must be able to view a list of their past orders, including basic details like the restaurant, date, and total amount. Clicking on a past order should show the items ordered.
13. **Basic Sales Tracking (Admin View):**
    - An administrator must have a simple view to track the total sales volume generated through the platform for each restaurant. This view should support calculating the weekly commission manually (the platform only needs to provide the total sales value).
14. **Static Pages:**
    - The platform must include basic static pages: "About Us", "Contact", and "How it Works" (potentially separate versions for Customers and Restaurants).
15. **Multiple Languages:**
    - The platform interface must support rendering content in both English and French. The user should be able to select their preferred language.

### Non-Functional Requirements

- **Performance:** The platform should load within a reasonable time frame (e.g., under 3 seconds) and feel responsive during navigation and interactions for typical internet speeds in the target area.
- **Scalability:** While the MVP is not built for massive scale, the chosen technology stack (Next.js, PostgreSQL, Vercel) should allow for scaling in the future. Initial deployment will not require advanced scaling solutions.
- **Reliability/Availability:** The order notification system (Dashboard + Email) must be reasonably reliable to ensure restaurants receive timely alerts.
- **Security:** Implement basic security measures, including secure password storage, input validation to prevent common web vulnerabilities (like SQL injection, although less relevant with an ORM/ODM), and securing API endpoints. Data transmitted should use HTTPS. Access control should ensure customers can only see their own orders and restaurants only their own relevant data.
- **Maintainability:** Code should follow best practices for readability and reusability, with appropriate comments and documentation for future maintenance.
- **Usability/Accessibility:** The interface for both customers and restaurants should be intuitive and easy to navigate, consistent with the UI/UX goals. This is particularly important for restaurants adopting a digital tool for the first time.
- **Other Constraints:** The web application must be responsive and usable across different device sizes (desktop, tablet, mobile) to cater to the target audience's likely device usage.

### User Experience (UX) Requirements

- The overall look and feel should be **modern and simple**, emulating the style of **DoorDash**, particularly using an **orange color theme**.
- The customer experience should feel like a **Single-Page Application (SPA)**, minimizing full page reloads.
- The UI components should be built using **Shadcn UI** to ensure consistency and accelerate development.
- Navigation between restaurant listings, menus, and the cart should be clear and intuitive.
- The order placement process should be straightforward with minimal steps.
- The restaurant dashboard for viewing and updating orders should be simple and clear.

### Integration Requirements

- **Email Service:** Integration with an external email sending service (e.g., SendGrid, Mailgun, or a simpler transactional email provider) is required for sending order notifications to restaurants.

## Epic Overview (MVP / Current Version)

Development will be test-driven, ensuring tests pass for each completed story.

### Epic 0: Initial Manual Set Up or Provisioning

- **Story 0.1: Project Initialization**
- **Story 0.2: Database Setup (PostgreSQL)**
- **Story 0.3: Hosting Setup (Vercel)**
- **Story 0.4: UI Library Setup (Shadcn UI)**
- **Story 0.5: Testing Framework Setup**

### Epic 1: Core Platform Setup & Restaurant Onboarding (Admin Focus)

- **Story 1.1: Basic Authentication Setup**
- **Story 1.2: Admin Dashboard - Restaurant Management View**
- **Story 1.3: Restaurant Dashboard - Basic Setup**

### Epic 2: Restaurant Menu Management (Basic)

- **Story 2.1: Restaurant Dashboard - Menu Item Listing**
- **Story 2.2: Restaurant Dashboard - Add New Menu Item**
- **Story 2.3: Restaurant Dashboard - Edit Menu Item**
- **Story 2.4: Restaurant Dashboard - Toggle Menu Item Availability**
- **Story 2.5: Restaurant Dashboard - Delete Menu Item**

### Epic 3: Customer Facing - Browse & Cart

- **Story 3.1: Homepage - Restaurant Listing**
- **Story 3.2: Restaurant Menu Page**
- **Story 3.3: Add Item to Cart (Frontend Logic)**
- **Story 3.4: Cart View and Editing (Frontend)**

### Epic 4: Customer Facing - Ordering & History

- **Story 4.1: Customer Registration Page**
- **Story 4.2: Customer Login Page**
- **Story 4.3: Checkout/Order Placement Page**
- **Story 4.4: Place Order (Backend API)**
- **Story 4.5: Order Confirmation Page/View**
- **Story 4.6: Customer Order History Page**

### Epic 5: Restaurant Order Management & Admin Sales Tracking

- **Story 5.1: Restaurant Dashboard - Incoming Order List & Notification**
- **Story 5.2: Restaurant Dashboard - Order Details View**
- **Story 5.3: Restaurant Dashboard - Update Order Status**
- **Story 5.4: Admin Dashboard - Basic Sales View**

## Key Reference Documents

- docs/project-brief.md
- docs/architecture.md
- docs/testing-strategy.md
- docs/ui-ux-spec.md

## Post-MVP / Future Enhancements

- Integrated Online Payment Processing
- Delivery Logistics & Tracking
- Customer Reviews & Ratings
- Promotions & Discounts Engine
- Advanced Menu Customization (e.g., item options, modifiers)
- Real-time Chat Support
- Sophisticated Analytics Dashboards for Restaurants
- More Granular User Roles & Permissions
- Push Notifications (Web and potentially Mobile)
- Complex Search and Filtering (e.g., by cuisine type)
- Platform-Managed Refunds and Cancellations

## Technology Stack

| Technology             | Version               | Description                                                    |
| ---------------------- | --------------------- | -------------------------------------------------------------- |
| **Frontend & Backend** | Next.js (latest)      | React framework for building the user interface and API routes |
| **UI Library**         | Shadcn UI             | Re-usable UI components based on Radix UI and Tailwind CSS     |
| **Database**           | PostgreSQL            | Relational database for structured data storage                |
| **Database ORM/QB**    | Prisma (latest)       | Database toolkit for schema modeling, migrations, and querying |
| **Hosting**            | Vercel                | Platform for hosting Next.js applications                      |
| **Authentication**     | (To be decided)       | Library like NextAuth.js or custom implementation              |
| **Testing Frameworks** | Jest (latest)         | JavaScript testing framework                                   |
| **Testing Libraries**  | React Testing Library | For testing React components                                   |
| **Integration**        | (To be decided)       | Email sending service API/SDK                                  |

## Unknowns, Assumptions, and Risks

**Unknowns:**

- Specific visual design details (beyond DoorDash-like theme and orange color) and exact layouts.
- Detailed database schema structure (to be finalized during technical design).
- Specific third-party service provider for sending emails.
- The exact step-by-step workflow for the manual restaurant onboarding process led by the administrator.

**Assumptions:**

- Both customers and restaurants in Goma have access to devices (smartphones, computers) with internet connectivity.
- Restaurants have access to email or can reliably keep a web browser window open to monitor the dashboard for new orders.
- Restaurants are capable of managing their own food preparation workflow based on online orders.
- Restaurants will handle their own delivery logistics or customer pickup, as the platform does not provide this in the MVP.
- The process for collecting the 10% commission from restaurants is a manual, offline process outside of the platform's transaction flow in the MVP.
- Basic email infrastructure and delivery are sufficiently reliable in Goma for order notifications.

**Risks:**

- **Risk:** Unreliable order notifications (email not received, dashboard not monitored) leading to missed orders and restaurant/customer dissatisfaction.
  - _Mitigation:_ Emphasize the dashboard view as the primary real-time source and email as a fallback. Clearly communicate to restaurants how they _must_ monitor orders. Potentially explore SMS as a future, more reliable notification if budget allows.
- **Risk:** Data integrity issues due to manual order status updates by restaurants.
  - _Mitigation:_ Implement clear UI and validation on status updates. Ensure proper logging of status changes.
- **Risk:** Low adoption rate by target restaurants who may find _any_ digital tool challenging, despite the "simple" goal.
  - _Mitigation:_ Provide simple, clear instructions/training for restaurants. Keep the restaurant interface exceptionally intuitive.
- **Risk:** Technical challenges for the junior development team and AI agents in implementing the chosen stack (Next.js API routes, Prisma, PostgreSQL, Shadcn UI) effectively for the first time.
  - _Mitigation:_ Break down tasks into very small, clear stories. Provide access to documentation and tutorials. Prioritize clear code and testing. Ensure code reviews are performed if possible. Leverage AI tools carefully for code generation and explanation, verifying outputs.
- **Risk:** Security vulnerabilities due to inexperience with web security best practices.
  - _Mitigation:_ Prioritize learning and implementing standard security practices (input validation, secure auth, protecting API keys/secrets). Use established libraries where possible (like NextAuth). Plan for security review if resources permit post-MVP.

## Change Log

| Change              | Date       | Version | Description                     | Author         |
| ------------------- | ---------- | ------- | ------------------------------- | -------------- |
| Initial draft       | 2025-05-05 | 0.1     | Initial draft of PRD            | GitHub Copilot |
| Project Name Update | 2025-05-05 | 0.2     | Changed project name to "Dashi" | GitHub Copilot |
