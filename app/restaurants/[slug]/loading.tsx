import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/layout/Container";
import Header from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

/**
 * Loading component for restaurant menu page
 *
 * @returns {JSX.Element} Loading state UI
 */
export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Image Skeleton */}
      <div className="w-full h-64 relative">
        <Skeleton className="h-full w-full" />
      </div>

      {/* Restaurant Info Skeleton */}
      <Container className="bg-white -mt-10 relative rounded-t-3xl shadow-sm">
        <div className="px-4 py-6">
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-4 w-1/2 mb-3" />
          <Skeleton className="h-4 w-2/3 mb-2" />
          <Skeleton className="h-4 w-1/4 mb-2" />
        </div>

        {/* Category Navigation Skeleton */}
        <div className="border-b border-gray-200 px-4">
          <div className="flex overflow-x-auto gap-4 pb-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-10 w-24 rounded-full" />
            ))}
          </div>
        </div>

        {/* Menu Items Skeleton */}
        <div className="px-4 py-6">
          <Skeleton className="h-7 w-40 mb-6" />
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex border-b border-gray-100 pb-6">
                <div className="flex-1 pr-4">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-9 w-16 rounded-md" />
                  </div>
                </div>
                <Skeleton className="w-24 h-24 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </Container>

      <Footer />
    </div>
  );
}
