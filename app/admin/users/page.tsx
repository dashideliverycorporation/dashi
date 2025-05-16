import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus } from "lucide-react";
import { JSX } from "react/jsx-runtime";

/**
 * User Management Page
 *
 * Displays a list of users with options to add and manage user accounts
 *
 * @returns {JSX.Element} The user management page
 */
export default function UsersPage(): JSX.Element {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground mt-2">
            Manage user accounts on the Dashi platform
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/users/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Restaurant User
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            Add and manage user accounts for restaurant managers and
            administrators.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            No users added yet. Click the &quot;Add Restaurant User&quot; button to add
            your first restaurant user.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
