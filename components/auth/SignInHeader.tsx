"use client";

import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import { JSX } from "react/jsx-runtime";
import { useState, useEffect } from "react";

/**
 * Client component for translated sign-in header content
 * 
 * @returns {JSX.Element} The translated sign-in header
 */
export function SignInHeader(): JSX.Element {
  const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);
  
  // This ensures hydration completes before showing translated content
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) {
    return (
      <>
        <h1 className="mb-2 text-center text-3xl font-bold text-gray-900">
          Sign in to your account
        </h1>
        <p className="mb-8 text-center text-base text-gray-600">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-primary text-base hover:underline">
            Create a new account
          </Link>
        </p>
      </>
    );
  }
  
  return (
    <>
      <h1 className="mb-2 text-center text-3xl font-bold text-gray-900">
        {t("signIn.title", "Sign in to your account")}
      </h1>
      <p className="mb-8 text-center text-base text-gray-600">
        {t("auth.noAccount", "Don't have an account?")}{" "}
        <Link href="/signup" className="text-primary text-base hover:underline">
          {t("auth.createAccount", "Create a new account")}
        </Link>
      </p>
    </>
  );
}
