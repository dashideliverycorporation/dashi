/**
 * Menu Table Component for Restaurant Dashboard
 *
 * Displays a paginated, sortable table of menu items
 * Includes filtering capability for menu item names
 */
"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";

// UI Components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

// API & Data
import { trpc } from "@/lib/trpc/client";
import { MenuItemFormModal } from "./menu-item-form-modal";
import type { MenuItemWithCategory } from "@/types/menu";


// Components
import { DeleteMenuItemButton } from "./delete-menu-item-button";

// Type definitions
interface MenuItemTableColumn {
  id: string;
  accessorKey: string;
  header: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cell?: (info: any) => React.ReactNode;
  enableSorting?: boolean;
}

interface MenuItemFilterState {
  name: string;
  categoryId?: string;
}

/**
 * MenuTable component props
 */
interface MenuTableProps {
  initialPage?: number;
  initialPageSize?: number;
  initialSortField?: string;
  initialSortOrder?: "asc" | "desc";
  initialFilter?: string;
  restaurantId: string;
}

/**
 * Menu table component for the restaurant dashboard
 * Displays menu items with pagination, sorting and filtering
 */
export default function MenuTable({
  initialPage = 1,
  initialPageSize = 10,
  initialSortField = "name",
  initialSortOrder = "asc",
  initialFilter = "",
  restaurantId,
}: MenuTableProps) {
  // Router for URL manipulation
  const router = useRouter();
  const pathname = usePathname();

  // State management for pagination, sorting and filtering
  const [page, setPage] = useState<number>(initialPage);
  const [pageSize] = useState<number>(initialPageSize);
  const [sortField, setSortField] = useState<string>(initialSortField);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(initialSortOrder);
  const [filters, setFilters] = useState<MenuItemFilterState>({
    name: initialFilter,
  });
  const [filterInputValue, setFilterInputValue] = useState(initialFilter);
  const [isFiltering, setIsFiltering] = useState(!!initialFilter);

  // Define table columns
  const columns: MenuItemTableColumn[] = [
    {
      id: "image",
      accessorKey: "imageUrl",
      header: "Image",
      cell: (info) => {
        const imageUrl = info.getValue() as string | null;
        return (
          <div className="h-12 w-12 rounded-md overflow-hidden relative">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt="Menu item image"
                fill
                sizes="48px"
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full bg-muted flex items-center justify-center text-muted-foreground">
                <span className="text-xs">No image</span>
              </div>
            )}
          </div>
        );
      },
      enableSorting: false,
    },
    {
      id: "name",
      accessorKey: "name",
      header: "Item Name",
      enableSorting: true,
    },
    {
      id: "category",
      accessorKey: "category",
      header: "Category",
      cell: (info) => {
        const category = info.getValue() as string;
        return category || "—";
      },
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
      id: "price",
      accessorKey: "price",
      header: "Price",
      cell: (info) => {
        const value = info.getValue();
        // Handle different possible types for price (string, number, or Decimal)
        if (!value) return "—";
        
        // Convert to number if it's a string or already a number
        const numValue = typeof value === 'string' ? parseFloat(value) : value;
        
        // Check if we have a valid number after conversion
        return !isNaN(numValue) ? `$${Number(numValue).toFixed(2)}` : "—";
      },
      enableSorting: true,
    },
    {
      id: "available",
      accessorKey: "isAvailable",
      header: "Available",
      cell: (info) => {
        const isAvailable = info.getValue() as boolean;
        return (
          <div className={`font-medium ${isAvailable ? 'text-green-600' : 'text-red-600'}`}>
            {isAvailable ? "Yes" : "No"}
          </div>
        );
      },
      enableSorting: true,
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
      cell: (info) => {
        const menuItem = info.row.original as MenuItemWithCategory;
        return (
          <div className="flex items-center space-x-2">
            <MenuItemFormModal 
              menuItem={menuItem} 
              restaurantId={restaurantId}
              isEdit={true}
              onMenuItemChange={() => {
                // Invalidate the menu items query to refresh the data
                utils.restaurant.getMenuItems.invalidate();
              }}
            />
            <DeleteMenuItemButton 
              menuItemId={menuItem.id}
              menuItemName={menuItem.name}
              onDeleteSuccess={() => {
                // Invalidate the menu items query to refresh the data
                utils.restaurant.getMenuItems.invalidate();
              }}
            />
          </div>
        );
      },
      enableSorting: false,
    },
  ];

  // Get TRPC utils for query invalidation
  const utils = trpc.useContext();
  
  // Fetch menu item data with pagination, sorting and filtering
  const { data, isLoading, isError, error } =
    trpc.restaurant.getMenuItems.useQuery({
      restaurantId,
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
            {/* Image column header */}
            <div className="flex-0 w-16">
              <Skeleton className="h-5 w-10 bg-muted-foreground/5" />
            </div>
            {/* Other columns */}
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className={`flex-1 ${i === 7 ? "flex-0 w-16" : ""}`}>
                <Skeleton className="h-5 w-32 bg-muted-foreground/5" />
              </div>
            ))}
          </div>

          {/* Table rows skeleton */}
          {[1, 2, 3, 4, 5].map((row) => (
            <div key={row} className="flex items-center p-4 border-t">
              {/* Image cell skeleton */}
              <div className="flex-0 w-16">
                <Skeleton className="h-12 w-12 bg-muted-foreground/5 rounded-md" />
              </div>
              {/* Other cells */}
              {[1, 2, 3, 4, 5, 6, 7].map((cell) => (
                <div
                  key={`${row}-${cell}`}
                  className={`flex-1 ${cell === 7 ? "flex-0 w-16" : ""}`}
                >
                  <Skeleton
                    className={`h-5 bg-muted-foreground/5 ${
                      cell === 1 ? "w-28" : 
                      cell === 2 ? "w-20" : 
                      cell === 3 ? "w-32" : 
                      cell === 4 ? "w-20" : 
                      cell === 5 ? "w-16" :
                      cell === 6 ? "w-24" :
                      "w-12"
                    }`}
                  />
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
          <h2 className="text-xl font-semibold">Menu Items</h2>
        </div>
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
          <h3 className="text-lg font-medium text-destructive">
            Error Loading Menu Items
          </h3>
          <p className="mt-2 text-muted-foreground">
            {error?.message || "Failed to load menu item data"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-xl font-semibold">Menu Items</h2>

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
        <MenuItemFormModal 
          restaurantId={restaurantId}
          onMenuItemChange={() => {
            // Invalidate the menu items query to refresh the data
            utils.restaurant.getMenuItems.invalidate();
          }}
        />
      </div>

      {/* No results message */}
      {!data || (data && data.menuItems.length === 0) ? (
        <div className="rounded-lg border p-8 text-center flex flex-col items-center">
          <div className="mb-6">
            <Image
              src="/empty-menu.svg"
              alt="No menu items"
              width={180}
              height={180}
              className="mx-auto"
            />
          </div>
          <h3 className="text-xl font-medium">No menu items found</h3>
          <p className="mt-2 text-muted-foreground max-w-md">
            {isFiltering
              ? `No menu items match the filter "${filters.name}"`
              : "No menu items have been added to this restaurant yet."}
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
          {/* Menu items table */}
          <ScrollArea className="w-[1150px]">
            <Table>
              <TableHeader className="rounded-b-lg">
                <TableRow className="bg-muted-foreground/5 border-none rounded-b-lg">
                  {columns.map((column) => (
                    <TableHead 
                      key={column.id} 
                      className="whitespace-nowrap"
                      onClick={() => column.enableSorting && handleSort(column.id)}
                    >
                      <div className="flex items-center">
                        {column.header}
                        {column.enableSorting && (
                          <div className="ml-1">
                            {sortField === column.id ? (
                              sortOrder === "asc" ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )
                            ) : (
                              <ChevronDown className="h-4 w-4 text-muted-foreground/50" />
                            )}
                          </div>
                        )}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data &&
                  data.menuItems.map((menuItem) => (
                    <TableRow key={menuItem.id}>
                      {columns.map((column) => {
                        // Handle nested properties with dot notation
                        const accessorKey = column.accessorKey;
                        let value: unknown;

                        if (
                          typeof accessorKey === "string" &&
                          accessorKey.includes(".")
                        ) {
                          // Handle dot notation for nested properties
                          const keys = accessorKey.split(".");
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          let nestedValue: any = menuItem;
                          
                          for (const key of keys) {
                            if (nestedValue && typeof nestedValue === "object") {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              nestedValue = (nestedValue as any)[key];
                            } else {
                              nestedValue = undefined;
                              break;
                            }
                          }
                          
                          value = nestedValue;
                        } else if (typeof accessorKey === "string") {
                          // Handle direct property access
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          value = (menuItem as any)[accessorKey];
                        } else {
                          value = undefined;
                        }

                        return (
                          <TableCell key={column.id}>
                            {column.cell
                              ? column.cell({
                                  getValue: () => value,
                                  row: { original: menuItem },
                                })
                              : (value as React.ReactNode)}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          {/* Pagination controls */}
          {
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {start}–{end} of {total} menu items
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