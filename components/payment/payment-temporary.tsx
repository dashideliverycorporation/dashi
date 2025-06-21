"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "@/hooks/useTranslation";
import { z } from "zod";
import { useCart } from "@/components/cart/use-cart";
import { trpc } from "@/lib/trpc/client";

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
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  AlertCircle,
  CheckCircle,
  Phone,
  Smartphone,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

/**
 * Schema for mobile money payment form validation
 */
const mobileMoneySchema = z.object({
  mobileNumber: z
    .string()
    .min(10, { message: "Mobile number must be at least 10 digits" })
    .regex(/^\d+$/, { message: "Mobile number must contain only digits" }),
  transactionId: z
    .string()
    .min(6, { message: "Transaction ID must be at least 6 characters" })
    .max(20, { message: "Transaction ID cannot exceed 20 characters" }),
  providerName: z
    .string()
    .min(2, { message: "Provider name is required" }),
});

/**
 * Type for mobile money form values
 */
export type MobileMoneyFormValues = z.infer<typeof mobileMoneySchema>;

/**
 * Props for the TemporaryPaymentForm component
 */
interface TemporaryPaymentFormProps {
  /**
   * Callback function that is called when the form is submitted with valid data
   */
  onSubmit: (values: MobileMoneyFormValues) => void;
  /**
   * Boolean to indicate if the form is currently submitting
   */
  isSubmitting?: boolean;
}

/**
 * Temporary Mobile Money Payment Form component
 * 
 * This is a temporary solution until full payment integration is implemented.
 * It allows customers to make mobile money payments directly to the restaurant's phone number.
 *
 * @component
 */
export function TemporaryPaymentForm({
  onSubmit,
  isSubmitting = false,
}: TemporaryPaymentFormProps) {
  const { t } = useTranslation();
  const { state } = useCart();
  const [restaurantPhone, setRestaurantPhone] = useState<string | null>(null);
  const { restaurantId } = state;
  
  // Fetch restaurant details to get the phone number
  const { data: restaurant, isLoading } = trpc.restaurant.getRestaurantBySlug.useQuery(
    { slug: restaurantId || "" },
    {
      enabled: !!restaurantId,
    }
  );
  
  // Set restaurant phone number when data is loaded
  useEffect(() => {
    if (restaurant?.phoneNumber) {
      setRestaurantPhone(restaurant.phoneNumber);
    }
  }, [restaurant]);

  // Initialize form with zod resolver
  const form = useForm<MobileMoneyFormValues>({
    resolver: zodResolver(mobileMoneySchema),
    defaultValues: {
      mobileNumber: "",
      transactionId: "",
      providerName: "Mobile Money",
    },
  });

  /**
   * Handle form submission with validation
   */
  const handleSubmit = (values: MobileMoneyFormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-8"
      >
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">
            {t("payment.mobileMoneyTitle", "Mobile Money Payment")}
          </h2>
          
          <Alert className="bg-blue-50 text-blue-800 border-blue-200">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle className="font-semibold">
              {t("payment.temporaryNotice", "Temporary Payment Solution")}
            </AlertTitle>
            <AlertDescription className="text-blue-700">
              {t(
                "payment.temporaryDescription",
                "This is a temporary payment solution. Please follow the instructions below to complete your payment."
              )}
            </AlertDescription>
          </Alert>

          <Card className="border border-orange-200">
            <CardHeader className="bg-orange-50 border-b border-orange-100">
              <CardTitle className="text-lg text-orange-900 flex items-center gap-2">
                <Phone className="h-5 w-5" />
                {t("payment.restaurantPaymentDetails", "Restaurant Payment Details")}
              </CardTitle>
              <CardDescription className="text-orange-700">
                {t("payment.transferInstructions", "Transfer the total amount to this mobile number")}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {isLoading ? (
                <div className="flex items-center justify-center h-10 animate-pulse">
                  <p>{t("common.loading", "Loading...")}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-700">
                      {t("restaurant.name", "Restaurant")}:
                    </h3>
                    <p className="text-lg font-semibold">{state.restaurantName}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-700">
                      {t("restaurant.phoneNumber", "Mobile Money Number")}:
                    </h3>
                    <p className="text-lg font-semibold flex items-center gap-2">
                      <Smartphone className="h-5 w-5 text-orange-500" />
                      {restaurantPhone || t("common.unavailable", "Unavailable")}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-700">
                      {t("payment.amountToSend", "Amount to Send")}:
                    </h3>
                    <p className="text-xl font-bold text-orange-600">
                      ${(state.subtotal + state.deliveryFee).toFixed(2)}
                    </p>
                  </div>
                  
                  <div className="h-px w-full bg-gray-200 my-4"></div>
                  
                  <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
                    <h3 className="font-medium text-yellow-800">
                      {t("payment.instructions", "Payment Instructions")}:
                    </h3>
                    <ol className="list-decimal list-inside space-y-2 mt-2 text-yellow-700">
                      <li>{t("payment.step1", "Open your mobile money app")}</li>
                      <li>
                        {t(
                          "payment.step2",
                          "Send the exact amount shown above to the restaurant's number"
                        )}
                      </li>
                      <li>
                        {t(
                          "payment.step3",
                          "Note the transaction ID/reference from your mobile money confirmation"
                        )}
                      </li>
                      <li>
                        {t(
                          "payment.step4",
                          "Enter the transaction ID below to complete your order"
                        )}
                      </li>
                    </ol>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {t("payment.confirmPayment", "Confirm Your Payment")}
              </CardTitle>
              <CardDescription>
                {t(
                  "payment.enterDetails",
                  "Enter your details and the transaction ID to complete the order"
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="mobileNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">
                      {t("payment.yourMobileNumber", "Your Mobile Number")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t(
                          "payment.enterMobileNumber",
                          "Enter the number you used for payment"
                        )}
                        type="tel"
                        className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {t(
                        "payment.mobileNumberDescription",
                        "The mobile number you used to make the payment"
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="transactionId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">
                      {t("payment.transactionId", "Transaction ID/Reference")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t(
                          "payment.enterTransactionId",
                          "Enter the transaction ID from your payment"
                        )}
                        className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {t(
                        "payment.transactionIdDescription",
                        "The reference or ID provided after completing your mobile money payment"
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="providerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">
                      {t("payment.providerName", "Mobile Money Provider")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t(
                          "payment.enterProviderName",
                          "Enter your mobile money provider name"
                        )}
                        className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {t(
                        "payment.providerNameDescription",
                        "The mobile money provider you used (e.g., MTN, Orange, Airtel)"
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button
                type="submit"
                className="w-full py-6 text-lg font-bold transition-all text-white bg-orange-600 hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 border-t-2 border-r-2 border-white rounded-full animate-spin"></div>
                    {t("payment.processing", "Processing...")}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    {t("payment.completeOrder", "Complete Order")}
                  </div>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </Form>
  );
}

export default TemporaryPaymentForm;
