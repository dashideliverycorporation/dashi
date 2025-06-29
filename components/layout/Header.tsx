"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LogOut, Menu, Moon, Sun } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import Image from "next/image";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";
import useTranslation from "@/hooks/useTranslation";
import CartIcon from "@/components/cart/CartIcon";
import { useCart } from "@/components/cart/use-cart";
import { useSession, signOut } from "next-auth/react";

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
  const { itemCount } = useCart();
  const { data: session, status } = useSession();
  const { setTheme } = useTheme();
  
  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/signin" });
  };

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
          <div className="hidden lg:block">
            <Image
              src="/logo.svg"
              alt="Dashi"
              width={100}
              height={100}
              priority
            />
          </div>
          <div className="block lg:hidden">
            <Image
              src="/logo.svg"
              alt="Dashi"
              width={80}
              height={80}
              priority
            />
          </div>
          </Link>

          {/* Right side buttons */}
          <div className="flex items-center space-x-2">
            {/* Language Switcher - Desktop */}
            <div className="hidden md:flex">
              <LanguageSwitcher variant="simple" />
            </div>
            {/* Shopping Cart */}
            <CartIcon />
            {/* Auth Buttons or User Menu - Desktop */}
            
            {status === "authenticated" && session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="hidden relative md:flex items-center gap-2 cursor-pointer"
                    aria-label="User menu"
                  >
                    <Avatar>
                      <AvatarImage src="https://github.com/shad.png" />
                      <AvatarFallback>
                        {session.user.name 
                          ? (session.user.name.split(' ').length > 1 
                              ? `${session.user.name.split(' ')[0][0].toUpperCase()}${session.user.name.split(' ')[1][0].toUpperCase()}`
                              : session.user.name[0].toUpperCase())
                          : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline-block font-medium">
                      {session.user.name || t("common.user", "User")}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem disabled className="flex flex-col items-start">
                    <span className="text-sm font-medium">{session.user.name || t("common.user", "User")}</span>
                    <span className="text-xs text-muted-foreground">{session.user.email || ""}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <Link href="/order-history" className="w-full">
                    <DropdownMenuItem className="cursor-pointer">
                      {t("order.history", "Order History")}
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <DropdownMenuItem className="flex items-center gap-2 text-sm font-medium rounded-md p-2 cursor-pointer">
                        <span className="relative flex items-center gap-2 ">
                          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                          <span className="sr-only">Theme</span>
                          <span>{t("common.toggleTheme", "Toggle theme")}</span>
                        </span>
                      </DropdownMenuItem>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setTheme("light")}>
                        {t("common.light", "Light")}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme("dark")}>
                        {t("common.dark", "Dark")}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme("system")}>
                        {t("common.system", "System")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer rounded-md"
                  >
                    <LogOut className="h-5 w-5 mr-2 hover:text-primary" />
                    <span>{t("auth.signOut", "Sign out")}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link href="/signin">
                  <Button variant="ghost">{t("auth.signIn", "Sign In")}</Button>
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
            )}
            {/* Mobile navigation */}
            <div className="md:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Menu"
                    className="relative"
                  >
                    <Menu className="h-6 w-6" />
                    {itemCount > 0 && (
                      <div
                        className="absolute top-2.5 right-2 h-1.5 w-1.5 rounded-full bg-orange-500 ring-2 ring-white"
                        aria-label={`${itemCount} items in cart`}
                      />
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-full sm:w-[300px] p-0"
                >
                  <SheetHeader className="sr-only">
                    <SheetTitle>Navigation Menu</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col pt-6">
                    <NavLinks mobile />
                    
                    {/* Auth section - Mobile */}
                    {status === "authenticated" && session?.user ? (
                      <div className="px-6 py-4 border-t border-border">
                        <div className="flex items-center gap-3 mb-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src="https://github.com/shad.png" />
                            <AvatarFallback>
                              {session.user.name 
                                ? (session.user.name.split(' ').length > 1 
                                    ? `${session.user.name.split(' ')[0][0].toUpperCase()}${session.user.name.split(' ')[1][0].toUpperCase()}`
                                    : session.user.name[0].toUpperCase())
                                : 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium">{session.user.name || t("common.user", "User")}</span>
                            <span className="text-xs text-muted-foreground">{session.user.email || ""}</span>
                          </div>
                        </div>
                        <Link href="/order-history" className="w-full">
                          <Button variant="ghost" className="w-full justify-start mb-2">
                            {t("order.history", "Order History")}
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start mb-2"
                          onClick={() => setTheme(theme => theme === "light" ? "dark" : "light")}
                        >
                          <span className="relative flex items-center gap-2">
                            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            <span>{t("common.toggleTheme", "Toggle theme")}</span>
                          </span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                          onClick={handleLogout}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          <span>{t("auth.signOut", "Sign out")}</span>
                        </Button>
                      </div>
                    ) : (
                      <div className="px-6 py-4 flex flex-col space-y-2">
                          <Link href="/signin" className="w-full py-2 hover:bg-gray-100">
                              {t("auth.signIn", "Sign In")}
                           
                          </Link>
                          <Link href="/signup" className="w-full py-2 hover:bg-gray-100">
                          {t("auth.signUp", "Sign Up")}
                          </Link>

                      </div>
                    )}
                    
                    {/* Language Switcher - Mobile */}
                    <div className="px-6 py-4 border-t border-border">
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
