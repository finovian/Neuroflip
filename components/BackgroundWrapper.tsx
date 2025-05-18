"use client";

import type React from "react";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function BackgroundWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-full w-full">{children}</div>;
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div
        className={cn(
          "absolute inset-0 w-full h-full opacity-10 pointer-events-none bg-repeat bg-[length:600px]",
          theme === "dark"
            ? "bg-[url('/images/45.jpg')]"
            : "bg-[url('/images/45.jpg')]"
        )}
      />

      <div
        className={cn(
          "absolute inset-0 w-full h-full pointer-events-none",
          theme === "dark"
            ? "bg-[radial-gradient(circle_at_50%_50%,rgba(13,17,23,0)_0%,rgba(13,17,23,0.7)_100%)]"
            : "bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0)_0%,rgba(255,255,255,0.8)_100%)]"
        )}
      />

      {/* Content */}
      <div className="relative z-10 h-full w-full">{children}</div>
    </div>
  );
}
