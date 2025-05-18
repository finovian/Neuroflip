import type React from "react";
import type { Metadata, Viewport } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/provider/ThemeProvider";
import { SoundProvider } from "@/provider/SoundProvider";
import BackgroundWrapper from "@/components/BackgroundWrapper";
import ToastProvider from "@/provider/ToasterProvider";

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NeuroFlip - Flashcard Learning App",
  description: "A modern flashcard app with spaced repetition",
  icons: {
    icon: "/favicon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="overflow-hidden">
      <body
        className={`${quicksand.variable} font-sans antialiased overflow-hidden h-[100dvh]`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
          storageKey="neuroflip-theme"
        >
          <SoundProvider>
            <BackgroundWrapper>
              {children}
              <ToastProvider />
            </BackgroundWrapper>
          </SoundProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
