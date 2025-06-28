/**
 * Restaurant Sales Page
 *
 * Displays sales data for the logged-in restaurant owner
 * This is a protected route that only restaurant users can access
 */
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import RestaurantSalesTable from "./components/sales-table";

/**
 * Restaurant Sales Page Component
 *
 * Displays sales data for the specific restaurant to track orders and revenue
 *
 * @returns {JSX.Element} The restaurant sales page
 */
export default function RestaurantSalesPage() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Check if user is authenticated and has restaurant role
  useEffect(() => {
    if (status === "authenticated") {
      if (session.user.role !== "RESTAURANT") {
        redirect("/denied-restaurant");
      }
      
      // Simulate loading state for placeholder
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
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
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex-1"
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
                  {[1, 2, 3, 4].map((cell) => (
                    <div
                      key={`${row}-${cell}`}
                      className="flex-1"
                    >
                      <Skeleton
                        className={`h-5 bg-muted-foreground/5 ${
                          cell === 1 ? "w-40" : 
                          cell === 2 ? "w-32" : 
                          cell === 3 ? "w-24" : 
                          "w-36"
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
            <div className="py-8 text-center">Loading sales data...</div>
          }
        >
          <RestaurantSalesTable />
        </Suspense>
      )}
    </div>
  );
}
