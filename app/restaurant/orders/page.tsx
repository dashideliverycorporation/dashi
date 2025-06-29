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
import { Card, CardContent } from "@/components/ui/card";
import OrdersTable from "./components/orders-table";
import { useTranslation } from "@/hooks/useTranslation";

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
  const { t } = useTranslation();
  
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
    return <div>{t('common.loading')}</div>;
  }

  return (
    <div className="space-y-6 bg-background p-6 md:p-8 rounded-md min-h-screen">
      {isLoading ? (
        <div className="w-full space-y-4">
          {/* Header skeleton */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <Skeleton className="h-8 w-32" />
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <Skeleton className="h-10 w-full md:w-[180px]" />
              <Skeleton className="h-10 w-full md:w-80" />
              <Skeleton className="h-10 w-full md:w-32" />
            </div>
          </div>

          {/* Status summary skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-muted/20 p-3 md:p-4 rounded-lg border">
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <Skeleton className="h-3 md:h-4 w-12 md:w-16" />
                    <Skeleton className="h-6 md:h-8 w-6 md:w-8" />
                  </div>
                  <Skeleton className="h-7 w-7 md:h-9 md:w-9 rounded-full" />
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table skeleton - only show on md and larger screens */}
          <div className="hidden md:block rounded-lg border">
            <div className="p-1">
              {/* Table header skeleton */}
              <div className="flex items-center p-4 bg-muted-foreground/5">
                {/* Column skeletons */}
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <div key={i} className="flex-1">
                    <Skeleton className="h-5 w-32 bg-muted-foreground/5" />
                  </div>
                ))}
              </div>

              {/* Table rows skeleton */}
              {[1, 2, 3, 4, 5].map((row) => (
                <div key={row} className="flex items-center p-4 border-t">
                  {/* Cell skeletons */}
                  {[1, 2, 3, 4, 5, 6, 7].map((cell) => (
                    <div
                      key={`${row}-${cell}`}
                      className="flex-1"
                    >
                      <Skeleton
                        className={`h-5 bg-muted-foreground/5 ${
                          cell === 1 ? "w-24" : 
                          cell === 2 ? "w-20" : 
                          cell === 3 ? "w-28" : 
                          cell === 4 ? "w-16" : 
                          cell === 5 ? "w-20" :
                          cell === 6 ? "w-32" :
                          "w-24"
                        }`}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile cards skeleton - only show on mobile screens */}
          <div className="md:hidden space-y-3">
            {[1, 2, 3, 4, 5].map((card) => (
              <Card key={card}>
                <CardContent className="p-3">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                    <div className="space-y-1.5">
                      <Skeleton className="h-3 w-28" />
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <div className="flex space-x-2 pt-2">
                      <Skeleton className="h-7 w-20" />
                      <Skeleton className="h-7 w-28" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Suspense
          fallback={
            <div className="py-8 text-center">{t('orders.loading')}</div>
          }
        >
          <OrdersTable restaurantId={restaurantId} />
        </Suspense>
      )}
    </div>
  );
}
