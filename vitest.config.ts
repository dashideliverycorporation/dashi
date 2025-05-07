/**
 * Vitest configuration file
 *
 * This file configures Vitest for the Dashi project, providing:
 * - React plugin for testing React components
 * - Happy-DOM as a lightweight browser environment
 * - Test setup file configuration for extending test capabilities
 * - Test file inclusion patterns
 * - Coverage reporting configuration
 * - Path aliases that match the project structure
 *
 * @see https://vitest.dev/config/
 */
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "happy-dom",
    setupFiles: ["./app/tests/setup.ts"],
    include: ["**/*.{test,spec}.{ts,tsx}"],
    globals: true,
    coverage: {
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/**",
        ".next/**",
        "public/**",
        "stories/**",
        "docs/**",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./app"),
    },
  },
});
