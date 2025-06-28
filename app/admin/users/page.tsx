
/**
 * Admin Users Page
 *
 * Displays a list of all users with options to add and manage user accounts
 * This is a protected route that only admin users can access
 */
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/hooks/useTranslation";
import UsersTable from "./components/users-table"
import { JSX } from "react/jsx-runtime";

/**
 * Admin Users Page Component
 *
 * Displays a list of users with options to add and manage user accounts
 *
 * @returns {JSX.Element} The user management page
 */
export default function UsersPage(): JSX.Element {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { t } = useTranslation();
  
  // Check if user is authenticated and has admin role
  useEffect(() => {
    if (status === "authenticated") {
      if (session.user.role !== "ADMIN") {
        redirect("/denied");
      }
      
      // Simulate loading state for initial load
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (status === "unauthenticated") {
      redirect("/signin");
    }
  }, [session, status]);

  if (status === "loading") {
    return <div className="py-8 text-center">{t("common.loading")}</div>;
  }

  return (
    <div className="space-y-6 bg-background p-6 md:p-8 rounded-md min-h-screen">
      {isLoading ? (
        <div className="w-full space-y-4">
          <div className="rounded-lg border">
            <div className="p-1">
              {/* Table header skeleton */}
              <div className="flex items-center p-4 bg-muted-foreground/5">
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
        <Suspense fallback={<div className="py-8 text-center">{t("common.loading", "Loading...")}</div>}>
          <UsersTable />
        </Suspense>
      )}
    </div>
  );
}
