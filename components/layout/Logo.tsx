import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

/**
 * Logo component that displays the Dashi logo with optional sizing
 */
export function Logo({ className, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: { height: 32, width: 110 },
    md: { height: 40, width: 138 },
    lg: { height: 48, width: 166 },
  };

  return (
    <Link href="/" className={cn("inline-block", className)}>
      <Image
        src="/logo.svg"
        alt="Dashi"
        width={100}
        height={sizeClasses[size].height}
        className="h-auto w-auto"
        priority
      />
    </Link>
  );
}

export default Logo;
