"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "@/hooks/useTranslation";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Banknote } from "lucide-react";
import Image from "next/image";
import { Checkbox } from "../ui/checkbox";

/**
 * Schema for payment form validation
 */
const paymentSchema = z
  .object({
    paymentMethod: z.enum(["credit_card", "cash", "paypal"], {
      required_error: "Please select a payment method",
    }),
    cardNumber: z
      .string()
      .regex(/^\d{16}$/, { message: "Card number must be 16 digits" })
      .optional()
      .or(z.literal("")),
    cardholderName: z
      .string()
      .min(1, { message: "Cardholder name is required" })
      .optional()
      .or(z.literal("")),
    expiryDate: z
      .string()
      .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, { message: "Invalid format (MM/YY)" })
      .optional()
      .or(z.literal("")),
    cvv: z
      .string()
      .regex(/^\d{3,4}$/, { message: "CVV must be 3 or 4 digits" })
      .optional()
      .or(z.literal("")),
    savePaymentDetails: z.boolean().optional(),
  })
  .refine(
    (data) => {
      // If payment method is credit card, validate the credit card fields
      if (data.paymentMethod === "credit_card") {
        return (
          !!data.cardNumber &&
          !!data.cardholderName &&
          !!data.expiryDate &&
          !!data.cvv
        );
      }
      return true;
    },
    {
      message: "Credit card details are required",
      path: ["paymentMethod"],
    }
  );

/**
 * Type for payment form values
 */
export type PaymentFormValues = z.infer<typeof paymentSchema>;

/**
 * Props for the PaymentForm component
 */
interface PaymentFormProps {
  /**
   * Callback function that is called when the form is submitted with valid data
   */
  onSubmit: (values: PaymentFormValues) => void;
  /**
   * Boolean to indicate if the form is currently submitting
   */
  isSubmitting?: boolean;
}

/**
 * Payment form component with payment method selection and credit card fields
 *
 * @component
 */
