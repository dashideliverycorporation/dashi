"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Save, Image as ImageIcon } from "lucide-react";
import { trpc } from "@/lib/trpc/client";
import { useTranslation } from "@/hooks/useTranslation";
import { toastNotification } from "@/components/custom/toast-notification";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { JSX } from "react/jsx-runtime";
import { Switch } from "@/components/ui/switch";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

/**
 * Schema for restaurant settings form
 */
const restaurantSettingsSchema = z.object({
  name: z
    .string()
    .min(2, "Restaurant name must be at least 2 characters")
    .max(100, "Restaurant name must be at most 100 characters"),
  description: z
    .string()
    .max(500, "Description must be at most 500 characters")
    .optional(),
  email: z.string().email("Please enter a valid email address").optional(),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+?[0-9\s\-()]+$/, "Please enter a valid phone number"),
  address: z.string().optional(),
  serviceArea: z
    .string()
    .max(200, "Service area description must be at most 200 characters")
    .optional(),
  imageUrl: z.string().optional(),
  category: z.string().max(100, "Category must be at most 100 characters").optional(),
  preparationTime: z.string().max(50, "Preparation time must be at most 50 characters").optional(),
  deliveryFee: z.string().regex(/^\d+(\.\d{1,2})?$/, "Please enter a valid delivery fee").optional(),
});

type RestaurantSettingsFormValues = z.infer<typeof restaurantSettingsSchema>;

/**
 * Restaurant Settings Page Component
 *
 * Allows restaurant managers to update their restaurant information
 *
 * @returns {JSX.Element} The restaurant settings page
 */
