"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "./Container";
import NavLinks from "./NavLinks";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import Image from "next/image";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";
import useTranslation from "@/hooks/useTranslation";

interface HeaderProps {
  className?: string;
}

/**
 * Header component for the application
 * Provides navigation links and responsive mobile menu
 */
export function Header({ className }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
 const { t } = useTranslation();

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
    >
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link href="/">
            <Image
              src="/logo.svg"
              alt="Dashi"
              width={100}
              height={100}
              priority
            />
          </Link>

          {/* Right side buttons */}
          <div className="flex items-center space-x-2">
            {/* Language Switcher - Desktop */}
            <div className="hidden md:flex">
              <LanguageSwitcher variant="simple" />
            </div>

            {/* Shopping Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="hidden md:flex">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </Link>

            {/* Auth Buttons - Desktop */}
            <div className="hidden md:flex items-center space-x-2">
              <Link href="/signin">
                <Button variant="ghost">  {t("auth.signIn", "Sign In")}</Button>
              </Link>
              <Link href="/signup">
                <Button
                  variant="default"
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  {t("auth.signUp", "Sign Up")}
                </Button>
              </Link>
            </div>

            {/* Mobile navigation */}
            <div className="md:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Menu">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>{" "}
                <SheetContent
                  side="right"
                  className="w-[250px] sm:w-[300px] p-0"
                >
                  <SheetHeader className="sr-only">
                    <SheetTitle>Navigation Menu</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col pt-6">
                    <NavLinks mobile />

                    {/* Language Switcher - Mobile */}
                    <div className="px-6 py-4">
                      <LanguageSwitcher variant="full" />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
}

export default Header;
