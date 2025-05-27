"use client";

import { useState, useEffect } from "react";
import { Footer } from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { RestaurantGrid } from "@/components/restaurant/RestaurantGrid";
import { useTranslation } from "@/hooks/useTranslation";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Mock data for demonstration purposes - this would be replaced with actual API call
const mockRestaurants = [
  {
    id: "1",
    name: "Burger Joint",
    slug: "burger-joint",
    description:
      "The best burgers in town with a variety of options for everyone.",
    imageUrl:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=2069&auto=format&fit=crop",
    cuisine: "American",
    rating: 4.5,
    reviews: 158,
    deliveryTime: "20-30 min",
    deliveryFee: "2.99",
  },
  {
    id: "2",
    name: "Pizza Palace",
    slug: "pizza-palace",
    description: "Authentic Italian pizzas made with fresh ingredients.",
    imageUrl:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop",
    cuisine: "Italian",
    rating: 4.8,
    reviews: 234,
    deliveryTime: "15-25 min",
    deliveryFee: "1.99",
    discount: "20% OFF",
  },
  {
    id: "3",
    name: "Sushi Express",
    slug: "sushi-express",
    description: "Fresh sushi and Japanese cuisine delivered to your door.",
    imageUrl:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=2070&auto=format&fit=crop",
    cuisine: "Japanese",
    rating: 4.9,
    reviews: 312,
    deliveryTime: "25-40 min",
    deliveryFee: "3.99",
    specialTag: "FREE DELIVERY",
  },
  {
    id: "4",
    name: "Taco Corner",
    slug: "taco-corner",
    description: "Authentic Mexican street food and tacos.",
    imageUrl:
      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=2080&auto=format&fit=crop",
    cuisine: "Mexican",
    rating: 4.6,
    reviews: 178,
    deliveryTime: "15-30 min",
    deliveryFee: "2.49",
  },
  {
    id: "5",
    name: "Green Bowl",
    slug: "green-bowl",
    description: "Healthy salads and bowls for the health-conscious customer.",
    imageUrl:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop",
    cuisine: "Healthy",
    rating: 4.7,
    reviews: 142,
    deliveryTime: "20-35 min",
    deliveryFee: "1.99",
    discount: "10% OFF",
  },
  {
    id: "6",
    name: "Pasta House",
    slug: "pasta-house",
    description: "Homemade Italian pasta and sauces.",
    imageUrl:
      "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=2070&auto=format&fit=crop",
    cuisine: "Italian",
    rating: 4.4,
    reviews: 198,
    deliveryTime: "25-40 min",
    deliveryFee: "2.99",
  },
];

/**
 * HomePage component displaying the list of restaurants
 *
 * @returns {JSX.Element} The homepage component
 */
