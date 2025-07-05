# Story 6.6: Order Notification System - Email and WhatsApp

Status: Draft

## Goal & Context

**User Story:** As a restaurant owner, I want to receive immediate notifications via email and WhatsApp when a customer places an order so that I can quickly start preparing the order and maintain good customer service.

**Context:** This is the sixth story in Epic 6 (Restaurant Order Management & Admin Sales Tracking). It focuses on implementing a comprehensive notification system that sends alerts to restaurants through multiple channels (email and WhatsApp) when new orders are placed. This ensures restaurants are immediately aware of new orders even if they're not actively monitoring the dashboard.

## Detailed Requirements

- Implement email notifications using Nodemailer when new orders are placed
- Integrate WhatsApp Business API for instant messaging notifications
- Create a notification service that triggers when orders are created
- Design professional email templates for order notifications
- Format WhatsApp messages with essential order information
- Include order details, customer information, and restaurant-specific data in notifications
- Implement retry logic for failed notification attempts
- Add configuration options for restaurants to enable/disable notification types
- Store notification logs for tracking delivery status
- Ensure notifications are sent asynchronously to avoid blocking order placement
- Handle notification failures gracefully without affecting order processing
- Support multiple notification channels with fallback mechanisms
- Ensure all notification content supports localization (English and French)

## Acceptance Criteria (ACs)

- AC1: Restaurants receive email notifications immediately when new orders are placed
- AC2: Restaurants receive WhatsApp notifications for new orders (if configured)
- AC3: Email notifications contain all essential order information (items, customer details, total)
- AC4: WhatsApp messages are concise but include key order details
- AC5: Notifications are sent asynchronously without delaying order placement
- AC6: Failed notifications are retried with exponential backoff
- AC7: Restaurant owners can configure their notification preferences (email/WhatsApp on/off)
- AC8: Notification delivery status is logged for monitoring purposes
- AC9: Email templates are professional and branded with Dashi styling
- AC10: WhatsApp messages include order ID and direct link to order details
- AC11: All notification content supports localization
- AC12: System gracefully handles notification failures without affecting core functionality
- AC13: Notification preferences are persisted in the database
- AC14: Admin users can view notification logs and delivery statistics

## Technical Implementation Context

**Guidance:** Use the following details for implementation. Developer agent is expected to follow project standards and understand the project structure. Only story-specific details are included below.

### Relevant Files:

- **Files to Create/Modify:**
  - `lib/notifications/email.ts` - Email notification service using Nodemailer
  - `lib/notifications/whatsapp.ts` - WhatsApp API integration service
  - `lib/notifications/notification-service.ts` - Main notification orchestration service
  - `lib/notifications/templates/order-email.tsx` - React email template for orders
  - `lib/notifications/queue.ts` - Background job queue for notifications
  - `server/trpc/routers/notifications.ts` - tRPC procedures for notification management
  - `server/schemas/notifications.ts` - Validation schemas for notification data
  - `components/restaurant/NotificationSettings.tsx` - Restaurant notification preferences UI
  - `app/restaurant/settings/page.tsx` - Restaurant settings page including notifications
  - `prisma/schema.prisma` - Add notification preferences and logs models
  - `app/api/webhooks/order-created.ts` - Webhook handler for triggering notifications

### Key Technologies:

- Nodemailer for email sending
- WhatsApp Business API (or Twilio WhatsApp API)
- React Email for email template rendering
- Background job processing (using Bull Queue or similar)
- Redis for queue management (optional, can use in-memory for MVP)
- Prisma for storing notification preferences and logs
- tRPC for API procedures
- Next.js API routes for webhooks

### API Interactions / SDK Usage:

- Nodemailer SMTP configuration for email sending
- WhatsApp Business API or Twilio WhatsApp API
- React Email for server-side email template rendering
- Background job queue for asynchronous processing
- Database operations for logging and preferences

### UI/UX Notes:

- Create a clean settings interface for notification preferences
- Use toggle switches for enabling/disabling notification types
- Display notification status indicators (email verified, WhatsApp connected)
- Show recent notification logs with delivery status
- Use appropriate icons for different notification types
- Provide clear feedback when settings are saved
- Include help text explaining each notification option
- Design professional email templates with Dashi branding
- Ensure email templates are mobile-responsive

