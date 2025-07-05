/**
 * Checkout authentication utilities
 * These functions handle authentication redirection for the checkout flow
 */

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toastNotification } from "@/components/custom/toast-notification";
import { saveCallbackUrl } from "./redirects";

/**
 * Hook to handle authentication redirection for checkout page
 * 
 * @param t - Translation function
 * @returns Object containing authentication status
 */
export function useCheckoutAuth(t: (key: string, fallback?: string) => string) {
  const router = useRouter();
  const { status } = useSession();
  
  useEffect(() => {
    // Check authentication status
    if (status === "unauthenticated") {
      // Save the current URL for redirection after authentication
      saveCallbackUrl("/checkout");
      
      // Redirect to sign in page
      router.push("/signin");
      
      // Show notification
      toastNotification.info(
        t("auth.loginRequired", "Login Required"),
        t("checkout.loginRequired", "Please login to proceed to checkout")
      );
    }
  }, [status, router, t]);
  
  return { status };
}
