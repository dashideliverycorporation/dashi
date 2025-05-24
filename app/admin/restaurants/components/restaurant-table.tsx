/**
 * Restaurant Table Component for Admin Dashboard
 *
 * Displays a paginated, sortable table of restaurants with their associated users
 * Includes filtering capability for restaurant names
 */
"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc/client";
import {
  RestaurantWithUsers,
  RestaurantTableColumn,
  RestaurantFilterState,
} from "@/types/restaurant";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  Search,
  ChevronDown,
  ChevronUp,
  PencilIcon,
} from "lucide-react";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RestaurantFormModal } from "./restaurant-form-modal";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

/**
 * RestaurantTable component props
 */
interface RestaurantTableProps {
  initialPage?: number;
  initialPageSize?: number;
  initialSortField?: string;
  initialSortOrder?: "asc" | "desc";
  initialFilter?: string;
}

/**
 * Restaurant table component for the admin dashboard
 * Displays restaurants with pagination, sorting and filtering
 */
export default function RestaurantTable({
  initialPage = 1,
  initialPageSize = 10,
  initialSortField = "name",
  initialSortOrder = "asc",
  initialFilter = "",
}: RestaurantTableProps) {
  // Router for URL manipulation
  const router = useRouter();
  const pathname = usePathname();

  // State management for pagination, sorting and filtering
  const [page, setPage] = useState<number>(initialPage);
  const [pageSize] = useState<number>(initialPageSize);
  const [sortField, setSortField] = useState<string>(initialSortField);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(initialSortOrder);
  const [filters, setFilters] = useState<RestaurantFilterState>({
    name: initialFilter,
  });
  const [filterInputValue, setFilterInputValue] = useState(initialFilter);
  const [isFiltering, setIsFiltering] = useState(!!initialFilter);

  // Define table columns
  const columns: RestaurantTableColumn[] = [
    {
      id: "name",
      accessorKey: "name",
      header: "Restaurant Name",
      enableSorting: true,
    },
    {
      id: "description",
      accessorKey: "description",
      header: "Description",
      cell: (info) => {
        const value = info.getValue() || "—";
        return (
          <div className="max-w-xs truncate" title={value as string}>
            {value}
          </div>
        );
      },
      enableSorting: false,
    },
    {
      id: "contact",
      accessorKey: "email",
      header: "Contact",
      cell: (info) => {
        const restaurant = info.row.original as RestaurantWithUsers;
        return (
          <div>
            {restaurant.email && <div>{restaurant.email}</div>}
            {restaurant.phoneNumber && <div>{restaurant.phoneNumber}</div>}
          </div>
        );
      },
      enableSorting: false,
    },
    {
      id: "managers",
      accessorKey: "managers",
      header: "Managers",
      cell: (info) => {
        const restaurant = info.row.original as RestaurantWithUsers;
        return (
          <div>
            {restaurant.managers.length > 0 ? (
              restaurant.managers.map((manager) => (
                <div key={manager.id} className="mb-1">
                  {manager.user.name || manager.user.email}
                </div>
              ))
            ) : (
              <span className="text-muted-foreground italic">No managers</span>
            )}
          </div>
        );
      },
      enableSorting: false,
    },
    {
      id: "createdAt",
      accessorKey: "createdAt",
      header: "Created",
      cell: (info) =>
        format(new Date(info.getValue() as string), "MMM d, yyyy"),
      enableSorting: true,
    },
    {
      id: "actions",
      accessorKey: "id",
      header: "Actions",
      cell: () => (
        <Button
          variant="ghost"
          size="sm"
          className="p-0 hover:bg-transparent"
          asChild
        >
          <a href="#" onClick={(e) => e.preventDefault()}>
            <PencilIcon className="h-4 w-4 text-muted-foreground" />
            <span className="sr-only">Edit</span>
          </a>
        </Button>
      ),
      enableSorting: false,
    },
  ];

  // Fetch restaurant data with pagination, sorting and filtering
  const { data, isLoading, isError, error } =
    trpc.restaurant.getRestaurantsWithUsers.useQuery({
      page,
      limit: pageSize,
      sortField,
      sortOrder,
      filters,
    });

  // Handle sort toggle
  const handleSort = (columnId: string) => {
    if (sortField === columnId) {
      // Toggle sort direction if already sorting by this column
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Sort by new column in ascending order
      setSortField(columnId);
      setSortOrder("asc");
    }
    // Reset to first page when sorting changes
    setPage(1);
  };

  // Handle filter submission
  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, name: filterInputValue });
    setIsFiltering(!!filterInputValue);
    setPage(1); // Reset to first page when filter changes
  };

  // Clear filter
  const clearFilter = () => {
    setFilterInputValue("");
    setFilters({ name: "" });
    setIsFiltering(false);
    setPage(1);
  };

  // Update URL search params when state changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (page !== 1) params.set("page", page.toString());
    if (pageSize !== 10) params.set("size", pageSize.toString());
    if (sortField !== "name") params.set("sort", sortField);
    if (sortOrder !== "asc") params.set("order", sortOrder);
    if (filters.name) params.set("filter", filters.name);

    const queryString = params.toString();
    router.replace(`${pathname}${queryString ? `?${queryString}` : ""}`, {
      scroll: false,
    });
  }, [page, pageSize, sortField, sortOrder, filters, pathname, router]);

  // Calculate pagination values
  const totalPages = data?.pagination.totalPages || 1;
  const total = data?.pagination.total || 0;
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(start + pageSize - 1, total);

  // Handle pagination
  const goToPage = (newPage: number) => {
    setPage(Math.max(1, Math.min(newPage, totalPages)));
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="rounded-lg border">
        <div className="p-1">
          {/* Table header skeleton */}
          <div className="flex items-center p-4 bg-muted-foreground/5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={`flex-1 ${i === 5 ? "flex-0 w-16" : ""}`}>
                <Skeleton className="h-5 w-4/5 bg-muted-foreground/5" />
              </div>
            ))}
          </div>

          {/* Table rows skeleton */}
          {[1, 2, 3, 4, 5].map((row) => (
            <div key={row} className="flex items-center p-4 border-t">
              {[1, 2, 3, 4, 5].map((cell) => (
                <div
                  key={`${row}-${cell}`}
                  className={`flex-1 ${cell === 5 ? "flex-0 w-16" : ""}`}
                >
                  <Skeleton
                    className={`h-5 bg-muted-foreground/5 w-${
                      Math.floor(Math.random() * 40) + 60
                    }%`}
                  />
                  {cell === 3 && row % 2 === 0 && (
                    <Skeleton className="h-5 w-1/3 mt-2 bg-muted-foreground/5" />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="w-full space-y-4">
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold">Restaurants</h2>
        </div>
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
          <h3 className="text-lg font-medium text-destructive">
            Error Loading Restaurants
          </h3>
          <p className="mt-2 text-muted-foreground">
            {error?.message || "Failed to load restaurant data"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-xl font-semibold">Restaurants</h2>

        {/* Filter form */}
        <div className="flex w-full md:w-auto">
          <form
            onSubmit={handleFilterSubmit}
            className="flex w-full max-w-sm items-center space-x-2"
          >
            <Input
              type="text"
              placeholder="Search by name..."
              value={filterInputValue}
              onChange={(e) => setFilterInputValue(e.target.value)}
              className="w-full"
            />
            <Button type="submit" variant="outline" className="cursor-pointer">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
            {isFiltering && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearFilter}
              >
                Clear
              </Button>
            )}
          </form>
        </div>
        <RestaurantFormModal />
      </div>

      {/* No results message */}
      {data && data.restaurants.length === 0 ? (
        <div className="rounded-lg border p-8 text-center flex flex-col items-center">
          <div className="mb-6">
            <Image
              src="/empty-restaurant.svg"
              alt="No restaurants"
              width={180}
              height={180}
              className="mx-auto"
            />
          </div>
          <h3 className="text-xl font-medium">No restaurants found</h3>
          <p className="mt-2 text-muted-foreground max-w-md">
            {isFiltering
              ? `No restaurants match the filter "${filters.name}"`
              : "No restaurants have been added to the system yet."}
          </p>
          {isFiltering && (
            <Button
              className="mt-6"
              variant="outline"
              size="sm"
              onClick={clearFilter}
            >
              Clear filter
            </Button>
          )}
        </div>
      ) : (
        <>
          {/* Restaurant table */}
          <ScrollArea className="w-full">
            <Table>
              <TableHeader className="rounded-b-lg">
                <TableRow className="bg-muted-foreground/5 border-none rounded-b-lg">
                  {columns.map((column) => (
                    <TableHead key={column.id} className="whitespace-nowrap">
                      <div className="flex items-center">
                        {column.header}
                        {column.enableSorting && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-0 hover:bg-transparent"
                            onClick={() => handleSort(column.id)}
                          >
                            {sortField === column.id ? (
                              sortOrder === "asc" ? (
                                <ChevronUp className="ml-1 h-4 w-4" />
                              ) : (
                                <ChevronDown className="ml-1 h-4 w-4" />
                              )
                            ) : (
                              <ArrowUpDown className="ml-1 h-4 w-4" />
                            )}
                            <span className="sr-only">
                              Sort by {column.header}
                            </span>
                          </Button>
                        )}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data &&
                  data.restaurants.map((restaurant) => (
                    <TableRow key={restaurant.id}>
                      {columns.map((column) => {
                        // Handle nested properties with dot notation
                        const accessorKey = column.accessorKey;
                        let value: unknown; // Use unknown instead of any for better type safety

                        if (
                          typeof accessorKey === "string" &&
                          accessorKey.includes(".")
                        ) {
                          // Handle dot notation for nested properties
                          value = accessorKey.split(".").reduce(
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            (obj: any, key) =>
                              obj && typeof obj === "object"
                                ? obj[key]
                                : undefined,
                            restaurant
                          );
                        } else if (typeof accessorKey === "string") {
                          // Direct property access - use a type assertion to tell TypeScript this is safe
                          // Since we're defining the columns ourselves, we know these keys exist on the restaurant object
                          value =
                            restaurant[
                              accessorKey as keyof RestaurantWithUsers
                            ];
                        } else {
                          value = undefined;
                        }

                        return (
                          <TableCell
                            key={`${restaurant.id}-${column.id}`}
                            className="text-trim"
                          >
                            {column.cell
                              ? column.cell({
                                  getValue: () => value,
                                  row: { original: restaurant },
                                })
                              : (value as React.ReactNode)}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </ScrollArea>

          {/* Pagination controls */}
          {
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {start}–{end} of {total} restaurants
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(1)}
                  disabled={page === 1}
                  className="hidden sm:flex"
                >
                  <ChevronsLeft className="h-4 w-4" />
                  <span className="sr-only">First page</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(page - 1)}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Previous page</span>
                </Button>
                <div className="flex items-center">
                  <span className="text-sm font-medium">
                    Page {page} of {totalPages}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(page + 1)}
                  disabled={page >= totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next page</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(totalPages)}
                  disabled={page >= totalPages}
                  className="hidden sm:flex"
                >
                  <ChevronsRight className="h-4 w-4" />
                  <span className="sr-only">Last page</span>
                </Button>
              </div>
            </div>
          }
        </>
      )}
    </div>
  );
}
