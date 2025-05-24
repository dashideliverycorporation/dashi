"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { JSX } from "react/jsx-runtime";
import { trpc } from "@/lib/trpc/client";
import RestaurantTable from "./components/restaurant-table";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Restaurant Management Page
 *
 * Displays a list of restaurants with options to add, edit, and manage
 *
 * @returns {JSX.Element} The restaurant management page
 */
export default function RestaurantsPage(): JSX.Element {
  // Check if there are restaurants
  const { data: restaurantsCheck, isLoading } =
    trpc.restaurant.getRestaurantsWithUsers.useQuery(
      {
        page: 1,
        limit: 1,
      },
      {
        // Disable automatic refetching to avoid extra API calls
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      }
    );

  const hasRestaurants =
    !isLoading &&
    restaurantsCheck?.pagination.total &&
    restaurantsCheck.pagination.total > 0;
  return (
    <div className="space-y-6 bg-background p-6 md:p-8 rounded-md min-h-screen">
      {isLoading ? (
        <div className="w-full space-y-4">
          <div className="rounded-lg border">
            <div className="p-1">
              {/* Table header skeleton */}
              <div className="flex items-center p-4 bg-muted-foreground/5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`flex-1 ${i === 5 ? "flex-0 w-16" : ""}`}
                  >
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

          {/* Pagination skeleton */}
          {/* <div className="flex items-center justify-between pt-2">
            <Skeleton className="h-5 w-40" />
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-5 w-24 mx-2" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div> */}
        </div>
      ) : hasRestaurants ? (
        <Suspense
          fallback={
            <div className="py-8 text-center">Loading restaurant table...</div>
          }
        >
          <RestaurantTable />
        </Suspense>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Restaurant Management</CardTitle>
            <CardDescription>
              Add and manage restaurants on the Dashi platform. Create
              restaurant accounts to give owners access to their dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              No restaurants added yet. Click the &quot;Add Restaurant&quot;
              button to add your first restaurant.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
