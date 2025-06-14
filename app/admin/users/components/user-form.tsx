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
import { Loader2, Eye, EyeOff } from "lucide-react"; // Import Eye and EyeOff icons
import type { CreateRestaurantUserInput } from "@/server/schemas/user.schema";
import { toastNotification } from "@/components/custom/toast-notification";
import { JSX } from "react/jsx-runtime";

/**
 * Restaurant User Form Component
 *
 * Form for creating users with restaurant role
 * @param {object} props - Component props
 * @param {Function} [props.setOpen] - function to update the state
 * @returns {JSX.Element} The restaurant user form component
 */
export function UserForm({
  setOpen,
}: { setOpen: (open: boolean) => void }): JSX.Element {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false); // Add state for password visibility

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
      phoneNumber: "",
      restaurantId: "",
    },
  });
  // Get the user creation mutation from tRPC
  const createUserMutation = trpc.user.createRestaurantUser.useMutation({
    onSuccess: () => {
      toastNotification.success(
        "User created successfully",
        "You have added a new user, you will be redirected to the users list"
      );
      setIsLoading(false);
      // Reset form
      form.reset();
        setTimeout(() => {
          router.refresh();
          setOpen(false);
        }, 2000);
    },
    onError: (error) => {
      toastNotification.error(
        "Failed to create user",
        `${
          error.message || "Please check the form and try again"
        }! Please try again`
      );
      setIsLoading(false);
    },
  });

  /**
   * Toggle password visibility
   */
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  /**
   * Handle form submission
   *
   * @param {CreateRestaurantUserInput} values - Form values
   */
  const onSubmit = async (values: CreateRestaurantUserInput): Promise<void> => {
    try {
      setIsLoading(true);
      // Call the mutation to create the restaurant user
      createUserMutation.mutate(values);
    } catch (err) {
      setIsLoading(false);
      console.error("Error submitting form:", err);
    }
  };
  return (
    <div className="max-w-2xl">
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
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Phone Number <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="+243 456 7890" type="tel" {...field} />
                </FormControl>
                <FormDescription>
                  Contact phone number for the restaurant manager.
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
                <div className="relative">
                  <FormControl>
                    <Input
                      placeholder="Minimum 8 characters"
                      type={showPassword ? "text" : "password"}
                      {...field}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                    onClick={togglePasswordVisibility}
                    tabIndex={-1}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
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
             onClick={() => {
                form.reset();
                setOpen(false);
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
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
