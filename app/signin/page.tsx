import { SignInForm } from "@/components/auth/SignInForm";
import { Metadata } from "next";
import { JSX } from "react/jsx-runtime";
import Image from "next/image";

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
 * Displays the sign-in form in a clean, centered layout inspired by modern login designs
 *
 * @returns {JSX.Element} The sign-in page component
 */
export default function SignInPage(): JSX.Element {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white">
      <div className="flex w-full max-w-md flex-col items-center px-4">
        {/* Logo */}
        <div className="flex justify-center py-8">
          <Image
            src="/logo.svg"
            alt="Dashi Logo"
            width={150}
            height={60}
            priority
          />
        </div>

        {/* Title */}
        <h1 className="mb-2 text-center text-3xl font-bold text-gray-900">
          Sign in to your account
        </h1>
        <p className="mb-8 text-center text-base text-gray-600">
          Or{" "}
          <a href="/signup" className="text-primary text-base hover:underline">
            create a new account
          </a>
        </p>

        {/* Form container */}
        <div className="w-full">
          <SignInForm />
        </div>
      </div>
    </div>
  );
}
