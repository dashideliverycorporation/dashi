"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Eye, EyeOff } from "lucide-react";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTranslation } from "@/hooks/useTranslation";
import { JSX } from "react/jsx-runtime";

/**
 * Schema for sign in form validation
 */
const signInSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email("Invalid email address"),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters" }),
});

/**
 * Type for sign in form values
 */
type SignInFormValues = z.infer<typeof signInSchema>;

/**
 * Sign In Form Component
 *
 * Provides a form for users to sign in to their account using Next Auth
 *
 * @returns {JSX.Element} The sign in form component
 */
export function SignInForm(): JSX.Element {
  const { t } = useTranslation();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  /**
   * Toggle password visibility
   */
  const togglePasswordVisibility = (): void => {
    setShowPassword((prevState) => !prevState);
  };

  /**
   * Handle form submission - authenticates the user with NextAuth
   *
   * @param {SignInFormValues} values - The form values
   */
  const onSubmit = async (values: SignInFormValues): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      // Call NextAuth signIn function with credentials provider directly
      // This avoids the call to /api/auth/providers which is causing the 404 error
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
        callbackUrl: "/",
      });
      if (result?.error) {
        // Handle authentication errors
        setError("Invalid email or password. Please try again.");
        return;
      }
      if (result?.ok) {
        // Get user info to check their role after successful sign-in
        try {
          // Make a fetch call to get the session info
          const session = await fetch("/api/auth/session");
          const sessionData = await session.json();

          // Redirect based on user role
          if (sessionData && sessionData.user?.role === "ADMIN") {
            // If the user is an admin, redirect to admin dashboard
            router.push("/admin");
          } else if (sessionData && sessionData.user?.role === "RESTAURANT") {
            // If the user is a restaurant, redirect to restaurant dashboard
            router.push("/restaurant");
          } else {
            // For other users (e.g., customers), use the default redirect
            router.push(result.url || "/");
          }
          router.refresh(); // Refresh to update auth state in the UI
        } catch (sessionError) {
          console.error("Error fetching session:", sessionError);
          // Default redirect if we can't determine role
          router.push(result.url || "/");
          router.refresh();
        }
      }
    } catch (err) {
      console.error("Sign in error:", err);
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
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          {t("signIn.title", "Sign In")}
        </CardTitle>
        <CardDescription className="text-center">
          {t(
            "signIn.description",
            "Enter your credentials to access your account"
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("signIn.email", "Email")}</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("signIn.password", "Password")}</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        placeholder="yourpassword"
                        type={showPassword ? "text" : "password"}
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground cursor-pointer"
                      onClick={togglePasswordVisibility}
                      tabIndex={-1}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <Eye className="h-4 w-4" aria-hidden="true" />
                      )}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={isLoading}
            >
              {isLoading
                ? t("signIn.signingIn", "Signing In...")
                : t("signIn.signIn", "Sign In")}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <div className="text-sm text-center text-muted-foreground">
          {t("signIn.noAccount", "Don't have an account?")}{" "}
          <Link href="/auth/signup" className="text-primary hover:underline">
            {t("signIn.createAccount", "Create Account")}
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
