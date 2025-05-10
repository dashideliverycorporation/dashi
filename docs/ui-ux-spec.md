# Dashi UI/UX Design System Specification

## Introduction

This document outlines the comprehensive design system for Dashi, our food ordering platform. The design system follows a DoorDash-inspired aesthetic with a modern, simple look and feel, utilizing an orange color theme. This specification serves as the source of truth for all visual elements, ensuring consistency across the entire application.

## Design Principles

Dashi's design adheres to the following core principles:

1. **Simplicity**: Clean, uncluttered interfaces that are easy to understand and navigate
2. **Accessibility**: WCAG 2.1 AA compliant design that works for all users
3. **Consistency**: Unified visual language across all platform components
4. **Responsiveness**: Optimized experience across all device sizes
5. **Cultural Relevance**: Designed with the Goma, DRC audience in mind

## Brand Identity

### Logo

- Primary logo: Dashi wordmark in Primary Orange (#FF4F00)
- Favicon/App icon: Stylized "D" in Primary Orange (#FF4F00)
- Minimum spacing: 16px padding around all sides
- Usage: Header, splash screens, communications

## Color Palette

### Primary Colors

| Color Name       | Hex Code | RGB             | Usage                                            |
| ---------------- | -------- | --------------- | ------------------------------------------------ |
| Primary Orange   | #FF4F00  | rgb(255, 79, 0) | Primary brand color, CTAs, important UI elements |
| Secondary Orange | #E64600  | rgb(230, 70, 0) | Secondary actions, hover states, accents         |

### Neutral Colors

| Color Name  | Hex Code | RGB                | Usage                                       |
| ----------- | -------- | ------------------ | ------------------------------------------- |
| White       | #FFFFFF  | rgb(255, 255, 255) | Backgrounds, cards, primary content areas   |
| Light Gray  | #F7F7F7  | rgb(247, 247, 247) | Secondary backgrounds, alternate rows       |
| Medium Gray | #D4D4D4  | rgb(212, 212, 212) | Borders, dividers, disabled states          |
| Dark Gray   | #333333  | rgb(51, 51, 51)    | Primary text, icons, high-contrast elements |

### Accent Colors

| Color Name    | Hex Code | RGB               | Usage                                              |
| ------------- | -------- | ----------------- | -------------------------------------------------- |
| Success Green | #4CAF50  | rgb(76, 175, 80)  | Success states, confirmations, positive indicators |
| Error Red     | #F44336  | rgb(244, 67, 54)  | Error messages, warnings, destructive actions      |
| Info Blue     | #2196F3  | rgb(33, 150, 243) | Informational messages, links, neutral indicators  |

### Color Usage Guidelines

- Use Primary Orange (#FF4F00) for main CTAs and key interactive elements
- Use Secondary Orange (#E64600) for hover/active states of primary elements
- Maintain sufficient contrast (minimum 4.5:1 for text) between text and backgrounds
- Use accent colors sparingly and purposefully to indicate state or importance
- Neutral colors should dominate the interface with orange as an accent

## Typography

### Font Family

- **Primary Font**: Inter (Sans-serif)
- **Fallback Stack**: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif

### Type Scale

| Name       | Size (px/rem) | Weight          | Line Height | Usage                                          |
| ---------- | ------------- | --------------- | ----------- | ---------------------------------------------- |
| Display    | 36px/2.25rem  | Bold (700)      | 1.2         | Hero sections, major promotional content       |
| Heading 1  | 30px/1.875rem | Bold (700)      | 1.2         | Page titles                                    |
| Heading 2  | 24px/1.5rem   | Semi-Bold (600) | 1.3         | Section headings                               |
| Heading 3  | 20px/1.25rem  | Semi-Bold (600) | 1.4         | Subsection headings, card titles               |
| Heading 4  | 18px/1.125rem | Medium (500)    | 1.4         | Minor headings, emphasized content             |
| Body Large | 16px/1rem     | Regular (400)   | 1.5         | Primary body text, important information       |
| Body       | 14px/0.875rem | Regular (400)   | 1.5         | Standard body text, descriptions               |
| Small      | 12px/0.75rem  | Regular (400)   | 1.5         | Captions, footnotes, supplementary information |

### Font Weights

- Light: 300
- Regular: 400
- Medium: 500
- Semi-Bold: 600
- Bold: 700

### Typography Guidelines

- Use sentence case for headings and UI elements
- Keep line length between 60-80 characters for optimal readability
- Ensure proper hierarchy through consistent use of font sizes and weights
- Use appropriate line height for different text sizes to ensure readability
- Avoid using more than 3 font sizes on a single screen

## Spacing System

Based on a 4px grid system, our spacing scale provides consistent measurements across the UI:

| Token   | Size (px/rem) | Usage                                        |
| ------- | ------------- | -------------------------------------------- |
| space-1 | 4px/0.25rem   | Minimal spacing, tight elements              |
| space-2 | 8px/0.5rem    | Common small spacing, between related items  |
| space-3 | 12px/0.75rem  | Medium spacing                               |
| space-4 | 16px/1rem     | Standard spacing, between unrelated elements |
| space-5 | 24px/1.5rem   | Large spacing, section separations           |
| space-6 | 32px/2rem     | Extra large spacing, major section breaks    |
| space-7 | 48px/3rem     | Maximum spacing, page sections               |
| space-8 | 64px/4rem     | Extra large gap, major layout divisions      |

## Layout & Grid System

### Breakpoints

| Breakpoint | Width     | Device Type                 |
| ---------- | --------- | --------------------------- |
| xs         | < 640px   | Mobile phones               |
| sm         | >= 640px  | Large phones, small tablets |
| md         | >= 768px  | Tablets, small laptops      |
| lg         | >= 1024px | Laptops, small desktops     |
| xl         | >= 1280px | Desktop computers           |
| 2xl        | >= 1536px | Large desktop screens       |

### Container Widths

- **Mobile**: 100% with 16px padding
- **Tablet**: 100% with 24px padding
- **Laptop**: 1024px centered with 32px padding
- **Desktop**: 1280px centered with 32px padding

### Grid

- Based on a 12-column grid system
- Responsive gutters: 16px (mobile), 24px (tablet), 32px (desktop)
- Flexible column layouts that adjust based on screen size

## UI Components

### Navigation

#### Main Header

- Full-width sticky header
- Height: 64px (desktop), 56px (mobile)
- Elements: Logo, navigation links, language switcher, auth buttons
- Mobile: Collapsible menu with hamburger icon

#### Bottom Navigation (Mobile)

- Fixed to bottom
- Height: 56px
- Contains: Home, Search, Orders, Profile icons
- Active state: Primary Orange with label

### Buttons

#### Primary Button

- Background: Primary Orange (#FF4F00)
- Text: White (#FFFFFF)
- Border: None
- Hover: Secondary Orange (#E64600)
- Active/Pressed: Darker orange (darken by 10%)
- Disabled: Medium Gray (#D4D4D4)
- Height: 40px (desktop), 48px (mobile for touch targets)
- Padding: 12px 16px
- Border-radius: 8px
- Font: Body/14px, Medium (500)

#### Secondary Button

- Background: White (#FFFFFF)
- Text: Primary Orange (#FF4F00)
- Border: 1px solid Primary Orange (#FF4F00)
- Hover: Light orange background (10% opacity)
- Active/Pressed: Darker orange border (darken by 10%)
- Disabled: Medium Gray (#D4D4D4)
- Height: 40px (desktop), 48px (mobile)
- Padding: 12px 16px
- Border-radius: 8px
- Font: Body/14px, Medium (500)

#### Text Button

- Background: Transparent
- Text: Primary Orange (#FF4F00)
- Border: None
- Hover: Light orange background (10% opacity)
- Active/Pressed: Darker text (darken by 10%)
- Disabled: Medium Gray (#D4D4D4)
- Padding: 8px 12px
- Font: Body/14px, Medium (500)

#### Icon Button

- Size: 40px x 40px
- Border-radius: 8px (squared) or 20px (rounded)
- Padding: 8px
- States follow primary, secondary, or text button patterns

### Cards

#### Restaurant Card

- Background: White (#FFFFFF)
- Border: 1px solid Light Gray (#F7F7F7)
- Border-radius: 12px
- Shadow: 0 2px 8px rgba(0,0,0,0.05)
- Padding: 16px
- Elements:
  - Image (16:9 ratio)
  - Name (Heading 3)
  - Cuisine type (Body)
  - Rating (with star icon)
  - Hover effect: Subtle elevation increase

#### Menu Item Card

- Background: White (#FFFFFF)
- Border: 1px solid Light Gray (#F7F7F7)
- Border-radius: 12px
- Shadow: 0 2px 8px rgba(0,0,0,0.05)
- Padding: 16px
- Elements:
  - Image (optional, 1:1 ratio)
  - Name (Heading 4)
  - Description (Body)
  - Price (Body Large, Semi-Bold)
  - Add button (Icon Button with "+" icon)

#### Order Summary Card

- Background: White (#FFFFFF)
- Border: 1px solid Light Gray (#F7F7F7)
- Border-radius: 12px
- Shadow: 0 2px 8px rgba(0,0,0,0.05)
- Padding: 16px
- Elements:
  - Order items (list)
  - Quantities
  - Prices
  - Subtotal
  - Total (Body Large, Bold)

### Forms

#### Input Field

- Height: 40px (desktop), 48px (mobile)
- Border: 1px solid Medium Gray (#D4D4D4)
- Border-radius: 8px
- Padding: 8px 12px
- Active: Border Primary Orange (#FF4F00)
- Error: Border Error Red (#F44336)
- Label: Body, positioned above input
- Error text: Small, Error Red (#F44336)
- Font: Body

#### Dropdown / Select

- Height: 40px (desktop), 48px (mobile)
- Border: 1px solid Medium Gray (#D4D4D4)
- Border-radius: 8px
- Padding: 8px 12px
- Icon: Chevron down
- Active state: Border Primary Orange (#FF4F00)
- Options menu: White background, Light Gray (#F7F7F7) hover

#### Checkbox

- Size: 20px x 20px
- Border: 1px solid Medium Gray (#D4D4D4)
- Border-radius: 4px
- Checked: Primary Orange (#FF4F00) fill, white checkmark
- Hover: Secondary Orange (#E64600) border

#### Radio Button

- Size: 20px x 20px
- Border: 1px solid Medium Gray (#D4D4D4)
- Border-radius: 10px (full circle)
- Selected: Primary Orange (#FF4F00) center dot
- Hover: Secondary Orange (#E64600) border

### Alerts & Notifications

#### Success Alert

- Background: Light green (10% opacity of Success Green)
- Border-left: 4px solid Success Green (#4CAF50)
- Border-radius: 8px
- Icon: Checkmark in Success Green
- Text: Dark Gray (#333333)

#### Error Alert

- Background: Light red (10% opacity of Error Red)
- Border-left: 4px solid Error Red (#F44336)
- Border-radius: 8px
- Icon: X or exclamation in Error Red
- Text: Dark Gray (#333333)

#### Info Alert

- Background: Light blue (10% opacity of Info Blue)
- Border-left: 4px solid Info Blue (#2196F3)
- Border-radius: 8px
- Icon: "i" in Info Blue
- Text: Dark Gray (#333333)

#### Toast Notification

- Width: 320px max
- Background: White (#FFFFFF)
- Border-radius: 8px
- Shadow: 0 4px 12px rgba(0,0,0,0.1)
- Duration: 4 seconds
- Position: Top right (desktop), bottom (mobile)
- Success/Error/Info variants follow alert color scheme

## Page Layouts

### Customer-Facing Pages

#### Homepage / Restaurant Listing

- Hero section with search bar
- Grid layout of Restaurant Cards
- 1 column (mobile), 2 columns (tablet), 3+ columns (desktop)
- Filtering options in a horizontal scrollable bar (mobile) or top bar (desktop)

#### Restaurant Detail / Menu Page

- Restaurant header with image, name, info
- Category navigation (horizontal scroll on mobile, sticky sidebar on desktop)
- Menu items in a responsive grid
- Floating cart summary on desktop, fixed bottom bar on mobile

#### Cart / Checkout

- Linear flow with clear steps indication
- Order summary card (sticky on desktop)
- Form elements organized in logical groups
- Prominent call-to-action buttons

### Restaurant Dashboard

- Sidebar navigation (collapsible on mobile)
- Content area with breadcrumbs
- Data tables for orders, menu items
- Cards for summary information
- Forms for data entry

### Admin Dashboard

- Sidebar navigation (collapsible on mobile)
- Content area with breadcrumbs
- Data visualization components
- Data tables for restaurants, sales, etc.
- Administrative forms

## Iconography

- Style: Simple, outlined 24x24px icons
- Stroke width: 2px
- Corner radius: 2px
- Color: Contextual (Primary Orange for active, Dark Gray for default)
- Common icons:
  - Navigation: home, search, orders, profile
  - Actions: add, edit, delete, settings
  - Feedback: check, cross, warning
  - Commerce: cart, delivery, restaurant

## Imagery

### Photos

- Style: Bright, appetizing food photography
- Crop ratio: 16:9 (restaurant banner), 1:1 (menu items)
- Quality: High resolution, minimum 72 DPI
- Treatment: Subtle vignette for food focus

### Illustrations

- Style: Simple, line-based illustrations
- Color: Primary Orange (#FF4F00) accents with neutral grays
- Purpose: Empty states, onboarding, feature explanation

## Animations & Transitions

- Duration: Short (150-250ms)
- Easing: Ease-out for entering, ease-in for exiting
- Purpose: Provide feedback, guide attention, enhance experience
- Common animations:
  - Button hover/press effects
  - Page transitions (subtle fade)
  - Loading states (spinner, skeleton screens)
  - Expanding/collapsing elements

## Accessibility Guidelines

- Color contrast: 4.5:1 minimum for normal text, 3:1 for large text
- Focus states: Visible focus indicator for all interactive elements
- Alternative text: All images must have appropriate alt text
- Keyboard navigation: All interactions must be possible via keyboard
- Screen reader support: Proper ARIA labels and semantics
- Touch targets: Minimum 44x44px for mobile interfaces

## Responsive Design Patterns

- Mobile-first approach to CSS and component design
- Flexible grids that adjust column count based on viewport
- Stack layouts on smaller screens
- Adapt navigation (bottom bar on mobile, top/sidebar on desktop)
- Adjust typography scale slightly for different viewport sizes
- Contextual UI elements (floating action buttons on mobile)

## Implementation with Shadcn UI

Shadcn UI will serve as the foundation for implementing this design system. We'll customize the following components to match our specifications:

- Button variants (primary, secondary, text, icon)
- Card variants (restaurant, menu item, order summary)
- Form components (input, select, checkbox, radio)
- Alert and dialog components
- Navigation components (main header, sidebar)
- Table components for data display

### Tailwind Configuration

The design tokens (colors, spacing, typography) will be implemented in the Tailwind configuration file, enabling consistent usage across the application.

## Further Design Resources

- [Component Examples](components/ui-examples/ThemeShowcase.tsx) - Live examples of all UI components
- [Figma Design Library](https://figma.com/file/dashi-design-system) - Comprehensive design files (to be created)
- [Icon Set](public/icons) - Complete set of application icons

---

## Version History

| Version | Date       | Author         | Changes       |
| ------- | ---------- | -------------- | ------------- |
| 0.1     | 2025-05-10 | GitHub Copilot | Initial draft |
