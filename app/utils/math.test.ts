/**
 * Tests for math utility functions
 *
 * This file demonstrates basic unit testing with Vitest:
 * - Testing pure functions with various input scenarios
 * - Using describe blocks for organizing tests
 * - Using it/test blocks for individual test cases
 * - Using expect with matchers for assertions
 *
 * The tests verify that our math utility functions work as expected
 * with different inputs, including edge cases.
 */
import { describe, it, expect } from "vitest";
import { sum, subtract } from "./math";

describe("Math utilities", () => {
  describe("sum function", () => {
    it("should add two positive numbers correctly", () => {
      expect(sum(2, 3)).toBe(5);
    });

    it("should handle negative numbers", () => {
      expect(sum(-1, 1)).toBe(0);
      expect(sum(-1, -1)).toBe(-2);
    });

    it("should handle zero", () => {
      expect(sum(0, 5)).toBe(5);
      expect(sum(5, 0)).toBe(5);
      expect(sum(0, 0)).toBe(0);
    });
  });

  describe("subtract function", () => {
    it("should subtract two numbers correctly", () => {
      expect(subtract(5, 3)).toBe(2);
    });

    it("should handle negative numbers", () => {
      expect(subtract(1, 5)).toBe(-4);
      expect(subtract(-1, -5)).toBe(4);
    });

    it("should handle zero", () => {
      expect(subtract(5, 0)).toBe(5);
      expect(subtract(0, 5)).toBe(-5);
    });
  });
});
