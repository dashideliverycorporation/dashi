"use client";

import { LogOut, Moon, Sun} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type HeaderProps = {
  username: string;
  email: string;
};

export function Header({ username, email }: HeaderProps) {
  const { setTheme } = useTheme();
  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/signin" });
  };
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-end bg-background px-6 md:px-8">
      <div className="ml-auto flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative flex items-center gap-2 cursor-pointer"
              aria-label="User menu"
            >
              <Avatar>
                <AvatarImage src="https://github.com/shad.png" />
                <AvatarFallback>
                  {username.split(' ').length > 1 
                    ? `${username.split(' ')[0][0].toUpperCase()}${username.split(' ')[1][0].toUpperCase()}`
                    : username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <span className="hidden md:inline-block font-medium">
                {username}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled className="flex flex-col items-start">
              <span className="text-sm font-medium">{username}</span>
              <span className="text-xs text-muted-foreground">{email}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <DropdownMenuItem className="flex items-center gap-2 text-sm font-medium rounded-md p-2 cursor-pointer">
                  <span className="relative flex items-center gap-2 ">
                    <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Theme</span>
                    <span>Toggle theme</span>
                  </span>
                </DropdownMenuItem>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer rounded-md"
            >
              <LogOut className="h-5 w-5 hover:text-primary" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
