/**
 * Restaurant Orders Page
 *
 * Displays a list of orders for the logged-in restaurant
 * This is a protected route that only restaurant users can access
 */
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import OrdersTable from "./components/orders-table";

/**
 * Restaurant Orders Page Component
 *
 * Displays all orders for the logged-in restaurant
 *
 * @returns {JSX.Element} The restaurant orders page
 */
export default function RestaurantOrdersPage() {
  const { data: session, status } = useSession();
  const [restaurantId, setRestaurantId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
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
            // For the placeholder, we'll simulate a loading state
            setTimeout(() => {
              setIsLoading(false);
            }, 1500);
          }
        } catch (error) {
          console.error("Error fetching restaurant ID:", error);
          setIsLoading(false);
        }
      };
      
      fetchRestaurantId();
    } else if (status === "unauthenticated") {
      redirect("/signin");
    }
  }, [session, status]);

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
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`flex-1 ${i === 5 ? "flex-0 w-16" : ""}`}
                  >
                    <Skeleton className="h-5 w-32 bg-muted-foreground/5" />
                  </div>
                ))}
              </div>

              {/* Table rows skeleton */}
              {[1, 2, 3, 4, 5].map((row) => (
                <div key={row} className="flex items-center p-4 border-t">
                  <div className="flex-0 w-16">
                    <Skeleton className="h-5 w-10 bg-muted-foreground/5" />
                  </div>
                  {[1, 2, 3, 4, 5].map((cell) => (
                    <div
                      key={`${row}-${cell}`}
                      className={`flex-1 ${cell === 5 ? "flex-0 w-16" : ""}`}
                    >
                      <Skeleton
                        className={`h-5 bg-muted-foreground/5 ${
                          cell === 1 ? "w-24" : 
                          cell === 2 ? "w-32" : 
                          cell === 3 ? "w-20" : 
                          cell === 4 ? "w-28" :
                          "w-16"
                        }`}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <Suspense
          fallback={
            <div className="py-8 text-center">Loading orders...</div>
          }
        >
          <OrdersTable restaurantId={restaurantId} />
        </Suspense>
      )}
    </div>
  );
}
