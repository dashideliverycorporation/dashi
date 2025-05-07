/**
 * Test utilities for React components in the Dashi project
 *
 * This file provides helper functions and utilities for testing React components:
 *
 * Key features:
 * 1. A custom render function that:
 *    - Sets up userEvent for simulating user interactions
 *    - Provides a wrapper for global providers (when needed)
 *    - Streamlines the testing of components with complex dependencies
 *
 * 2. Re-exports all testing-library functions and utilities to provide a single import source
 *
 * Usage example:
 * ```tsx
 * import { render, screen } from '@/utils/test-utils';
 *
 * test('renders component correctly', () => {
 *   render(<MyComponent />);
 *   expect(screen.getByRole('button')).toBeInTheDocument();
 * });
 * ```
 *
 * @see https://testing-library.com/docs/react-testing-library/intro
 * @see https://testing-library.com/docs/user-event/intro
 */
import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

/**
 * Custom renderer that wraps the component with necessary providers
 *
 * This function enhances the standard render function from React Testing Library:
 * - Sets up userEvent for simulating user interactions
 * - Provides a place to add global providers (like theme, auth, etc.)
 * - Returns both the rendered component and the user event instance
 *
 * @param ui - The React component to render
 * @param options - Additional render options
 * @returns The rendered component and testing utilities, including userEvent
 */
function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) {
  return {
    user: userEvent.setup(),
    ...render(ui, {
      // Add global providers here if needed
      // wrapper: ({ children }) => (
      //   <SomeProvider>{children}</SomeProvider>
      // ),
      ...options,
    }),
  };
}

// Re-export everything from testing-library
export * from "@testing-library/react";

// Override render method with custom render
export { customRender as render };
