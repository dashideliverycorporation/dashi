"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Clock, MapPin, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import Header from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/components/cart/use-cart";
import CartSheet from "@/components/cart/CartSheet";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { trpc } from "@/lib/trpc/client";

// Menu category and item type definitions
interface MenuCategory {
  id: string;
  name: string;
}

// Menu categories for filtering
const menuCategories: MenuCategory[] = [
  {
    id: "popular",
    name: "Popular",
  },
  {
    id: "pizza",
    name: "Pizza",
  },
  {
    id: "pasta",
    name: "Pasta",
  },
  {
    id: "salads",
    name: "Salads",
  },
  {
    id: "drinks",
    name: "Drinks",
  },
  {
    id: "desserts",
    name: "Desserts",
  },
];

/**
 * Restaurant menu page component
 *
 * @returns {JSX.Element} Restaurant menu page
 */
export default function RestaurantMenuPage() {
  const { slug } = useParams() as { slug: string };
  const [activeCategory, setActiveCategory] = useState("popular");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { itemCount } = useCart();
  
  // Fetch restaurant data using tRPC
  const { data: restaurant, isLoading, error } = trpc.restaurant.getRestaurantBySlug.useQuery(
    { slug },
    {
      enabled: !!slug,
      staleTime: 1000 * 60 * 5, // 5 minutes
    }
  );
  // Handle category change
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl">Error loading restaurant</h1>
        <p className="text-muted-foreground">{error.message}</p>
        <Button asChild>
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl">Restaurant not found</h1>
        <Button asChild>
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      {/* Hero Image */}
      <div className="relative w-full h-[300px] lg:h-[400px]">
        <Link
          href="/"
          className="absolute top-4 left-4 z-10 bg-white p-2 rounded-full"
        >
          <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6" />
        </Link>
        <Image
          src={restaurant.imageUrl}
          alt={restaurant.name}
          fill
          className="object-cover"
          priority
        />
      </div>
      {/* Restaurant Info */}
      <Container>
        <div className="flex justify-between md:flex-row md:justify-between md:items-start py-6">
          {/* Left side: Restaurant name, rating, cuisine */}
          <div>
            <h1 className="text-2xl font-bold mb-1">{restaurant.name}</h1>
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-0.5 text-yellow-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>{restaurant.rating}</span>
              <span className="mx-1">({restaurant.reviews})</span>
              <span className="mx-1">•</span>
              <span>{restaurant.cuisine}</span>
              {restaurant.discountTag && (
                <>
                  <span className="mx-1">•</span>
                  <span className="text-orange-500 font-medium">{restaurant.discountTag}</span>
                </>
              )}
            </div>
            <div className="text-sm text-muted-foreground flex items-center">
              <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5 mr-1" />
              <p>{restaurant.address}</p>
            </div>
          </div>

          {/* Right side: Delivery time and fee */}
          <div className="mt-10 md:mt-0 flex flex-col items-end">
            <div className="flex items-center text-sm text-muted-foreground mb-1">
              <Clock className="h-4 w-4 mr-1" />
              <span>{restaurant.deliveryTime}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              <span>Delivery fee: ${restaurant.deliveryFee}</span>
            </div>
          </div>
        </div>

        {/* Category Navigation */}
        <div className="border-t py-4 border-gray-200">
          <div className="flex overflow-x-auto gap-4 pb-3">
            {menuCategories.map((category) => (
              <Badge
                key={category.id}
                variant="outline"
                className={`
                  px-4 py-2 text-sm font-medium cursor-pointer transition-all rounded-full border-none whitespace-nowrap
                  ${
                    activeCategory === category.id
                      ? "bg-orange-500 text-white hover:bg-orange-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }
                `}
                onClick={() => handleCategoryChange(category.id)}
              >
                {category.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <div className="py-6">
          <h2 className="text-xl font-bold mb-4">Popular Items</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {restaurant.menuItems
              .filter(
                (item) =>
                  item.category === activeCategory ||
                  activeCategory === "popular"
              )
              .map((item) => (
                <div key={item.id} className="flex items-start pb-4">
                  <div className="w-24 h-24 lg:w-22 lg:h-22 relative rounded-lg overflow-hidden mr-4 flex-shrink-0">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-base mb-1">{item.name}</h3>
                    <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        ${item.price.toFixed(2)}
                      </span>
                      <AddToCartButton
                        item={{
                          id: item.id,
                          name: item.name,
                          price: item.price,
                          imageUrl: item.imageUrl,
                        }}
                        restaurantId={restaurant.id}
                        restaurantName={restaurant.name}
                        deliveryFee={parseFloat(restaurant.deliveryFee as string)}
                        
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </Container>{" "}
      {/* Cart Button */}
      {itemCount > 0 && (
        <div className="fixed bottom-6 left-0 right-0 flex justify-center">
          {" "}
          <Button
            className="bg-orange-500 hover:bg-orange-600 hover:shadow-xl px-6 py-6 rounded-full shadow-lg transition-all duration-200 active:scale-95"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            <span className="font-medium">View Cart ({itemCount})</span>
          </Button>
        </div>
      )}{" "}
      <CartSheet open={isCartOpen} onOpenChange={setIsCartOpen} />
      <Footer />
    </div>
  );
}
