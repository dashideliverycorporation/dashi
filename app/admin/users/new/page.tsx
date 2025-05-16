import { UserForm } from "@/app/admin/users/components/user-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { JSX } from "react/jsx-runtime";

/**
 * Add New Restaurant User Page
 *
 * Page for administrators to add new users with restaurant manager role
 *
 * @returns {JSX.Element} The add restaurant user page
 */
export default function AddRestaurantUserPage(): JSX.Element {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" asChild className="h-8 w-8">
          <Link href="/admin/users" aria-label="Go back to users">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Add Restaurant User
          </h1>
          <p className="text-muted-foreground mt-2">
            Create a new user account with restaurant management access
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>
            Enter the details for the new restaurant user. Required fields are
            marked with a red asterisk (<span className="text-red-500">*</span>
            ).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserForm />
        </CardContent>
      </Card>
    </div>
  );
}
