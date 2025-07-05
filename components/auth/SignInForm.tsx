"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
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
import { Checkbox } from "@/components/ui/checkbox";
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
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);
  
  // Use useEffect to handle client-side rendering
  // This prevents hydration errors by ensuring the server and client render the same initial content
  useEffect(() => {
    setIsClient(true);
  }, []);

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
   */  // Get callback URL from query string if available
  const [callbackUrl, setCallbackUrl] = useState<string | null>(null);
  
  // Get callback URL from query string or localStorage
  useEffect(() => {
    // Check for URL parameters when running on client side
    if (typeof window !== 'undefined') {
      // Parse URL params
      const params = new URLSearchParams(window.location.search);
      const urlCallbackParam = params.get('callbackUrl');
      
      // Check localStorage for saved callback URL
      const savedCallback = localStorage.getItem('authCallbackUrl');
      
      // Use URL param first, then localStorage, default to "/"
      const finalCallback = urlCallbackParam || savedCallback || "/";
      console.debug("SignInForm callbackUrl from:", 
        urlCallbackParam ? "URL param" : savedCallback ? "localStorage" : "default",
        "Value:", finalCallback);
      
      setCallbackUrl(finalCallback);
    }
  }, []);
  
  const onSubmit = async (values: SignInFormValues): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      // Call NextAuth signIn function with credentials provider directly
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
        callbackUrl: callbackUrl || "/",
      });
      
      if (result?.error) {
        // Handle authentication errors
        setError(t("signIn.invalidCredentials", "Invalid email or password. Please try again."));
        return;
      }
      
      if (result?.ok) {
        try {
          // Make a fetch call to get the session info
          const session = await fetch("/api/auth/session");
          const sessionData = await session.json();
          const userRole = sessionData?.user?.role;
          
          // Clear saved callback URL from localStorage
          localStorage.removeItem('authCallbackUrl');
          console.debug("Cleared authCallbackUrl from localStorage after successful sign in");
          
          // Redirect based on user role
          if (userRole === "ADMIN") {
            // Admin always goes to admin dashboard
            router.push("/admin");
          } else if (userRole === "RESTAURANT") {
            // Restaurant always goes to restaurant dashboard
            router.push("/restaurant");
          } else {
            // For customers, use callback URL or default to home
            const redirectUrl = callbackUrl || "/";
            console.debug("Customer redirecting to:", redirectUrl);
            router.push(redirectUrl);
          }
          
          router.refresh(); // Refresh to update auth state in the UI
        } catch (sessionError) {
          console.error("Error fetching session:", sessionError);
          // Default redirect if we can't determine role
          router.push(callbackUrl || "/");
          router.refresh();
        }
      }
    } catch (err) {
      console.error("Sign in error:", err);
      setError(
        err instanceof Error
          ? err.message
          : t("signIn.unexpectedError", "An unexpected error occurred. Please try again.")
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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
           {/* <div className="grid grid-cols-1 gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex w-full items-center justify-center gap-3 cursor-pointer text-foreground h-12 text-base"
              onClick={() => {
                setError(null);
                signIn("google", { callbackUrl: callbackUrl || "/" });
              }}
              disabled={isLoading}
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
              <span className="text-base">{isClient ? t("signIn.signInWithGoogle", "Sign in with Google") : "Sign in with Google"}</span>
            </Button>
          </div>
          
           <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-base">
              <span className="bg-white px-6 text-gray-500 font-medium">
                {isClient ? t("signIn.orContinueWith", "Or") : "Or"}
              </span>
            </div>
          </div> */}

           <div className="grid grid-cols-1 gap-3 mb-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex w-full items-center justify-center gap-3 cursor-pointer text-foreground h-12 text-base"
                        onClick={() => {
                setError(null);
                signIn("google", { callbackUrl: callbackUrl || "/" });
              }}
              disabled={isLoading}
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
                                     <span className="text-base">{isClient ? t("signIn.signInWithGoogle", "Sign in with Google") : "Sign in with Google"}</span>
                      </Button>
                    </div>
                    <div className="relative my-3">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        {isClient ? t("signIn.orContinueWith", "Or") : "Or"}
                      </div>
                    </div>
         
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  {" "}
                  <FormLabel className="text-gray-700 text-base font-medium">
                    {isClient ? t("signIn.email", "Email address") : "Email address"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder={isClient ? t("signIn.emailPlaceholder", "you@example.com") : "you@example.com"}
                      disabled={isLoading}
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
                  <div className="flex justify-between items-center">
                    {" "}
                    <FormLabel className="text-gray-700 text-base font-medium">
                      {isClient ? t("signIn.password", "Password") : "Password"}
                    </FormLabel>
                    <Link
                      href="/forgot-password"
                      className=" text-primary hover:underline"
                    >
                      {isClient ? t("signIn.forgotPassword", "Forgot your password?") : "Forgot your password?"}
                    </Link>
                  </div>
                  <div className="relative">
                    <FormControl>
                      <Input
                        placeholder={isClient ? t("signIn.passwordPlaceholder", "••••••••") : "••••••••"}
                        type={showPassword ? "text" : "password"}
                        disabled={isLoading}
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
                        showPassword 
                          ? (isClient ? t("signIn.hidePassword", "Hide password") : "Hide password")
                          : (isClient ? t("signIn.showPassword", "Show password") : "Show password")
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" aria-hidden="true" />
                      ) : (
                        <Eye className="h-5 w-5" aria-hidden="true" />
                      )}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
            <div className="flex items-center space-x-3 cursor-pointer">
              <Checkbox
                id="remember-me"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                className="cursor-pointer h-5 w-5"
              />
              <label
                htmlFor="remember-me"
                className="text-base text-gray-600 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                onClick={() => setRememberMe(!rememberMe)}
              >
                {isClient ? t("signIn.rememberMe", "Remember me") : "Remember me"}
              </label>
            </div>
          </div>{" "}
          <Button
            type="submit"
            className="w-full rounded-md bg-primary py-3 font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-lg h-12 cursor-pointer"
            disabled={isLoading}
          >              {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {isClient ? t("signIn.signingIn", "Signing In...") : "Signing In..."}
              </>
            ) : (
              isClient ? t("signIn.signIn", "Sign in") : "Sign in"
            )}
          </Button>
         
        </form>
      </Form>
    </div>
  );
}
