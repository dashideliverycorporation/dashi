"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

/**
 * Custom 404 Not Found page component
 * Displays when a route doesn't match any page in the app
 * Provides navigation options back to the app
 * @returns Not Found page component
 */
export default function NotFound() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <>
    <div className="container mx-auto py-12 flex flex-col items-center justify-center min-h-[80vh]">
      <div className="text-center space-y-6 max-w-md">
        {/* SVG or icon */}
        <div className="text-orange-500 flex justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="120"
            height="120"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="2" width="20" height="20" rx="5" />
            <path d="M9 10h.01" />
            <path d="M15 10h.01" />
            <path d="M9.5 15a3.5 3.5 0 0 1 5 0" />
          </svg>
        </div>

        <h1 className="text-4xl font-bold text-gray-900">
          {t("notFound.title", "Page Not Found")} 
        </h1>
        
        <p className="text-gray-600 text-lg">
          {t(
            "notFound.message",
            "Oops! The page you're looking for doesn't exist or has been moved."
          )}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("notFound.back", "Go Back")}
          </Button>
          
          <Button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600"
          >
            <Home className="h-4 w-4" />
            {t("notFound.home", "Return to Homepage")}
          </Button>
        </div>
      </div>
    </div>
    </>
  );
}
