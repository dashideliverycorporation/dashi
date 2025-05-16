"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createRestaurantSchema } from "@/server/schemas/restaurant.schema";
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
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import type { CreateRestaurantInput } from "@/server/schemas/restaurant.schema";
import { JSX } from "react/jsx-runtime";
import { toastNotification } from "@/components/custom/toast-notification";

/**
 * Restaurant Form Component
 *
 * Form for creating or updating restaurant information
 *
 * @returns {JSX.Element} The restaurant form component
 */
export function RestaurantForm(): JSX.Element {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Initialize form with zod validation
  const form = useForm<CreateRestaurantInput>({
    resolver: zodResolver(createRestaurantSchema),
    defaultValues: {
      name: "",
      description: "",
      email: "",
      phoneNumber: "",
      address: "",
      serviceArea: "",
    },
  });

  // Get the restaurant creation mutation from tRPC
  const createRestaurantMutation = trpc.restaurant.createRestaurant.useMutation(
    {
      onSuccess: () => {
        setSuccess("Restaurant created successfully");
        setIsLoading(false);
        // Reset form
        form.reset();
        // Redirect to restaurants list after a short delay
        setTimeout(() => {
          router.push("/admin/restaurants");
        }, 2000);
      },
      onError: (error) => {
        setError(error.message || "Failed to create restaurant");
        setIsLoading(false);
      },
    }
  );

  /**
   * Handle form submission
   *
   * @param {CreateRestaurantInput} values - Form values
   */
  const onSubmit = async (values: CreateRestaurantInput): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      // Call the mutation to create the restaurant
      createRestaurantMutation.mutate(values);
      toastNotification.success("Restaurant created successfully", 'Redirecting...');
    } catch (err) {
      toastNotification.error("Failed to create restaurant", 'Please try again');
      setIsLoading(false);
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
                  Restaurant Name <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Restaurant name" {...field} />
                </FormControl>
                <FormDescription>
                  Enter the official name of the restaurant.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Brief description of the restaurant"
                    className="resize-none min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Provide a short description of the restaurant, its cuisine,
                  and specialties.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Phone Number <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="+243 xxxxxxxx" {...field} />
                  </FormControl>
                  <FormDescription>
                    Contact phone number for the restaurant.
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
                  <FormLabel>Email (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="restaurant@example.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Contact email for the restaurant, if available.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="Restaurant address" {...field} />
                </FormControl>
                <FormDescription>
                  The physical address of the restaurant.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="serviceArea"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Area</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Areas where the restaurant delivers"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Description of areas where the restaurant provides delivery
                  service.
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
              onClick={() => router.push("/admin/restaurants")}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              className="cursor-pointer"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Restaurant"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
