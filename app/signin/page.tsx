import { SignInForm } from "@/components/auth/SignInForm";
import { Metadata } from "next";
import { JSX } from "react/jsx-runtime";

/**
 * Metadata for the sign-in page
 */
export const metadata: Metadata = {
  title: "Sign In | Dashi",
  description: "Sign in to your Dashi account",
};

/**
 * SignIn Page Component
 *
 * Displays the sign-in form in a centered modal-like layout with a blurred background
 *
 * @returns {JSX.Element} The sign-in page component
 */
export default function SignInPage(): JSX.Element {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center">
      {/* Blurred background with overlay */}
      <div
        className="fixed inset-0 bg-background/10 bg-opacity-75 backdrop-blur-sm"
        aria-hidden="true"
      />

      {/* Background pattern (optional) */}
      <div
        className="fixed inset-0 bg-[url('/pattern.svg')] bg-cover opacity-5"
        aria-hidden="true"
      />

      {/* Dark overlay gradient */}
      <div
        className="fixed inset-0 bg-gradient-to-br from-primary/20 to-black/50"
        aria-hidden="true"
      />

      {/* Content wrapper with padding */}
      <div className="relative z-10 w-full max-w-md px-4 py-10 sm:px-0">
        <SignInForm />
      </div>
    </div>
  );
}
