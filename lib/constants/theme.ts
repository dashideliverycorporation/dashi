/**
 * Dashi Design System
 *
 * This file contains all theme constants for the Dashi platform.
 * Based on the UI/UX specification documented in docs/ui-ux-spec.md
 */

// ------------------- Colors -------------------

/**
 * Primary colors - Used for branding and primary actions
 */
export const colors = {
  // Primary Colors
  primary: {
    /** Primary orange - Main brand color, CTAs, important UI elements */
    default: "#FF4F00",
    /** Secondary orange - Secondary actions, hover states, accents */
    secondary: "#E64600",
    /** Lighter shade of primary orange (10% opacity) - For subtle highlights and backgrounds */
    light: "rgba(255, 79, 0, 0.1)",
    /** Darker shade of primary orange - For pressed/active states */
    dark: "#CC3F00",
  },

  // Neutral Colors
  neutral: {
    /** White - Backgrounds, cards, primary content areas */
    white: "#FFFFFF",
    /** Light Gray - Secondary backgrounds, alternate rows */
    lightGray: "#F7F7F7",
    /** Medium Gray - Borders, dividers, disabled states */
    mediumGray: "#D4D4D4",
    /** Dark Gray - Primary text, icons, high-contrast elements */
    darkGray: "#333333",
    /** Black - For maximum contrast when needed */
    black: "#000000",
  },

  // Accent/Functional Colors
  accent: {
    /** Success Green - Success states, confirmations, positive indicators */
    success: "#4CAF50",
    /** Light Success Green - Background for success messages (10% opacity) */
    successLight: "rgba(76, 175, 80, 0.1)",
    /** Error Red - Error messages, warnings, destructive actions */
    error: "#F44336",
    /** Light Error Red - Background for error messages (10% opacity) */
    errorLight: "rgba(244, 67, 54, 0.1)",
    /** Info Blue - Informational messages, links, neutral indicators */
    info: "#2196F3",
    /** Light Info Blue - Background for info messages (10% opacity) */
    infoLight: "rgba(33, 150, 243, 0.1)",
  },
};

// ------------------- Typography -------------------

/**
 * Font family configuration
 */
export const fontFamily = {
  /** Primary font: Inter */
  primary: "Inter, sans-serif",
  /** Fallback system fonts */
  fallback:
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
};

/**
 * Font weights
 */
export const fontWeight = {
  light: 300,
  regular: 400,
  medium: 500,
  semiBold: 600,
  bold: 700,
};

/**
 * Font sizes in rem and px for reference
 */
export const fontSize = {
  /** Display: 36px/2.25rem - Hero sections, major promotional content */
  display: "2.25rem",
  /** Heading 1: 30px/1.875rem - Page titles */
  h1: "1.875rem",
  /** Heading 2: 24px/1.5rem - Section headings */
  h2: "1.5rem",
  /** Heading 3: 20px/1.25rem - Subsection headings, card titles */
  h3: "1.25rem",
  /** Heading 4: 18px/1.125rem - Minor headings, emphasized content */
  h4: "1.125rem",
  /** Body Large: 16px/1rem - Primary body text, important information */
  bodyLarge: "1rem",
  /** Body: 14px/0.875rem - Standard body text, descriptions */
  body: "0.875rem",
  /** Small: 12px/0.75rem - Captions, footnotes, supplementary information */
  small: "0.75rem",
};

/**
 * Line heights
 */
export const lineHeight = {
  tight: 1.2,
  normal: 1.4,
  relaxed: 1.5,
};

// ------------------- Spacing -------------------

/**
 * Spacing scale in rem (based on 4px grid)
 */
