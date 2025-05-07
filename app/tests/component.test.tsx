/**
 * Tests for a simple test component
 *
 * This file demonstrates component testing with React Testing Library and Vitest:
 * - Testing React components using render from our custom test-utils
 * - Using screen queries to find elements in the DOM
 * - Testing component rendering with default and custom props
 * - Using role-based and testid-based queries
 *
 * This serves as a template for how to write component tests throughout the Dashi project.
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "../utils/test-utils";
import React from "react";

/**
 * Simple component for testing purposes
 *
 * This is a minimal React component that:
 * - Accepts a title prop with a default value
 * - Renders a heading and a button
 * - Uses data-testid for direct element selection
 */
function TestComponent({ title = "Hello World" }: { title?: string }) {
  return (
    <div>
      <h1 data-testid="title">{title}</h1>
      <button>Click me</button>
    </div>
  );
}

describe("TestComponent", () => {
  it("renders with default title", () => {
    render(<TestComponent />);

    // Test using testid selector
    expect(screen.getByTestId("title")).toHaveTextContent("Hello World");

    // Test using role-based selector (preferred when possible)
    expect(screen.getByRole("button")).toHaveTextContent("Click me");
  });

  it("renders with custom title", () => {
    render(<TestComponent title="Custom Title" />);

    expect(screen.getByTestId("title")).toHaveTextContent("Custom Title");
  });
});
