import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";
import { JSX } from "react/jsx-runtime";

/**
 * Admin Access Denied Page
 *
 * Displayed when a user without admin permissions attempts to access the admin section
 *
 * @returns {JSX.Element} The access denied page component
 */
export default function AccessDeniedPage(): JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4">
      <div className="text-center space-y-6 max-w-md">
        <ShieldAlert className="h-24 w-24 text-destructive mx-auto" />

        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Access Denied
        </h1>

        <p className="text-lg text-muted-foreground">
          You don&apos;t have permission to access the admin dashboard. Please
          contact your administrator if you believe this is an error.
        </p>

        <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0 justify-center">
          <Button asChild>
            <Link href="/">Return to Home</Link>
          </Button>

          <Button variant="outline" asChild>
            <Link href="/signin">Sign in as Admin</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
