"use client";

import { useState, useRef, ChangeEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createMenuItemSchema, updateMenuItemSchema } from "@/server/schemas/menu-item.schema";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Upload } from "lucide-react";
import type { CreateMenuItemInput, UpdateMenuItemInput } from "@/server/schemas/menu-item.schema";
import { toastNotification } from "@/components/custom/toast-notification";
import { JSX } from "react/jsx-runtime";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";

/**
 * Menu Item Form Component
 *
 * Form for creating or updating menu items for a restaurant
 *
 * @param {object} props - Component props
 * @param {Function} props.setOpen - function to update the state
 * @param {object} [props.menuItem] - existing menu item data for editing (optional)
 * @param {string} [props.restaurantId] - restaurant ID when creating a new menu item
 * @param {Function} [props.onSuccess] - callback function to run after successful submission
 * @returns {JSX.Element} The menu item form component
 */
export function MenuItemForm({
  setOpen,
  menuItem,
  restaurantId,
  onSuccess,
}: { 
  setOpen: (open: boolean) => void;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
  menuItem?: any;
  restaurantId?: string;
  onSuccess?: () => void;
}): JSX.Element {
  const router = useRouter();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(menuItem?.imageUrl || "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditing = !!menuItem;

  // Initialize form with zod validation
  const form = useForm<UpdateMenuItemInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(isEditing ? updateMenuItemSchema : createMenuItemSchema) as any,
    defaultValues: {
      id: menuItem?.id || "",
      name: menuItem?.name || "",
      description: menuItem?.description || "",
      price: menuItem?.price ? Number(menuItem.price) : 0,
      category: menuItem?.category || "",
      imageUrl: menuItem?.imageUrl || "",
      available: menuItem?.isAvailable ?? true,
    },
    // Report validation errors as the user is typing
    mode: "onChange",
  });
  
  // Set image preview when editing
  useEffect(() => {
    if (menuItem?.imageUrl) {
      setImagePreview(menuItem.imageUrl);
    }
  }, [menuItem]);
  
  // This ensures the form will be populated with the correct data if menuItem changes
  useEffect(() => {
    if (menuItem) {
      form.reset({
        id: menuItem.id || "",
        name: menuItem.name || "",
        description: menuItem.description || "",
        price: menuItem.price ? Number(menuItem.price) : 0,
        category: menuItem.category || "",
        imageUrl: menuItem.imageUrl || "",
        available: menuItem.isAvailable ?? true,
      });
    }
  }, [menuItem, form]);

  /**
   * Set up the tRPC mutation for creating menu items
   */
  const createMenuItemMutation = trpc.restaurant.createMenuItem.useMutation({
    onSuccess: () => {
      toastNotification.success(
        t("restaurantMenu.form.success.created.title"),
        t("restaurantMenu.form.success.created.message")
      );
      setIsLoading(false);
      // Reset form
      form.reset();

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }

      setTimeout(() => {
        router.refresh();
        setOpen(false);
      }, 2000);
    },
    onError: (error) => {
      toastNotification.error(
        t("restaurantMenu.form.error.create.title"),
        error.message || t("restaurantMenu.form.error.create.defaultMessage")
      );
      setIsLoading(false);
    },
  });

  /**
   * Set up the tRPC mutation for updating menu items
   */
  const updateMenuItemMutation = trpc.restaurant.updateMenuItem.useMutation({
    onSuccess: () => {
      toastNotification.success(
        t("restaurantMenu.form.success.updated.title"),
        t("restaurantMenu.form.success.updated.message")
      );
      setIsLoading(false);

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }

      setTimeout(() => {
        router.refresh();
        setOpen(false);
      }, 2000);
    },
    onError: (error) => {
      toastNotification.error(
        t("restaurantMenu.form.error.update.title"),
        error.message || t("restaurantMenu.form.error.update.defaultMessage")
      );
      setIsLoading(false);
    },
  });

  /**
   * Handle form submission
   * Submits the form data to the server and handles loading states and errors
   *
   * @param {UpdateMenuItemInput} values - Form values
   */
  const onSubmit = async (values: UpdateMenuItemInput): Promise<void> => {
    try {
      setIsLoading(true);
      
      if (isEditing && values.id) {
        // Update existing menu item
        updateMenuItemMutation.mutate(values);
      } else {
        // Create new menu item - remove id property
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...createValues } = values;
        
        // Add restaurantId if provided (for direct creation without a manager context)
        if (restaurantId) {
          // Use type assertion after spreading to avoid TypeScript error
          createMenuItemMutation.mutate({
            ...createValues,
            // The restaurantId is handled by the API but not part of the schema type
            restaurantId
          } as unknown as CreateMenuItemInput);
        } else {
          // Normal creation flow (needs restaurant manager context)
          createMenuItemMutation.mutate(createValues as CreateMenuItemInput);
        }
      }
    } catch (err) {
      // This catch block handles any unexpected errors outside of the tRPC flow
      setIsLoading(false);
      console.error("Error submitting form:", err);
      toastNotification.error(
        t("restaurantMenu.form.error.general.title"),
        t("restaurantMenu.form.error.general.message")
      );
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
        t("restaurantMenu.form.fields.image.fileTooLarge"),
        t("restaurantMenu.form.fields.image.fileTooLargeMessage")
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="text-xs text-muted-foreground mb-3">
            {t("restaurantMenu.form.requiredFieldsNote")} <span className="text-red-500">*</span>
          </div>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">
                  {t("restaurantMenu.form.fields.name.label")} <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input className="text-sm h-9" placeholder={t("restaurantMenu.form.fields.name.placeholder")} {...field} />
                </FormControl>
                <FormDescription className="text-xs">
                  {t("restaurantMenu.form.fields.name.description")}
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
                <FormLabel className="text-sm">{t("restaurantMenu.form.fields.description.label")}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t("restaurantMenu.form.fields.description.placeholder")}
                    className="resize-none min-h-[80px] text-sm"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  {t("restaurantMenu.form.fields.description.description")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">
                    {t("restaurantMenu.form.fields.price.label")} <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="text-sm h-9"
                      placeholder={t("restaurantMenu.form.fields.price.placeholder")}
                      value={
                        field.value === 0 &&
                        !document.activeElement?.id?.includes("price")
                          ? ""
                          : field.value
                      }
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? 0 : parseFloat(e.target.value)
                        )
                      }
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    {t("restaurantMenu.form.fields.price.description")}
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
                  <FormLabel className="text-sm">
                    {t("restaurantMenu.form.fields.category.label")} <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="text-sm h-9"
                      placeholder={t("restaurantMenu.form.fields.category.placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    {t("restaurantMenu.form.fields.category.description")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">
                  {t("restaurantMenu.form.fields.image.label")} <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input type="hidden" {...field} />
                </FormControl>
                <div
                  className="border-2 border-dashed rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors min-h-[100px]"
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
                      <Upload className="h-6 w-6 text-gray-400 mb-1" />
                      <div className="text-orange-500 font-medium text-sm">
                        {t("restaurantMenu.form.fields.image.uploadText")}
                      </div>
                      <div className="text-xs text-gray-500">
                        {t("restaurantMenu.form.fields.image.fileTypes")}
                      </div>
                    </>
                  ) : (
                    <div className="w-full flex items-center gap-3">
                      <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden">
                        <Image
                          src={imagePreview}
                          alt="Menu item preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 flex flex-col">
                        <p className="text-sm font-medium truncate">
                          {t("restaurantMenu.form.fields.image.imageSelected")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t("restaurantMenu.form.fields.image.changeImage")}
                        </p>
                      </div>
                      <Upload className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <FormDescription className="text-xs">
                  {t("restaurantMenu.form.fields.image.description")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="available"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm">{t("restaurantMenu.form.fields.available.label")}</FormLabel>
                  <FormDescription className="text-xs">
                    {t("restaurantMenu.form.fields.available.description")}
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              className="cursor-pointer h-9 text-sm"
              type="button"
              variant="outline"
              onClick={() => {
                form.reset();
                setOpen(false);
              }}
              disabled={isLoading}
            >
              {t("restaurantMenu.form.buttons.cancel")}
            </Button>
            <Button
              className="cursor-pointer h-9 text-sm"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  {isEditing ? t("restaurantMenu.form.buttons.updating") : t("restaurantMenu.form.buttons.creating")}
                </>
              ) : (
                isEditing ? t("restaurantMenu.form.buttons.update") : t("restaurantMenu.form.buttons.create")
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
