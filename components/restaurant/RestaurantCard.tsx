"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { JSX } from "react/jsx-runtime";

interface RestaurantCardProps {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  imageUrl?: string;
  className?: string;
  cuisine?: string;
  rating?: number;
  reviews?: number;
  deliveryTime?: string;
  deliveryFee?: string;
  discount?: string;
  specialTag?: string;
}

/**
 * RestaurantCard component for displaying individual restaurant listings
 *
 * @param {RestaurantCardProps} props - The component props
 * @returns {JSX.Element} The restaurant card component
 */
export function RestaurantCard({
  id,
  name,
  slug,
  description,
  imageUrl,
  className,
  cuisine,
  rating,
  reviews,
  deliveryTime,
  deliveryFee,
  discount,
  specialTag,
}: RestaurantCardProps): JSX.Element {
  return (
    <Link href={`/restaurants/${slug || id}`} className="block h-full">
      <Card
        className={cn(
          "h-full transition-all hover:shadow-lg hover:-translate-y-0.5 border border-gray-200 overflow-hidden",
          className
        )}
      >
        <div className="relative w-full h-48 bg-muted">
          {/* Discount or special tag display */}
          {(discount || specialTag) && (
            <div className="absolute top-2 left-2 z-10 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded">
              {discount || specialTag}
            </div>
          )}

          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
              className="object-cover w-full h-full"
              priority
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
              <Image
                src="/empty-restaurant.svg"
                alt="Restaurant"
                width={48}
                height={48}
                className="opacity-50"
              />
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg line-clamp-1">{name}</h3>
            {rating && (
              <div className="bg-green-50 text-green-700 text-sm font-medium py-0.5 px-2 rounded flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-0.5 text-green-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {rating}
              </div>
            )}
          </div>

          <div className="flex items-center text-sm text-muted-foreground mb-4">
            {cuisine && <span>{cuisine}</span>}
            {reviews && (
              <>
                <span className="mx-1">•</span>
                <span>{reviews} reviews</span>
              </>
            )}
          </div>

          {deliveryTime && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{deliveryTime}</span>
              </div>

              {deliveryFee && (
                <div className="text-sm text-right">
                  ${deliveryFee} delivery
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

export default RestaurantCard;
