import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

/**
 * Access Denied Page for Restaurant Dashboard
 *
 * Displayed when a user tries to access the restaurant dashboard without the proper role.
 */
export default function RestaurantAccessDeniedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <div className="max-w-md">
        <AlertTriangle className="mx-auto h-16 w-16 text-amber-500 mb-6" />
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Access Denied
        </h1>
        <p className="mb-8 text-muted-foreground">
          You don&apos;t have permission to access the restaurant dashboard. This
          area is only accessible to restaurant account holders.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="default">
            <Link href="/">Return to Home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/signin">Sign In</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
