
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { JSX } from "react/jsx-runtime";
import { RestaurantUserFormModal } from "./components/user-form-modal";

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
        <RestaurantUserFormModal/>
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