export function PaymentForm({
  onSubmit,
  isSubmitting = false,
}: PaymentFormProps) {
  const { t } = useTranslation();
  const [paymentMethod, setPaymentMethod] = useState<
    "credit_card" | "cash" | "paypal" | null
  >(null);

  // Initialize form with zod resolver
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentMethod: undefined,
      cardNumber: "",
      cardholderName: "",
      expiryDate: "",
      cvv: "",
      savePaymentDetails: false,
    },
  });

  /**
   * Handle form submission with validation
   */
  const handleSubmit = (values: PaymentFormValues) => {
    onSubmit(values);
  };

  // Update form when payment method changes
  const handlePaymentMethodChange = (value: string) => {
    if (value === "credit_card" || value === "cash" || value === "paypal") {
      setPaymentMethod(value as "credit_card" | "cash" | null);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      form.setValue("paymentMethod", value as any);
    }
  };

  // Payment method is required to show validation error
  const selectedPaymentMethod = form.watch("paymentMethod");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6 w-full"
      >
        {/* Payment Method Title */}
        <h1 className="text-xl md:text-2xl font-bold mb-6">
          {t("payment.selectPaymentMethod", "Select Payment Method")}
        </h1>

        <div className="space-y-6">
          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => {
                      field.onChange(value);
                      handlePaymentMethodChange(value);
                    }}
                    defaultValue={field.value}
                    className="flex justify-between lg:grid lg:grid-cols-3 lg:gap-4"
                  >
                    <FormItem>
                      <FormLabel className="[&:has([data-state=checked])>div]:border-orange-500 [&:has([data-state=checked])>div]:bg-orange-50">
                        <FormControl>
                          <RadioGroupItem
                            value="credit_card"
                            className="sr-only"
                          />
                        </FormControl>
                        <div className="border-2 rounded-md p-4 cursor-pointer flex items-center justify-center flex-col h-20">
                          <CreditCard className="h-6 w-6 mb-2" />
                          <span className="text-sm font-medium">
                            {t("payment.creditCard", "Credit Card")}
                          </span>
                        </div>
                      </FormLabel>
                    </FormItem>
                    <FormItem>
                      <FormLabel className="[&:has([data-state=checked])>div]:border-orange-500 [&:has([data-state=checked])>div]:bg-orange-50">
                        <FormControl>
                          <RadioGroupItem value="paypal" className="sr-only" />
                        </FormControl>
                        <div className="border-2 rounded-md p-4 cursor-pointer flex items-center justify-center flex-col h-20">
                          <div className="mb-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="icon icon-tabler icons-tabler-outline icon-tabler-brand-paypal text-blue-600"
                            >
                              <path
                                stroke="none"
                                d="M0 0h24v24H0z"
                                fill="none"
                              />
                              <path d="M10 13l2.5 0c2.5 0 5 -2.5 5 -5c0 -3 -1.9 -5 -5 -5h-5.5c-.5 0 -1 .5 -1 1l-2 14c0 .5 .5 1 1 1h2.8l1.2 -5c.1 -.6 .4 -1 1 -1zm7.5 -5.8c1.7 1 2.5 2.8 2.5 4.8c0 2.5 -2.5 4.5 -5 4.5h-2.6l-.6 3.6a1 1 0 0 1 -1 .8l-2.7 0a0.5 .5 0 0 1 -.5 -.6l.2 -1.4" />
                            </svg>
                          </div>
                          <span className="text-sm font-medium">
                            {t("payment.paypal", "PayPal")}
                          </span>
                        </div>
                      </FormLabel>
                    </FormItem>
                    <FormItem>
                      <FormLabel className="[&:has([data-state=checked])>div]:border-orange-500 [&:has([data-state=checked])>div]:bg-orange-50">
                        <FormControl>
                          <RadioGroupItem value="cash" className="sr-only" />
                        </FormControl>
                        <div className="border-2 rounded-md p-4 cursor-pointer flex items-center justify-center flex-col h-20">
                          <Banknote className="h-6 w-6 mb-2" />
                          <span className="text-sm font-medium">
                            {t("payment.cash", "Cash")}
                          </span>
                        </div>
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {paymentMethod === "credit_card" && (
            <div className="space-y-4 border-t pt-6 mt-6">
              <h2 className="text-lg font-medium mb-4">
                {t("payment.cardDetails", "Card Details")}
              </h2>

              <FormField
                control={form.control}
                name="cardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">
                      {t("payment.cardNumber", "Card Number")}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="0000 0000 0000 0000"
                          className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 pr-12"
                          {...field}
                          onChange={(e) => {
                            // Format card number with spaces for display
                            const value = e.target.value.replace(/\s/g, "");
                            if (/^\d*$/.test(value)) {
                              field.onChange(value);
                            }
                          }}
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <Image
                            src="/visa.svg"
                            alt="Visa"
                            width={32}
                            height={20}
                          />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cardholderName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">
                      {t("payment.cardholderName", "Cardholder Name")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t(
                          "payment.enterCardholderName",
                          "Enter cardholder name"
                        )}
                        className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="expiryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">
                        {t("payment.validThrough", "Valid Through")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="MM/YY"
                          className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                          {...field}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, "");
                            if (value.length > 0) {
                              value = value
                                .match(new RegExp(".{1,2}", "g"))!
                                .join("/");
                              if (value.length > 5) {
                                value = value.substring(0, 5);
                              }
                            }
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cvv"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <div className="flex items-center gap-1">
                        <FormLabel className="text-base font-medium">
                          {t("payment.cvv", "CVV")}
                        </FormLabel>
                        <span className="text-gray-500 cursor-help text-sm rounded-full border h-5 w-5 inline-flex items-center justify-center">
                          ?
                        </span>
                      </div>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="•••"
                          className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                          maxLength={4}
                          {...field}
                          onChange={(e) => {
                            // Only allow digits
                            const value = e.target.value.replace(/\D/g, "");
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="savePaymentDetails"
                render={() => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-4">
                    <FormControl>
                      <Checkbox
                       
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal cursor-pointer">
                      {t(
                        "payment.savePaymentDetails",
                        "Save my payment details for future purchases"
                      )}
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>
          )}

          {paymentMethod === "cash" && (
            <div className="border-t pt-6 mt-6">
              <div className="p-4 border rounded-md bg-blue-50 text-blue-800 border-blue-200">
                <p className="text-sm">
                  {t(
                    "payment.cashPaymentInfo",
                    "You will pay in cash upon delivery. Please have the exact amount ready."
                  )}
                </p>
              </div>
            </div>
          )}

          {paymentMethod === "paypal" && (
            <div className="border-t pt-6 mt-6">
              <div className="p-4 border rounded-md bg-blue-50 text-blue-800 border-blue-200">
                <p className="text-sm">
                  {t(
                    "payment.paypalInfo",
                    "You will be redirected to PayPal to complete your payment securely."
                  )}
                </p>
              </div>
            </div>
          )}
        </div>

        {selectedPaymentMethod && (
          <div className="mt-6">
            <Button
              type="submit"
              className="w-full py-4 font-bold transition-all text-white bg-orange-600 hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              aria-label={t("payment.placeOrder", "Place Order")}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? t("payment.processing", "Processing...")
                : t("payment.placeOrder", "Place Order")}
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}
