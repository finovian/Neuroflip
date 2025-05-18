"use client";

import { toast as sonnerToast } from "sonner";
import { ToastProps } from "@/types";

export function useToast() {
  const toast = ({
    title,
    description,
    variant = "default",
    ...props
  }: ToastProps) => {
    const getToastType = () => {
      switch (variant) {
        case "success":
          return "success";
        case "destructive":
          return "error";
        case "info":
          return "info";
        case "warning":
          return "warning";
        default:
          return undefined;
      }
    };

    const toastType = getToastType();
    const content = (
      <div className="flex gap-2">
        <div>
          {title && <div className="font-semibold">{title}</div>}
          {description && (
            <div className="text-sm opacity-90">{description}</div>
          )}
        </div>
      </div>
    );

    if (toastType) {
      return sonnerToast[toastType](content, props);
    }
    return sonnerToast(content, props);
  };

  return { toast };
}
