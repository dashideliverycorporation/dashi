"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTranslation } from "@/hooks/useTranslation";
import { JSX } from "react/jsx-runtime";

/**
 * Schema for sign up form validation
 */
const signUpSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email("Invalid email address"),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters" }),
  name: z.string().min(1, { message: "Name is required" }),
  phoneNumber: z.string().min(1, { message: "Phone number is required" }),
  address: z.string().optional(),
});

/**
 * Type for sign up form values
 */
type SignUpFormValues = z.infer<typeof signUpSchema>;

/**
 * Sign Up Form Component
 *
 * Provides a form for users to register as a customer on the Dashi platform
 *
 * @returns {JSX.Element} The sign up form component
 */
export function SignUpForm(): JSX.Element {
  const { t } = useTranslation();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      phoneNumber: "",
      address: "",
    },
  });

  /**
   * Toggle password visibility
   */
  const togglePasswordVisibility = (): void => {
    setShowPassword((prevState) => !prevState);
  };

  /**
   * Handle form submission - registers the user
   *
   * @param {SignUpFormValues} values - The form values
   */
  const onSubmit = async (values: SignUpFormValues): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      // This is a placeholder for the actual registration logic
      // In a real implementation, we would call a tRPC procedure here
      console.log("Registration values:", values);
      
      // Simulate successful registration
      setSuccess(true);
      
      // Redirect to login page after a short delay
      setTimeout(() => {
        router.push("/signin");
      }, 2000);
      
    } catch (err) {
      console.error("Registration error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription className="text-base">{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert className="mb-6 bg-green-50 border-green-500">
          <AlertDescription className="text-base text-green-700">
            {t("signUp.successMessage", "Registration successful! Redirecting to login page...")}
          </AlertDescription>
        </Alert>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 text-base font-medium">
                    {t("signUp.name", "Name")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      disabled={isLoading || success}
                      className="rounded-md border border-gray-300 px-4 py-3 text-base focus:border-primary focus:ring-primary h-12"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-base" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 text-base font-medium">
                    {t("signUp.email", "Email address")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      disabled={isLoading || success}
                      className="rounded-md border border-gray-300 px-4 py-3 text-base focus:border-primary focus:ring-primary h-12"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-base" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 text-base font-medium">
                    {t("signUp.password", "Password")}
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        placeholder="••••••••"
                        type={showPassword ? "text" : "password"}
                        disabled={isLoading || success}
                        className="rounded-md border border-gray-300 px-4 py-3 text-base focus:border-primary focus:ring-primary h-12"
                        {...field}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-3 text-muted-foreground cursor-pointer"
                      onClick={togglePasswordVisibility}
                      tabIndex={-1}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" aria-hidden="true" />
                      ) : (
                        <Eye className="h-5 w-5" aria-hidden="true" />
                      )}
                    </Button>
                  </div>
                  <FormMessage className="text-base" />
                </FormItem>
              )}
            />

            
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 text-base font-medium">
                    {t("signUp.phoneNumber", "Phone Number")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+243 XXXXXXXXX"
                      disabled={isLoading || success}
                      className="rounded-md border border-gray-300 px-4 py-3 text-base focus:border-primary focus:ring-primary h-12"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-base" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 text-base font-medium">
                    {t("signUp.address", "Address (Optional)")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="123 Main St, Goma, DRC"
                      disabled={isLoading || success}
                      className="rounded-md border border-gray-300 px-4 py-3 text-base focus:border-primary focus:ring-primary h-12"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-base" />
                </FormItem>
              )}
            />
          </div>
          
          <Button
            type="submit"
            className="w-full rounded-md bg-primary py-3 font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-base h-12 cursor-pointer"
            disabled={isLoading || success}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {t("signUp.signingUp", "Signing up...")}
              </>
            ) : (
              t("signUp.signup", "Sign up")
            )}
          </Button>
          
          <div className="relative mt-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-base">
              <span className="bg-white px-6 text-gray-500 font-medium">
                {t("signUp.orContinueWith", "Or")}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-3 mt-2 mb-8">
            <Button
              type="button"
              variant="outline"
              className="flex w-full items-center justify-center gap-3 cursor-pointer text-foreground h-12 text-base"
              onClick={() => signIn("google", { callbackUrl: "/" })}
            >
              <svg className="h-6 w-6" aria-hidden="true" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span className="text-base">Sign up with Google</span>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}