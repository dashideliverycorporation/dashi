/**
 * Auth redirection utilities
 * These functions handle various redirection scenarios in the authentication flow
 */

/**
 * Get the appropriate redirect URL after successful authentication based on user role
 * 
 * @param role - The user's role (ADMIN, RESTAURANT, or CUSTOMER)
 * @param callbackUrl - Optional callback URL to redirect to after authentication
 * @returns The URL to redirect to
 */
export function getRoleBasedRedirectUrl(
  role: string | undefined,
  callbackUrl?: string | null
): string {
  // For admin users, always redirect to admin dashboard
  if (role === "ADMIN") {
    return "/admin";
  }

  // For restaurant users, always redirect to restaurant dashboard
  if (role === "RESTAURANT") {
    return "/restaurant";
  }

  // For customer users, redirect to callback URL if provided, otherwise to homepage
  return callbackUrl && !isProtectedRolePath(callbackUrl) ? callbackUrl : "/";
}

/**
 * Check if a path is a role-protected path that should not be used as a callback
 * for users without the appropriate role
 * 
 * @param path - The path to check
 * @returns True if the path is protected by role, false otherwise
 */
export function isProtectedRolePath(path: string): boolean {
  // Admin and restaurant paths are protected
  return path.startsWith("/admin") || path.startsWith("/restaurant");
}

/**
 * Save the current URL to localStorage for redirection after authentication
 * 
 * @param url - The URL to save
 */
export function saveCallbackUrl(url: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("authCallbackUrl", url);
    console.debug("Saved callback URL to localStorage:", url);
  }
}

/**
 * Get the saved callback URL from localStorage
 * 
 * @returns The saved callback URL, or null if none exists
 */
export function getCallbackUrl(): string | null {
  if (typeof window !== "undefined") {
    const url = localStorage.getItem("authCallbackUrl");
    console.debug("Retrieved callback URL from localStorage:", url);
    return url;
  }
  return null;
}

/**
 * Clear the saved callback URL from localStorage
 */
export function clearCallbackUrl(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authCallbackUrl");
    console.debug("Cleared callback URL from localStorage");
  }
}
