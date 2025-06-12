/**
 * Restaurant Menu Page
 *
 * Displays a list of menu items for the logged-in restaurant
 * This is a protected route that only restaurant users can access
 */
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import MenuTable from "./components/menu-table";
import { trpc } from "@/lib/trpc/client";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Restaurant Menu Page Component
 *
 * Displays all menu items for the logged-in restaurant
 *
 * @returns {JSX.Element} The restaurant menu page
 */
export default function RestaurantMenuPage() {
  const { data: session, status } = useSession();
  const [restaurantId, setRestaurantId] = useState<string>("");
  
  // Check if user is authenticated and get their restaurant ID
  useEffect(() => {
    if (status === "authenticated") {
      if (session.user.role !== "RESTAURANT") {
        redirect("/denied-restaurant");
      }
      
      // Fetch the restaurant ID for the authenticated restaurant user
      const fetchRestaurantId = async () => {
        try {
          const result = await fetch("/api/auth/restaurant-id");
          const data = await result.json();
          if (data.restaurantId) {
            setRestaurantId(data.restaurantId);
          }
        } catch (error) {
          console.error("Error fetching restaurant ID:", error);
        }
      };
      
      fetchRestaurantId();
    } else if (status === "unauthenticated") {
      redirect("/signin");
    }
  }, [session, status]);
  
  // Check if there are menu items
  const { data: menuItemsCheck, isLoading } =
    trpc.restaurant.getMenuItems.useQuery(
      {
        restaurantId,
        page: 1,
        limit: 1,
      },
      {
        // Only run the query if we have a restaurant ID
        enabled: !!restaurantId,
        // Disable automatic refetching to avoid extra API calls
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      }
    );

  const hasMenuItems =
    !isLoading &&
    menuItemsCheck?.pagination.total &&
    menuItemsCheck.pagination.total > 0;

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6 bg-background p-6 md:p-8 rounded-md min-h-screen">
      {isLoading ? (
        <div className="w-full space-y-4">
          <div className="rounded-lg border">
            <div className="p-1">
              {/* Table header skeleton */}
              <div className="flex items-center p-4 bg-muted-foreground/5">
                <div className="flex-0 w-16">
                  <Skeleton className="h-5 w-10 bg-muted-foreground/5" />
                </div>
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <div
                    key={i}
                    className={`flex-1 ${i === 7 ? "flex-0 w-16" : ""}`}
                  >
                    <Skeleton className="h-5 w-32 bg-muted-foreground/5" />
                  </div>
                ))}
              </div>

              {/* Table rows skeleton */}
              {[1, 2, 3, 4, 5].map((row) => (
                <div key={row} className="flex items-center p-4 border-t">
                  <div className="flex-0 w-16">
                    <Skeleton className="h-12 w-12 bg-muted-foreground/5 rounded-md" />
                  </div>
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
        </div>
      ) : hasMenuItems ? (
        <Suspense
          fallback={
            <div className="py-8 text-center">Loading menu items...</div>
          }
        >
          <MenuTable restaurantId={restaurantId} />
        </Suspense>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Menu Items</CardTitle>
            <CardDescription>
              View and manage your restaurant&apos;s menu items
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              No menu items added yet. Click the &quot;Add Menu Item&quot;
              button to add your first menu item.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
