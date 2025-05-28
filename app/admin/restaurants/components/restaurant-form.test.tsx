/**
 * Restaurant Form Component Tests
 *
 * This file contains tests for the restaurant form component using React Testing Library.
 * These tests verify that the form renders correctly, validates inputs, and handles submissions.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { RestaurantForm } from "./restaurant-form";

// Import trpc client
import { trpc } from "@/lib/trpc/client";

// Mock the trpc client
vi.mock("@/lib/trpc/client", () => ({
  trpc: {
    restaurant: {
      createRestaurant: {
        useMutation: vi.fn(() => ({
          mutate: vi.fn(),
          isLoading: false,
          isSuccess: false,
          isError: false,
          error: null,
        })),
      },
    },
  },
}));

// Mock the toast notification
vi.mock("@/components/custom/toast-notification", () => ({
  toastNotification: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock the router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    pathname: "/admin/restaurants",
  }),
}));

describe("RestaurantForm", () => {
  // Set up user event for simulating user interactions
  const user = userEvent.setup();

  // Reset mocks before each test
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the form with all required fields", () => {
    // Render the component
    render(<RestaurantForm setOpen={()=>{}}/>);

    // Check that the form renders with the expected fields
    expect(screen.getByLabelText(/Restaurant Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Service Area/i)).toBeInTheDocument();

    // Check for submit button
    expect(
      screen.getByRole("button", { name: /Create Restaurant/i })
    ).toBeInTheDocument();
  });

  it("successfully submits form with complete data", async () => {
    // Create a mock mutate function
    const mockMutate = vi.fn();

    // Update the mock implementation for this test
    vi.mocked(trpc.restaurant.createRestaurant.useMutation).mockReturnValue({
      mutate: mockMutate,
      isLoading: false,
      isSuccess: false,
      isError: false,
      error: null,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    // Render the component
    render(<RestaurantForm setOpen={()=>{}} />);

    // Complete all form fields
    await user.type(
      screen.getByLabelText(/Restaurant Name/i),
      "Test Restaurant"
    );
    await user.type(
      screen.getByLabelText(/Description/i),
      "A restaurant for testing purposes"
    );
    await user.type(screen.getByLabelText(/Phone Number/i), "123-456-7890");
    await user.type(screen.getByLabelText(/Email/i), "test@example.com");
    await user.type(
      screen.getByLabelText(/Address/i),
      "123 Test Street, Test City"
    );
    await user.type(
      screen.getByLabelText(/Service Area/i),
      "Test Area, 5km radius"
    );

    // Submit the form
    await user.click(
      screen.getByRole("button", { name: /Create Restaurant/i })
    );

    // Check that the form submission was triggered with correct data
    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        name: "Test Restaurant",
        description: "A restaurant for testing purposes",
        phoneNumber: "123-456-7890",
        email: "test@example.com",
        address: "123 Test Street, Test City",
        serviceArea: "Test Area, 5km radius",
      });
    });
  });

  // Additional tests will be added in future tasks for validation
});