export default function Home() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [restaurants, setRestaurants] = useState<typeof mockRestaurants>([]);
  const [activeFilter, setActiveFilter] = useState("all");

  // Simulate API loading - would be replaced with real data fetching
  useEffect(() => {
    const timer = setTimeout(() => {
      setRestaurants(mockRestaurants);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <div className="w-full bg-orange-500 text-white">
        <Container>
          <div className="py-16 md:py-20 flex flex-col items-center justify-center text-center">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                {t("home.heroTitle", "Delicious Food Delivered To Your Door")}
              </h1>
              <p className="text-lg mb-8">
                {t(
                  "home.heroSubtitle",
                  "Order from your favorite restaurants and track your delivery in real-time"
                )}
              </p>

              {/* Search Bar */}
              <div className="flex flex-col md:flex-row justify-center">
                {" "}
                <div className="relative w-full md:w-[280px] md:mr-2">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ">
                    <Search className="w-5 h-5" />
                  </div>
                  <Input
                    placeholder={t(
                      "home.searchPlaceholder",
                      "Search for restaurants or foods"
                    )}
                    className="w-full pl-10 pr-4 py-4 bg-white text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                </div>
                <Button className="mt-2 md:mt-0 bg-orange-600 hover:bg-orange-700 transition-colors text-white font-medium py-3 px-6 rounded-md">
                  {t("home.searchButton", "Search")}
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <main className="flex-1 py-10">
        <Container>
          {/* Categories Section */}
          <div className="mb-10">
            <h2 className="text-xl font-bold mb-5">
              {t("home.categories", "Categories")}
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-8 gap-4 w-full">
              {/* Pizza */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-red-500"
                  >
                    <path d="M15 11h.01"></path>
                    <path d="M11 15h.01"></path>
                    <path d="M16 16h.01"></path>
                    <path d="m2 16 20 6-6-20A20 20 0 0 0 2 16"></path>
                    <path d="M5.71 17.11a17.04 17.04 0 0 1 11.4-11.4"></path>
                  </svg>
                </div>{" "}
                <span className="text-sm">
                  {t("home.categoryPizza", "Pizza")}
                </span>
              </div>

              {/* Coffee */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-yellow-700"
                  >
                    <path d="M17 8h1a4 4 0 1 1 0 8h-1"></path>
                    <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"></path>
                    <line x1="6" y1="2" x2="6" y2="4"></line>
                    <line x1="10" y1="2" x2="10" y2="4"></line>
                    <line x1="14" y1="2" x2="14" y2="4"></line>
                  </svg>
                </div>{" "}
                <span className="text-sm">
                  {t("home.categoryCoffee", "Coffee")}
                </span>
              </div>

              {/* Salads */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-green-500"
                  >
                    <path d="M7 21h10"></path>
                    <path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z"></path>
                    <path d="M11.38 12a2.4 2.4 0 0 1-.4-4.77 2.4 2.4 0 0 1 3.2-2.77 3.2 3.2 0 0 1 3.47-1.63 2.4 2.4 0 0 1 2.33 2 3.6 3.6 0 0 1 1.82 1.47"></path>
                  </svg>
                </div>{" "}
                <span className="text-sm">
                  {t("home.categorySalads", "Salads")}
                </span>
              </div>

              {/* Dessert */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-blue-500"
                  >
                    <path d="m8 3 4 8 5-5 5 15H2L8 3z"></path>
                  </svg>
                </div>{" "}
                <span className="text-sm">
                  {t("home.categoryDessert", "Dessert")}
                </span>
              </div>

              {/* Burgers */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-orange-500"
                  >
                    <path d="M3 18h18M3 14h18M3 6h18M3 10h18"></path>
                    <circle cx="12" cy="4" r="1"></circle>
                    <circle cx="12" cy="8" r="1"></circle>
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="12" cy="16" r="1"></circle>
                  </svg>
                </div>{" "}
                <span className="text-sm">
                  {t("home.categoryBurgers", "Burgers")}
                </span>
              </div>

              {/* Sandwiches */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-purple-500"
                  >
                    <path d="M3 11v3a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-3"></path>
                    <path d="M12 19H4a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-3.83"></path>
                    <path d="m3 11 7.77-6.04a2 2 0 0 1 2.46 0L21 11H3Z"></path>
                    <path d="M12.97 19.77 7 15h12.5l-3.75 4.5a2 2 0 0 1-2.78.27Z"></path>
                  </svg>
                </div>{" "}
                <span className="text-sm">
                  {t("home.categorySandwiches", "Sandwiches")}
                </span>
              </div>
            </div>
          </div>
          {/* Restaurants Section with Filters */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">
              {t("home.nearYou", "Restaurants Near You")}
            </h2>{" "}
            {/* Filter Badges */}
            <div className="flex overflow-x-auto gap-4 mb-6 pb-2 px-1">
              <Badge
                variant="outline"
                className={`
                  px-4 py-2 text-sm font-medium cursor-pointer transition-all rounded-full border-none
                  ${
                    activeFilter === "all"
                      ? "bg-orange-500 text-white hover:bg-orange-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }
                `}
                onClick={() => setActiveFilter("all")}
              >
                {t("home.filterAll", "All")}
              </Badge>
              <Badge
                variant="outline"
                className={`
                  px-4 py-2 text-sm font-medium cursor-pointer transition-all rounded-full border-none
                  ${
                    activeFilter === "fastest"
                      ? "bg-orange-500 text-white hover:bg-orange-600"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }
                `}
                onClick={() => setActiveFilter("fastest")}
              >
                {t("home.filterFastest", "Fastest Delivery")}
              </Badge>
              <Badge
                variant="outline"
                className={`
                  px-4 py-2 text-sm font-medium cursor-pointer transition-all rounded-full border-none
                  ${
                    activeFilter === "topRated"
                      ? "bg-orange-500 text-white hover:bg-orange-600"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }
                `}
                onClick={() => setActiveFilter("topRated")}
              >
                {t("home.filterTopRated", "Top Rated")}
              </Badge>
              <Badge
                variant="outline"
                className={`
                  px-4 py-2 text-sm font-medium cursor-pointer transition-all rounded-full border-none
                  ${
                    activeFilter === "price"
                      ? "bg-orange-500 text-white hover:bg-orange-600"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }
                `}
                onClick={() => setActiveFilter("price")}
              >
                {t("home.filterPrice", "Price")}
              </Badge>
              <Badge
                variant="outline"
                className={`
                  px-4 py-2 text-sm font-medium cursor-pointer transition-all rounded-full border-none
                  ${
                    activeFilter === "promotions"
                      ? "bg-orange-500 text-white hover:bg-orange-600"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }
                `}
                onClick={() => setActiveFilter("promotions")}
              >
                {t("home.filterPromotions", "Promotions")}
              </Badge>
            </div>
            <RestaurantGrid restaurants={restaurants} isLoading={isLoading} />
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
