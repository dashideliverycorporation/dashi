"use client";

import { useState, useRef, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createRestaurantSchema } from "@/server/schemas/restaurant.schema";
import { trpc } from "@/lib/trpc/client";
import Image from "next/image";
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
import { Loader2, Upload } from "lucide-react";
import type { CreateRestaurantInput } from "@/server/schemas/restaurant.schema";
import { JSX } from "react/jsx-runtime";
import { toastNotification } from "@/components/custom/toast-notification";

/**
 * Restaurant Form Component
 *
 * Form for creating or updating restaurant information
 * @param {object} props - Component props
 * @param {Function} [props.setOpen] - function to update the state
 * @returns {JSX.Element} The restaurant form component
 */
export function RestaurantForm({
  setOpen,
}: { setOpen: (open: boolean) => void }): JSX.Element {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      imageUrl: "",
      category: "",
      preparationTime: "",
      deliveryFee: "" ,
    },
  });

  // Get the restaurant creation mutation from tRPC
  const createRestaurantMutation = trpc.restaurant.createRestaurant.useMutation(
    {
      onSuccess: () => {
        toastNotification.success(
          "Restaurant created successfully",
          "You have added a new restaurant, you will be redirected to the restaurant list"
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
        "Failed to create restaurant",
        `${error.message}! 
        Please try again`
      );
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
      // Call the mutation to create the restaurant
      createRestaurantMutation.mutate(values);
    } catch (err) {
      setIsLoading(false);
      console.error("Error submitting form:", err);
    }
  };

  /**
   * Handle image file selection
   * Converts the selected image to a data URL and updates the form
   *
   * @param {ChangeEvent<HTMLInputElement>} e - Input change event
   */
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toastNotification.error(
        "File too large",
        "Image must be less than 5MB. Please select a smaller file."
      );
      return;
    }

    setImageFile(file);

    // Create a temporary URL for the image preview
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImagePreview(result);
      // Update the form field with the data URL
      form.setValue("imageUrl", result);
    };
    reader.readAsDataURL(file);
  };

  /**
   * Trigger file input click
   */
  const triggerFileInput = (): void => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
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
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Restaurant Image</FormLabel>
                <FormControl>
                  <Input type="hidden" {...field} />
                </FormControl>{" "}
                <div
                  className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors min-h-[120px]"
                  onClick={triggerFileInput}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />

                  {!imagePreview ? (
                    <>
                      <Upload className="h-8 w-8 text-gray-400 mb-1" />
                      <div className="text-orange-500 font-medium">
                        Upload a file
                      </div>
                      <div className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 5MB
                      </div>
                    </>
                  ) : (
                    <div className="w-full flex items-center gap-4">
                      <div className="relative w-24 h-24 flex-shrink-0 rounded-md overflow-hidden">
                        <Image
                          src={imagePreview}
                          alt="Restaurant image preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 flex flex-col">
                        <p className="text-sm font-medium truncate">
                          Image Selected
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Click to change image
                        </p>
                      </div>
                      <Upload className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <FormDescription>
                  Click the box to upload an image of your restaurant.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Restaurant Category</FormLabel>
                <FormControl>
                  <Input placeholder="E.g. Italian, Fast Food, Vegetarian" {...field} />
                </FormControl>
                <FormDescription>
                  Type of cuisine or restaurant category.
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="preparationTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preparation Time</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g. 30-45 minutes" {...field} />
                  </FormControl>
                  <FormDescription>
                    Average food preparation time.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deliveryFee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivery Fee</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="0.00" 
                      type="number" 
                      step="0.01"
                      {...field} 
                      onChange={(e) => {
                        field.onChange(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Fee charged for delivery service.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
