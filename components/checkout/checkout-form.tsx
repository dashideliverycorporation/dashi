"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "@/hooks/useTranslation";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  checkoutSchema,
  type CheckoutFormValues,
} from "@/server/schemas/order.schema";

/**
 * Props for the CheckoutForm component
 */
interface CheckoutFormProps {
  /**
   * Callback function that is called when the form is submitted with valid data
   */
  onSubmit: (values: CheckoutFormValues) => void;
  /**
   * Boolean to indicate if the form is currently submitting
   */
  isSubmitting?: boolean;
}

/**
 * Checkout form component with address and notes fields
 *
 * @component
 */
export function CheckoutForm({
  onSubmit,
  isSubmitting = false,
}: CheckoutFormProps) {
  const { t } = useTranslation();

  // Initialize form with zod resolver
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      deliveryAddress: "",
      notes: "",
    },
  });

  /**
   * Handle form submission with validation
   */
  const handleSubmit = (values: CheckoutFormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6 w-full"
      >
        {/* DeliveryAddress Title */}
        <h1 className="text-xl md:text-2xl font-bold mb-6">
          {t("checkout.deliveryAddress", "Delivery Address")}
        </h1>

        <div className="space-y-6">
          {/* Personal Information Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    {t("checkout.firstName")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("checkout.enterFirstName")}
                      className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    {t("checkout.lastName")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("checkout.enterLastName")}
                      className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    {t("checkout.email")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder={t("checkout.enterEmail")}
                      className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    {t("checkout.phoneNumber")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("checkout.enterPhoneNumber")}
                      className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="deliveryAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">
                  {t("checkout.deliveryAddress")}
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t("checkout.enterDeliveryAddress")}
                    className="min-h-[100px] resize-y border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  {t("checkout.deliveryAddressDescription")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">
                  {t("checkout.additionalNotes")}
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t("checkout.enterAdditionalNotes")}
                    className="min-h-[80px] resize-y border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  {t("checkout.additionalNotesDescription")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* <div className="pt-6">
          <div className="p-4 border rounded-md bg-amber-50 text-amber-900 border-amber-200">
            <p className="text-sm font-medium">{t("checkout.paymentNote")}</p>
          </div>
        </div> */}
        <div className="mt-6 block lg:hidden">
          <Button
            type="submit"
            className="w-full py-4 font-bold transition-all text-white bg-orange-600 hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            aria-label={t("checkout.continueToPayment")}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? t("checkout.processing")
              : t("checkout.continueToPayment")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
