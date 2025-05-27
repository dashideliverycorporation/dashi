"use client";

import React from "react";
import { RestaurantCard } from "@/components/restaurant/RestaurantCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/hooks/useTranslation";
import { JSX } from "react/jsx-runtime";

interface RestaurantGridProps {
  /**
   * List of restaurant data to display in the grid
   */
  restaurants?: Array<{
    id: string;
    name: string;
    slug?: string;
    description?: string;
    imageUrl?: string;
    cuisine?: string;
    rating?: number;
    reviews?: number;
    deliveryTime?: string;
    deliveryFee?: string;
    discount?: string;
    specialTag?: string;
  }>;
  /**
   * Whether the grid is in loading state
   */
  isLoading?: boolean;
}

/**
 * RestaurantGrid component that displays restaurants in a responsive grid
 * - 1 column on mobile
 * - 2 columns on tablet (sm breakpoint)
 * - 3 columns on desktop (lg breakpoint)
 *
 * @param {RestaurantGridProps} props - Component props
 * @returns {JSX.Element} The restaurant grid component
 */
export function RestaurantGrid({
  restaurants = [],
  isLoading = false,
}: RestaurantGridProps): JSX.Element {
  const { t } = useTranslation();

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={`skeleton-${index}`} className="flex flex-col">
            <Skeleton className="w-full aspect-video rounded-md mb-2" />
            <Skeleton className="w-3/4 h-6 mb-2" />
            <Skeleton className="w-full h-4" />
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (!restaurants || restaurants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="bg-orange-100 rounded-full p-6 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-orange-500"
          >
            <path d="M17 12a5 5 0 0 0-10 0" />
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="3" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold mb-2">
          {t("home.noRestaurants", "No restaurants available")}
        </h2>
        <p className="text-muted-foreground max-w-md">
          {t(
            "home.checkBackSoon",
            "We're working on adding more restaurants to our platform. Please check back soon!"
          )}
        </p>
      </div>
    );
  }

  // Populated grid
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {restaurants.map((restaurant) => (
        <RestaurantCard
          key={restaurant.id}
          id={restaurant.id}
          name={restaurant.name}
          slug={restaurant.slug}
          description={restaurant.description}
          imageUrl={restaurant.imageUrl}
          cuisine={restaurant.cuisine}
          rating={restaurant.rating}
          reviews={restaurant.reviews}
          deliveryTime={restaurant.deliveryTime}
          deliveryFee={restaurant.deliveryFee}
          discount={restaurant.discount}
          specialTag={restaurant.specialTag}
        />
      ))}
    </div>
  );
}

export default RestaurantGrid;
