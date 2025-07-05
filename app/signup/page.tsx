import { SignUpForm } from "@/components/auth/SignUpForm";
import { Metadata } from "next";
import { JSX } from "react/jsx-runtime";
import Image from "next/image";
import Link from "next/link";

/**
 * Metadata for the registration page
 */
export const metadata: Metadata = {
  title: "Register | Dashi",
  description: "Create a new customer account on Dashi",
};

/**
 * RegisterPage Component
 *
 * Displays the customer registration form in a clean, centered layout inspired by modern signup designs
 *
 * @returns {JSX.Element} The registration page component
 */
export default function RegisterPage(): JSX.Element {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white">
      <div className="flex w-full max-w-md flex-col items-center px-4">
        {/* Logo */}
        <Link href="/">
        <div className="flex justify-center py-8">
          <Image
            src="/logo.svg"
            alt="Dashi Logo"
            width={150}
            height={60}
            priority
          />
        </div>
        </Link>

        {/* Title */}
        <h1 className="mb-2 text-center text-3xl font-bold text-gray-900">
          Create an account
        </h1>
        <p className="mb-8 text-center text-base text-gray-600">
          Already have an account?{" "}
          <a href="/signin" className="text-primary text-base hover:underline">
            Sign in
          </a>
        </p>

        {/* Form container */}
        <div className="w-full">
          <SignUpForm />
        </div>
      </div>
    </div>
  );
}
