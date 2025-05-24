"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-2">
        <Image
          src="/logo.svg"
          alt="Dashi Logo"
          width={150}
          height={60}
          priority
        />
        <div className="flex items-center space-x-4 ml-8">
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className={cn("h-3 w-3 rounded-full bg-primary animate-bounce", {
                "animation-delay-200": index === 2,
                "animation-delay-100": index === 1,
              })}
            />
          ))}
        </div>
        {/* <div className="text-sm font-medium text-primary">Loading...</div> */}
      </div>
    </div>
  );
};

export default Loading;
