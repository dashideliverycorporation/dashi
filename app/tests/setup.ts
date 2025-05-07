/**
 * Vitest setup file for extending the test environment
 *
 * This file configures the testing environment for the Dashi project:
 * 1. Imports testing-library/jest-dom to add custom DOM matchers like toBeInTheDocument()
 * 2. Mocks the Next.js navigation hooks and functions to avoid router-related errors in tests
 *    - useRouter: Returns mocked router functions and properties
 *    - usePathname: Returns a default pathname
 *    - useSearchParams: Returns an empty URLSearchParams object
 *
 * This setup enables components using Next.js navigation to be tested in isolation.
 *
 * @see https://testing-library.com/docs/ecosystem-jest-dom/
 * @see https://nextjs.org/docs/app/api-reference/functions/use-router
 */
import { vi } from "vitest";
import "@testing-library/jest-dom";

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    pathname: "/",
    query: {},
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));