### Data Structures:

- Notification preferences model:
  ```typescript
  interface NotificationPreferences {
    id: string;
    restaurantId: string;
    emailEnabled: boolean;
    emailAddress: string;
    whatsappEnabled: boolean;
    whatsappNumber: string;
    createdAt: Date;
    updatedAt: Date;
  }
  ```

- Notification log model:
  ```typescript
  interface NotificationLog {
    id: string;
    orderId: string;
    restaurantId: string;
    type: 'EMAIL' | 'WHATSAPP';
    status: 'PENDING' | 'SENT' | 'FAILED' | 'RETRY';
    recipient: string;
    content: string;
    errorMessage?: string;
    sentAt?: Date;
    createdAt: Date;
  }
  ```

- Order notification data:
  ```typescript
  interface OrderNotificationData {
    orderId: string;
    restaurantName: string;
    customerName: string;
    customerPhone?: string;
    orderItems: OrderItem[];
    totalAmount: number;
    deliveryAddress: string;
    specialInstructions?: string;
    orderDate: Date;
  }
  ```

### Environment Variables:

- `SMTP_HOST` - SMTP server hostname
- `SMTP_PORT` - SMTP server port
- `SMTP_USER` - SMTP username
- `SMTP_PASS` - SMTP password
- `EMAIL_FROM` - Default sender email address
- `WHATSAPP_API_KEY` - WhatsApp Business API key
- `WHATSAPP_PHONE_NUMBER_ID` - WhatsApp Business phone number ID
- `WHATSAPP_BUSINESS_ACCOUNT_ID` - WhatsApp Business account ID
- `REDIS_URL` - Redis connection string for queue management (optional)

### Coding Standards Notes:

- Implement proper error handling for external API calls
- Use retry mechanisms with exponential backoff for failed notifications
- Ensure notifications are processed asynchronously
- Validate phone numbers and email addresses before sending
- Use proper TypeScript typing for all notification data
- Implement rate limiting to avoid API quota issues
- Log all notification attempts for debugging and monitoring
- Follow security best practices for API key management
- Use template engines for consistent message formatting
- Implement graceful degradation when notification services are unavailable

## Tasks / Subtasks

- [x] Set up Nodemailer configuration and email service
- [ ] Integrate WhatsApp Business API or Twilio WhatsApp API
- [ ] Create email templates using React Email
- [ ] Design WhatsApp message templates
- [ ] Implement notification service orchestrator
- [ ] Create background job queue for processing notifications
- [ ] Add database models for notification preferences and logs
- [ ] Create tRPC procedures for managing notification settings
- [ ] Build restaurant notification settings UI component
- [ ] Implement order creation webhook/trigger for notifications
- [ ] Add retry logic for failed notifications
- [ ] Create notification logging and monitoring
- [ ] Set up environment variables and configuration
- [ ] Implement notification preference validation
- [ ] Add localization support for notification content
- [ ] Create admin dashboard for notification monitoring

## Testing Requirements

**Guidance:** Verify implementation against the ACs using the following tests.

### Unit Tests:

- Test email service with mock SMTP server
- Test WhatsApp service with mock API responses
- Test notification template rendering
- Test retry logic for failed notifications
- Test notification preference validation
- Test notification logging functionality

### Integration Tests:

- Test complete notification flow from order creation to delivery
- Test notification service with real SMTP and WhatsApp APIs (in staging)
- Test notification settings UI with database operations
- Test webhook triggers for order notifications
- Test notification queue processing
- Test localization of notification content

### Manual/CLI Verification:

- Create a test order and verify email notification is received
- Create a test order and verify WhatsApp notification is received
- Test notification settings UI - enable/disable different notification types
- Verify notification preferences are saved and loaded correctly
- Test retry mechanism by temporarily disabling email/WhatsApp services
- Verify notification logs are created and status is updated correctly
- Test with invalid email addresses and phone numbers
- Verify that order placement is not affected by notification failures
- Test notification content in both English and French
- Verify email templates render correctly across different email clients
- Test WhatsApp message formatting and links
- Create multiple orders rapidly to test queue processing

## Story Wrap Up (Agent Populates After Execution)

**Agent Model Used:**
**Completion Notes:**

**Change Log:**

- Initial Draft: Created story structure for Order Notification System using email and WhatsApp
