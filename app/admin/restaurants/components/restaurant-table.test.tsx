/**
 * Restaurant Table Component Tests
 *
 * This file contains tests for the restaurant table component using React Testing Library.
 * These tests verify that the table renders correctly with restaurant data,
 * handles loading, error, and empty states appropriately.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import RestaurantTable from "./restaurant-table";
import { dbResponses } from "@/app/tests/fixtures"; // Using shared fixtures
import { trpc } from "@/lib/trpc/client"; // Import trpc for vi.mocked

// Mock Next.js navigation hooks
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    pathname: "/admin/restaurants",
  }),
  usePathname: () => "/admin/restaurants",
  useSearchParams: () => new URLSearchParams(),
}));

// Mock the trpc client
vi.mock("@/lib/trpc/client", () => ({
  trpc: {
    restaurant: {
      getRestaurantsWithUsers: {
        useQuery: vi.fn(), // Define vi.fn() directly here
      },
    },
    // If other trpc features are used by the component, they might need mocking too
  },
}));

// Mock date-fns
vi.mock("date-fns", () => ({
  format: vi.fn((date, formatStr) => {
    if (date instanceof Date && formatStr === "MMM d, yyyy") {
      return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
    return date ? date.toString() : "";
  }),
}));

const mockRestaurantData = dbResponses.restaurant.list.map((r) => ({
  ...r,
  // Ensure createdAt and updatedAt are Date objects for the component
  createdAt: new Date(r.createdAt),
  updatedAt: new Date(r.updatedAt),
}));

describe("RestaurantTable Rendering", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock implementation for successful data fetch
    vi.mocked(trpc.restaurant.getRestaurantsWithUsers.useQuery).mockReturnValue(
      {
        data: {
          restaurants: mockRestaurantData,
          pagination: {
            total: mockRestaurantData.length,
            page: 1,
            limit: 10,
            totalPages: Math.ceil(mockRestaurantData.length / 10),
          },
        },
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
        trpc: { path: "restaurant.getRestaurantsWithUsers" },
        fetchStatus: "idle",
        isSuccess: true,
        isFetching: false,
        status: "success",
        isPending: false,
        isStale: false,
        isLoadingError: false,
        isRefetchError: false,
        isPlaceholderData: false,
        failureCount: 0,
        failureReason: null,
        dataUpdatedAt: Date.now(),
        errorUpdatedAt: 0,
        errorUpdateCount: 0,
        isFetched: true,
        isFetchedAfterMount: true,
        isInitialLoading: false,
        isPaused: false,
        isRefetching: false,
        promise: Promise.resolve(),
      }
    );
  });

  it("renders the table with restaurant data", () => {
    render(<RestaurantTable />);

    // Check table headers
    expect(screen.getByText("Restaurant Name")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("Contact")).toBeInTheDocument();
    expect(screen.getByText("Managers")).toBeInTheDocument();
    expect(screen.getByText("Created")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();

    // Check data for the first restaurant from fixtures
    const firstRestaurant = mockRestaurantData[0];
    expect(screen.getByText(firstRestaurant.name)).toBeInTheDocument();
    if (firstRestaurant.description) {
      expect(screen.getByText(firstRestaurant.description)).toBeInTheDocument();
    }
    if (firstRestaurant.email) {
      expect(screen.getByText(firstRestaurant.email)).toBeInTheDocument();
    }
    expect(screen.getByText(firstRestaurant.phoneNumber)).toBeInTheDocument();

    // Check manager info for the first restaurant
    if (firstRestaurant.managers.length > 0) {
      const firstManager = firstRestaurant.managers[0].user;
      if (firstManager.name) {
        expect(screen.getByText(firstManager.name)).toBeInTheDocument();
      } else {
        expect(screen.getByText(firstManager.email)).toBeInTheDocument();
      }
    } else {
      expect(screen.getAllByText("No managers").length).toBeGreaterThan(0);
    }

    // Check formatted date
    expect(
      screen.getByText(
        new Date(firstRestaurant.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      )
    ).toBeInTheDocument();

    // Check data for the second restaurant
    const secondRestaurant = mockRestaurantData[1];
    expect(screen.getByText(secondRestaurant.name)).toBeInTheDocument();
    // ... (add more specific checks for other restaurants if needed)

    // Check table caption for pagination info
    expect(
      screen.getByText(/Showing 1–.* of \d+ restaurants/i)
    ).toBeInTheDocument();
  });

  it("renders loading state correctly", () => {
    vi.mocked(trpc.restaurant.getRestaurantsWithUsers.useQuery).mockReturnValue(
      {
        data: undefined,
        isLoading: true,
        isError: false,
        error: null,
        refetch: vi.fn(),
        trpc: { path: "restaurant.getRestaurantsWithUsers" },
        // Added missing TanStack Query properties for a loading state
        status: "pending",
        isSuccess: false,
        isPending: true,
        isFetching: true,
        isStale: false,
        isLoadingError: false,
        isRefetchError: false,
        isPlaceholderData: false,
        failureCount: 0,
        failureReason: null,
        fetchStatus: "fetching",
        dataUpdatedAt: 0,
        errorUpdatedAt: 0,
        errorUpdateCount: 0,
        isFetched: false,
        isFetchedAfterMount: false,
        isInitialLoading: true,
        isPaused: false,
        isRefetching: false,
        promise: Promise.resolve(),
      }
    );

    render(<RestaurantTable />);
    expect(screen.getByText("Loading restaurants...")).toBeInTheDocument();
  });

  it("renders error state correctly", () => {
    vi.mocked(trpc.restaurant.getRestaurantsWithUsers.useQuery).mockReturnValue(
      {
        data: undefined,
        isLoading: false,
        isError: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        error: { message: "Network Error" } as any,
        refetch: vi.fn(),
        trpc: { path: "restaurant.getRestaurantsWithUsers" },
        // Added missing TanStack Query properties for an error state
        status: "error",
        isSuccess: false,
        isPending: false,
        isFetching: false,
        isStale: false,
        isLoadingError: true,
        isRefetchError: false,
        isPlaceholderData: false,
        failureCount: 1,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        failureReason: { message: "Network Error" } as any,
        fetchStatus: "idle",
        dataUpdatedAt: 0,
        errorUpdatedAt: Date.now(),
        errorUpdateCount: 1,
        isFetched: true,
        isFetchedAfterMount: true,
        isInitialLoading: false,
        isPaused: false,
        isRefetching: false,
        promise: Promise.resolve(),
      }
    );

    render(<RestaurantTable />);
    expect(screen.getByText("Error Loading Restaurants")).toBeInTheDocument();
    expect(screen.getByText("Network Error")).toBeInTheDocument();
  });

  it("renders empty state correctly when no restaurants are available", () => {
    vi.mocked(trpc.restaurant.getRestaurantsWithUsers.useQuery).mockReturnValue(
      {
        data: {
          restaurants: [],
          pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
        },
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
        trpc: { path: "restaurant.getRestaurantsWithUsers" },
        // Added missing TanStack Query properties for a successful empty state
        status: "success",
        isSuccess: true,
        isPending: false,
        isFetching: false,
        isStale: false,
        isLoadingError: false,
        isRefetchError: false,
        isPlaceholderData: false,
        failureCount: 0,
        failureReason: null,
        fetchStatus: "idle",
        dataUpdatedAt: Date.now(),
        errorUpdatedAt: 0,
        errorUpdateCount: 0,
        isFetched: true,
        isFetchedAfterMount: true,
        isInitialLoading: false,
        isPaused: false,
        isRefetching: false,
        promise: Promise.resolve(),
      }
    );

    render(<RestaurantTable />);
    expect(screen.getByText("No restaurants found")).toBeInTheDocument();
    expect(
      screen.getByText("No restaurants have been added to the system yet.")
    ).toBeInTheDocument();
  });

  it("renders empty state with filter message when filtering returns no results", () => {
    vi.mocked(trpc.restaurant.getRestaurantsWithUsers.useQuery).mockReturnValue(
      {
        data: {
          restaurants: [],
          pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
        },
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
        trpc: { path: "restaurant.getRestaurantsWithUsers" },
        // Added missing TanStack Query properties for a successful empty state
        status: "success",
        isSuccess: true,
        isPending: false,
        isFetching: false,
        isStale: false,
        isLoadingError: false,
        isRefetchError: false,
        isPlaceholderData: false,
        failureCount: 0,
        failureReason: null,
        fetchStatus: "idle",
        dataUpdatedAt: Date.now(),
        errorUpdatedAt: 0,
        errorUpdateCount: 0,
        isFetched: true,
        isFetchedAfterMount: true,
        isInitialLoading: false,
        isPaused: false,
        isRefetching: false,
        promise: Promise.resolve(),
      }
    );

    // Simulate that a filter is active by passing initialFilter
    render(<RestaurantTable initialFilter="NonExistentName" />);

    expect(screen.getByText("No restaurants found")).toBeInTheDocument();
    expect(
      screen.getByText('No restaurants match the filter "NonExistentName"')
    ).toBeInTheDocument();
    // Check for clear filter button when filtering results in empty state
    expect(
      screen.getByRole("button", { name: "Clear filter" })
    ).toBeInTheDocument();
  });
});
