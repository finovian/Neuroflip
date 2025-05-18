"use client"

import type React from "react"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

function Toaster({ ...props }: ToasterProps) {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as "light" | "dark" | "system"}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success:
            "group-[.toaster]:border-green-500 group-[.toaster]:bg-green-500/10 group-[.toaster]:text-green-700 dark:group-[.toaster]:text-green-300",
          error:
            "group-[.toaster]:border-red-500 group-[.toaster]:bg-red-500/10 group-[.toaster]:text-red-700 dark:group-[.toaster]:text-red-300",
          info: "group-[.toaster]:border-blue-500 group-[.toaster]:bg-blue-500/10 group-[.toaster]:text-blue-700 dark:group-[.toaster]:text-blue-300",
          warning:
            "group-[.toaster]:border-yellow-500 group-[.toaster]:bg-yellow-500/10 group-[.toaster]:text-yellow-700 dark:group-[.toaster]:text-yellow-300",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
