"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Clock, Plus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import Header from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";

// Restaurant type definition
interface Restaurant {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  cuisine: string;
  rating: number;
  reviews: number;
  deliveryTime: string;
  deliveryFee: string;
  address: string;
}

// Mock restaurant data
const mockRestaurants: Record<string, Restaurant> = {
  "pizza-palace": {
    id: "2",
    name: "Pizza Palace",
    description: "Authentic Italian pizzas made with fresh ingredients.",
    imageUrl:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop",
    cuisine: "Italian",
    rating: 4.8,
    reviews: 234,
    deliveryTime: "15-25 min",
    deliveryFee: "1.99",
    address: "123 Pizza Street, NY",
  },
  // Add other restaurants as needed
};

// Menu category and item type definitions
interface MenuCategory {
  id: string;
  name: string;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
}

// Mock menu items
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

const menuItems: Record<string, MenuItem[]> = {
  "pizza-palace": [
    {
      id: "1",
      name: "Margherita Pizza",
      description: "Fresh tomatoes, mozzarella, basil, olive oil",
      price: 14.99,
      imageUrl:
        "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?q=80&w=1974&auto=format&fit=crop",
      category: "popular",
    },
    {
      id: "2",
      name: "Pepperoni Pizza",
      description: "Pepperoni, mozzarella, tomato sauce",
      price: 16.99,
      imageUrl:
        "https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=1780&auto=format&fit=crop",
      category: "popular",
    },
    {
      id: "3",
      name: "Vegetarian Pizza",
      description: "Bell peppers, onions, mushrooms, olives, tomatoes",
      price: 15.99,
      imageUrl:
        "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?q=80&w=1925&auto=format&fit=crop",
      category: "pizza",
    },
    {
      id: "4",
      name: "BBQ Chicken Pizza",
      description: "Grilled chicken, BBQ sauce, red onions, cilantro",
      price: 17.99,
      imageUrl:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1981&auto=format&fit=crop",
      category: "pizza",
    },
    {
      id: "5",
      name: "Spaghetti Bolognese",
      description: "Classic pasta with meat sauce",
      price: 13.99,
      imageUrl:
        "https://images.unsplash.com/photo-1598866594230-a7c12756260f?q=80&w=1992&auto=format&fit=crop",
      category: "pasta",
    },
    {
      id: "6",
      name: "Caesar Salad",
      description: "Romaine lettuce, croutons, parmesan, Caesar dressing",
      price: 9.99,
      imageUrl:
        "https://images.unsplash.com/photo-1551248429-40975aa4de74?q=80&w=1990&auto=format&fit=crop",
      category: "salads",
    },
  ],
  // Add menu items for other restaurants as needed
};

/**
 * Restaurant menu page component
 *
 * @returns {JSX.Element} Restaurant menu page
 */
export default function RestaurantMenuPage() {
  const { slug } = useParams() as { slug: string };
  const [activeCategory, setActiveCategory] = useState("popular");
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [items, setItems] = useState<MenuItem[]>([]);

  // Simulate loading restaurant data
  useEffect(() => {
    const timer = setTimeout(() => {
      const foundRestaurant = mockRestaurants[slug] || null;
      setRestaurant(foundRestaurant);
      setItems(menuItems[slug] || []);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [slug]);

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  // Add item to cart
  const addToCart = () => {
    setCartItemCount((prev) => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl">Restaurant not found</h1>
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
        <div className="flex flex-col md:flex-row md:justify-between md:items-start px-4 py-6">
          {/* Left side: Restaurant name, rating, cuisine */}
          <div>
            <h1 className="text-2xl font-bold mb-1">{restaurant.name}</h1>
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <span>{restaurant.rating}</span>
              <span className="mx-1">({restaurant.reviews})</span>
              <span className="mx-1">•</span>
              <span>{restaurant.cuisine}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>{restaurant.address}</p>
            </div>
          </div>

          {/* Right side: Delivery time and fee */}
          <div className="mt-3 md:mt-0 flex flex-col items-end">
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
        <div className="border-t py-4 border-gray-200 px-4">
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
        <div className="px-4 py-6">
          <h2 className="text-xl font-bold mb-4">Popular Items</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items
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
                      <Button
                        size="sm"
                        variant="ghost"
                        className="bg-orange-500 text-white h-8 w-8 rounded-full p-0 flex items-center justify-center"
                        onClick={addToCart}
                      >
                        <span className="sr-only">Add to cart</span>
                        <Plus className="h-4 w-4" />
                        {/* <span className="text-lg">+</span> */}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </Container>

      {/* Cart Button */}
      {cartItemCount > 0 && (
        <div className="fixed bottom-6 left-0 right-0 flex justify-center">
          <Button className="bg-orange-500 hover:bg-orange-600 px-6 py-6 rounded-full shadow-lg">
            <ShoppingCart className="mr-2 h-5 w-5" />
            <span className="font-medium">View Cart ({cartItemCount})</span>
          </Button>
        </div>
      )}

      <Footer />
    </div>
  );
}