export const spacing = {
  /** 4px / 0.25rem - Minimal spacing, tight elements */
  1: "0.25rem",
  /** 8px / 0.5rem - Common small spacing, between related items */
  2: "0.5rem",
  /** 12px / 0.75rem - Medium spacing */
  3: "0.75rem",
  /** 16px / 1rem - Standard spacing, between unrelated elements */
  4: "1rem",
  /** 24px / 1.5rem - Large spacing, section separations */
  5: "1.5rem",
  /** 32px / 2rem - Extra large spacing, major section breaks */
  6: "2rem",
  /** 48px / 3rem - Maximum spacing, page sections */
  7: "3rem",
  /** 64px / 4rem - Extra large gap, major layout divisions */
  8: "4rem",
};

// ------------------- Breakpoints -------------------

/**
 * Responsive breakpoints
 */
export const breakpoints = {
  /** Mobile phones */
  xs: "0px",
  /** Large phones, small tablets */
  sm: "640px",
  /** Tablets, small laptops */
  md: "768px",
  /** Laptops, small desktops */
  lg: "1024px",
  /** Desktop computers */
  xl: "1280px",
  /** Large desktop screens */
  "2xl": "1536px",
};

// ------------------- Borders & Radii -------------------

/**
 * Border radius values
 */
export const borderRadius = {
  /** Small radius for minor UI elements (4px) */
  sm: "0.25rem",
  /** Default radius for buttons, inputs (8px) */
  default: "0.5rem",
  /** Medium radius for cards (12px) */
  md: "0.75rem",
  /** Large radius for prominent elements (16px) */
  lg: "1rem",
  /** Full radius for rounded elements like badges */
  full: "9999px",
};

/**
 * Border widths
 */
export const borderWidth = {
  /** Default border width */
  default: "1px",
  /** Medium border width */
  medium: "2px",
  /** Thick border width */
  thick: "4px",
};

// ------------------- Shadows -------------------

/**
 * Box shadows
 */
export const shadows = {
  /** Subtle shadow for cards - 0 2px 8px rgba(0,0,0,0.05) */
  sm: "0 2px 8px rgba(0,0,0,0.05)",
  /** Medium shadow for dropdowns, popovers - 0 4px 12px rgba(0,0,0,0.1) */
  md: "0 4px 12px rgba(0,0,0,0.1)",
  /** Large shadow for modals, dialogs - 0 8px 24px rgba(0,0,0,0.15) */
  lg: "0 8px 24px rgba(0,0,0,0.15)",
};

// ------------------- Animation & Transitions -------------------

/**
 * Animation duration in milliseconds
 */
export const animation = {
  /** Fast animation - 150ms */
  fast: 150,
  /** Default animation - 200ms */
  default: 200,
  /** Slow animation - 300ms */
  slow: 300,
};

/**
 * Transition easings
 */
export const transitions = {
  /** Default transition for most UI elements */
  default: "ease-out",
  /** Transition for elements entering the screen */
  enter: "ease-out",
  /** Transition for elements exiting the screen */
  exit: "ease-in",
};

// ------------------- Layout -------------------

/**
 * Container maximum widths
 */
export const container = {
  /** Default container padding (mobile) */
  paddingMobile: spacing[4], // 16px/1rem
  /** Default container padding (tablet) */
  paddingTablet: spacing[5], // 24px/1.5rem
  /** Default container padding (desktop) */
  paddingDesktop: spacing[6], // 32px/2rem
  /** Maximum width on laptop screens */
  maxWidthLaptop: "1024px",
  /** Maximum width on desktop screens */
  maxWidthDesktop: "1280px",
};

/**
 * Common z-index values to maintain consistency across components
 */
export const zIndex = {
  /** Default z-index for most elements */
  default: 1,
  /** For elements like dropdown menus */
  dropdown: 10,
  /** For sticky headers */
  sticky: 100,
  /** For modals/dialogs */
  modal: 1000,
  /** For tooltips */
  tooltip: 1500,
  /** For notifications/toasts */
  toast: 2000,
};

// Export all theme constants as a single theme object
export const theme = {
  colors,
  fontFamily,
  fontWeight,
  fontSize,
  lineHeight,
  spacing,
  breakpoints,
  borderRadius,
  borderWidth,
  shadows,
  animation,
  transitions,
  container,
  zIndex,
};

export default theme;
