import React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full" | "none";
  className?: string;
}

/**
 * Container component for consistent width constraints across the application
 * Provides standard padding and configurable maximum widths
 */
export function Container({
  children,
  maxWidth = "xl",
  className,
  ...props
}: ContainerProps) {
  const maxWidthClasses = {
    sm: "max-w-screen-sm",
    md: "max-w-screen-md",
    lg: "max-w-screen-lg",
    xl: "max-w-screen-xl",
    "2xl": "max-w-screen-2xl",
    full: "max-w-full",
    none: "",
  };

  return (
    <div
      className={cn(
        "w-full px-4 mx-auto md:px-6",
        maxWidthClasses[maxWidth],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default Container;