export default function RestaurantSettingsPage(): JSX.Element {
  const { t } = useTranslation();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRestaurantOpen, setIsRestaurantOpen] = useState(false);

  // Fetch current restaurant data
  const { data: restaurant, isLoading: isLoadingRestaurant } = trpc.restaurant.getMyRestaurant.useQuery();
  
  // Toggle restaurant open status mutation
  const toggleStatusMutation = trpc.restaurant.toggleRestaurantActiveStatus.useMutation({
    onSuccess: (data) => {
      setIsRestaurantOpen(data.isOpen);
      toastNotification.success(
        data.isOpen 
          ? t("restaurantSettings.statusOpenSuccess", "Restaurant is now open") 
          : t("restaurantSettings.statusClosedSuccess", "Restaurant is now closed"),
        t("restaurantSettings.statusUpdateDetail", "Status has been updated successfully")
      );
    },
    onError: (error) => {
      toastNotification.error(
        t("restaurantSettings.statusUpdateError", "Failed to update restaurant status"),
        error.message || t("restaurantSettings.statusUpdateErrorDetail", "Please try again later")
      );
    },
  });

  // Handle toggle change
  const handleToggleStatus = () => {
    toggleStatusMutation.mutate({ isOpen: !isRestaurantOpen });
  };
  
  // Setup the form with validation
  const form = useForm<RestaurantSettingsFormValues>({
    resolver: zodResolver(restaurantSettingsSchema),
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
      deliveryFee: "",
    },
    mode: "onChange",
  });

  // Update form when restaurant data is loaded
  useEffect(() => {
    if (restaurant) {
      form.reset({
        name: restaurant.name,
        description: restaurant.description || "",
        email: restaurant.email || "",
        phoneNumber: restaurant.phoneNumber,
        address: restaurant.address || "",
        serviceArea: restaurant.serviceArea || "",
        imageUrl: restaurant.imageUrl,
        category: restaurant.category || "",
        preparationTime: restaurant.preparationTime || "",
        deliveryFee: restaurant.deliveryFee ? restaurant.deliveryFee.toString() : "",
      });
      
      setImagePreview(restaurant.imageUrl);
      setIsRestaurantOpen(restaurant.isOpen);
    }
  }, [restaurant, form]);

  // Image upload handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        form.setValue("imageUrl", result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Update restaurant mutation
  const updateRestaurantMutation = trpc.restaurant.updateMyRestaurant.useMutation({
    onSuccess: () => {
      toastNotification.success(
        t("restaurantSettings.updateSuccess", "Restaurant settings updated successfully"),
        t("restaurantSettings.updateSuccessDetail", "Your changes have been saved")
      );
      setIsSubmitting(false);
    },
    onError: (error) => {
      toastNotification.error(
        t("restaurantSettings.updateError", "Failed to update restaurant settings"),
        error.message || t("restaurantSettings.updateErrorDetail", "Please check your input and try again")
      );
      setIsSubmitting(false);
    },
  });

  // Form submission handler
  const onSubmit = async (values: RestaurantSettingsFormValues) => {
    setIsSubmitting(true);
    updateRestaurantMutation.mutate(values);
  };

  if (isLoadingRestaurant) {
    return (
      <div className="space-y-6">
        <Card className="border-none">
          <CardHeader className="flex justify-between items-center">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-6 w-20" />
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Restaurant Logo/Image Skeleton */}
            <div className="space-y-4">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-32 w-full" />
            </div>
            
            {/* Form fields skeleton */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            
            {/* Description skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-24 w-full" />
            </div>
            
            {/* More form fields skeleton */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Skeleton className="h-5 w-12" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            
            {/* Address skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            
            {/* Service Area skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            
            {/* More form fields skeleton */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Skeleton className="h-10 w-32" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-none">
        <CardHeader className="flex justify-between items-center">
          <CardTitle>{t("restaurantSettings.title", "Settings")}</CardTitle>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer">
                <span className={isRestaurantOpen ? "text-green-600" : "text-gray-700"}>
                  {isRestaurantOpen 
                    ? t("restaurantSettings.statusOpenLabel", "Open") 
                    : t("restaurantSettings.statusClosedLabel", "Closed")}
                </span>
                <Switch
                  checked={isRestaurantOpen}
                  onCheckedChange={handleToggleStatus}
                  aria-label={t("restaurantSettings.toggleStatus", "Toggle restaurant status")}
                  className="cursor-pointer"
                />
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-[240px] text-center">
              {isRestaurantOpen 
                ? t("restaurantSettings.tooltipOpen", "Your restaurant is currently open and accepting orders. Toggle to close.") 
                : t("restaurantSettings.tooltipClosed", "Your restaurant is closed. Customers cannot place orders when you are closed. Toggle to open.")}
            </TooltipContent>
          </Tooltip>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Restaurant Logo/Image Section */}
              <div className="space-y-4">
                <FormLabel>{t("restaurantSettings.restaurantImage", "Restaurant Image")}</FormLabel>
                <div
                  className="border-2 border-dashed rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors min-h-[120px]"
                  onClick={() => document.getElementById("image-upload")?.click()}
                >
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  
                  {!imagePreview ? (
                    <div className="flex flex-col items-center justify-center">
                      <ImageIcon className="h-6 w-6 text-gray-400 mb-1" />
                      <div className="text-orange-500 font-medium text-sm">
                        {t("restaurantSettings.uploadImage", "Upload restaurant image")}
                      </div>
                      <div className="text-xs text-gray-500">
                        {t("restaurantSettings.imageFileTypes", "PNG, JPG or JPEG, up to 5MB")}
                      </div>
                    </div>
                  ) : (
                    <div className="w-full flex items-center gap-3">
                      <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden">
                        <Image
                          src={imagePreview}
                          alt="Restaurant preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 flex flex-col">
                        <p className="text-sm font-medium truncate">
                          {t("restaurantSettings.imageSelected", "Image selected")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t("restaurantSettings.clickToChangeImage", "Click to change image")}
                        </p>
                      </div>
                      <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {/* Restaurant Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("restaurantSettings.name", "Restaurant Name")}</FormLabel>
                      <FormControl>
                        <Input placeholder="Restaurant Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Category */}
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("restaurantSettings.category", "Category")}</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Pizza, Burgers, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("restaurantSettings.description", "Description")}</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Brief description of your restaurant" 
                        className="min-h-[100px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 sm:grid-cols-2">
                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("restaurantSettings.email", "Email")}</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="restaurant@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Phone Number */}
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("restaurantSettings.phoneNumber", "Phone Number")}</FormLabel>
                      <FormControl>
                        <Input placeholder="+1234567890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Address */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("restaurantSettings.address", "Address")}</FormLabel>
                    <FormControl>
                      <Input placeholder="Restaurant Address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Service Area */}
              <FormField
                control={form.control}
                name="serviceArea"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("restaurantSettings.serviceArea", "Service Area")}</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Downtown, North Side" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 sm:grid-cols-2">
                {/* Preparation Time */}
                <FormField
                  control={form.control}
                  name="preparationTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("restaurantSettings.preparationTime", "Preparation Time")}</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 15-30 minutes" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Delivery Fee */}
                <FormField
                  control={form.control}
                  name="deliveryFee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("restaurantSettings.deliveryFee", "Delivery Fee")}</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 2.50" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Hidden imageUrl field to store the data URL */}
              <input type="hidden" {...form.register("imageUrl")} />
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between">
    
          <Button 
            type="submit" 
            onClick={form.handleSubmit(onSubmit)} 
            disabled={isSubmitting || !form.formState.isDirty}
          >
            {isSubmitting ? (
              <>{t("restaurantSettings.saving", "Saving...")}</>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {t("restaurantSettings.save", "Save Changes")}
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
