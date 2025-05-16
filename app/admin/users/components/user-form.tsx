"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createRestaurantUserSchema } from "@/server/schemas/user.schema";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import type { CreateRestaurantUserInput } from "@/server/schemas/user.schema";
import { toastNotification } from "@/components/custom/toast-notification";
import { JSX } from "react/jsx-runtime";

/**
 * Restaurant User Form Component
 *
 * Form for creating users with restaurant role
 *
 * @returns {JSX.Element} The restaurant user form component
 */
export function UserForm(): JSX.Element {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch list of restaurants for the dropdown
  const { data: restaurants, isLoading: isLoadingRestaurants } =
    trpc.restaurant.getAllRestaurants.useQuery();

  // Initialize form with zod validation
  const form = useForm<CreateRestaurantUserInput>({
    resolver: zodResolver(createRestaurantUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      restaurantId: "", // This will be filled from the dropdown in the next subtask
    },
  });

  // Get the user creation mutation from tRPC
  const createUserMutation = trpc.user.createRestaurantUser.useMutation({
    onSuccess: () => {
      setSuccess("Restaurant user created successfully");
      setIsLoading(false);
      // Reset form
      form.reset();
      // Show toast notification
      toastNotification.success(
        "User created successfully",
        "Redirecting to users list..."
      );
      // Redirect to users list after a short delay
      setTimeout(() => {
        router.push("/admin/users");
      }, 2000);
    },
    onError: (error) => {
      setError(error.message || "Failed to create restaurant user");
      setIsLoading(false);
      toastNotification.error(
        "Failed to create user",
        error.message || "Please check the form and try again"
      );
    },
  });

  /**
   * Handle form submission
   *
   * @param {CreateRestaurantUserInput} values - Form values
   */
  const onSubmit = async (values: CreateRestaurantUserInput): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      // Call the mutation to create the restaurant user
      createUserMutation.mutate(values);
    } catch (err) {
      setIsLoading(false);
      setError("An unexpected error occurred");
      console.error("Error submitting form:", err);
    }
  };

  return (
    <div className="max-w-2xl">
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 bg-green-50 border-green-500">
          <AlertDescription className="text-green-800">
            {success}
          </AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="text-sm text-muted-foreground mb-4">
            Fields marked with <span className="text-red-500">*</span> are
            required.
          </div>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Full Name <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Restaurant manager's name" {...field} />
                </FormControl>
                <FormDescription>
                  Enter the full name of the restaurant manager.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Email <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="manager@example.com"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Email address for login and notifications.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Password <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Minimum 8 characters"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Must be at least 8 characters long.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="restaurantId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Restaurant <span className="text-red-500">*</span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isLoadingRestaurants}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a restaurant" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isLoadingRestaurants ? (
                      <SelectItem value="loading" disabled>
                        Loading restaurants...
                      </SelectItem>
                    ) : restaurants && restaurants.length > 0 ? (
                      restaurants.map((restaurant) => (
                        <SelectItem key={restaurant.id} value={restaurant.id}>
                          {restaurant.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        No restaurants available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the restaurant this user will manage.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-end gap-4 pt-4">
            <Button
              className="cursor-pointer"
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/users")}
              disabled={isLoading}
            >
              Cancel
            </Button>{" "}
            <Button
              className="cursor-pointer"
              type="submit"
              disabled={isLoading || isLoadingRestaurants}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create User"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
