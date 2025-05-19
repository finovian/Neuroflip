"use client";

import { useMobile } from "@/hooks/useMobile";
import { Toaster } from "sonner";

export default function ToastProvider() {
  const isMobile = useMobile();

  return (
    <Toaster
      position={isMobile ? "top-right" : "bottom-right"}
      closeButton
      richColors
    />
  );
}
