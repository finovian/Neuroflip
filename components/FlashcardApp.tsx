"use client";

import { useEffect, useState } from "react";

import { useMobile } from "@/hooks/useMobile";
import { useToast } from "@/hooks/useToast";
import { useFlashcardStore } from "@/store/useFlashcardStore";
import { AnimatePresence, motion } from "framer-motion";
import { BarChart2, Menu, RefreshCw, Volume2, VolumeX, X } from "lucide-react";
import CategoryFilter from "./CategoryFilter";
import FlashcardReview from "./FlashcardReview";
import { useSound } from "../provider/SoundProvider";
import StatsBar from "./StatsBar";
import StatsView from "./StatsView";
import ThemeToggle from "./ThemeToggle";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export default function FlashcardApp() {
  const {
    initializeStore,
    resetSession,
    reviewQueue,
    setSelectedCategories,
    selectedCategories,
    allCategories,
    stats,
  } = useFlashcardStore();
  const [mounted, setMounted] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const { toast } = useToast();
  const isMobile = useMobile();
  const { isSoundEnabled, toggleSound } = useSound();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    initializeStore();
    setMounted(true);
  }, [initializeStore]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!reviewQueue.length) return;

      if (e.key === " " || e.key === "Enter") {
        // Flip card on space or enter
        document.getElementById("flip-button")?.click();
      } else if (e.key === "ArrowRight" || e.key === "k") {
        // Mark as known
        document.getElementById("know-button")?.click();
      } else if (e.key === "ArrowLeft" || e.key === "d") {
        // Mark as don't know
        document.getElementById("dont-know-button")?.click();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [reviewQueue.length]);

  const handleResetSession = () => {
    resetSession();
    toast({
      title: "Session Reset",
      description: "Your review session has been reset with new cards.",
      variant: "info",
    });
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="h-[100dvh] w-full flex flex-col md:flex-row overflow-hidden theme-transition">
      {/* Mobile Header */}
      {isMobile && (
        <div className="mobile-header flex justify-between items-center theme-transition">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
              NeuroFlip
            </h1>
            <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
              Beta
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSound}
              className="h-8 w-8"
              aria-label={isSoundEnabled ? "Disable sound" : "Enable sound"}
            >
              {isSoundEnabled ? (
                <Volume2 className="h-4 w-4" />
              ) : (
                <VolumeX className="h-4 w-4" />
              )}
            </Button>

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setIsSheetOpen(true)}
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>

              <SheetContent side="top" className="pt-12 theme-transition">
                <div className="flex flex-col gap-3 p-3">
                  <CategoryFilter
                    categories={allCategories}
                    selectedCategories={selectedCategories}
                    onChange={setSelectedCategories}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResetSession}
                    className="w-full justify-start"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset Session
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setStatsOpen(!statsOpen);
                      setIsSheetOpen(false);
                    }}
                    className={`w-full justify-start ${statsOpen ? "bg-primary/10" : ""
                      }`}
                  >
                    <BarChart2 className="h-4 w-4 mr-2" />
                    {statsOpen ? "Hide Stats" : "Show Stats"}
                  </Button>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Theme</span>
                    <ThemeToggle />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Sound</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={toggleSound}
                      className="h-8 w-8"
                      aria-label={
                        isSoundEnabled ? "Disable sound" : "Enable sound"
                      }
                    >
                      {isSoundEnabled ? (
                        <Volume2 className="h-4 w-4" />
                      ) : (
                        <VolumeX className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      )}

      {/* Main Content */}
      <motion.div
        className="flex-1 flex flex-col h-full overflow-hidden theme-transition"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Desktop Header */}
        {!isMobile && (
          <header className="flex justify-between items-center p-4 md:p-6 theme-transition">
            <motion.div
              className="flex items-center gap-2"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                NeuroFlip
              </h1>
              <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                Beta
              </span>
            </motion.div>

            <TooltipProvider>
              <div className="flex items-center gap-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleSound}
                      aria-label={
                        isSoundEnabled ? "Disable sound" : "Enable sound"
                      }
                    >
                      {isSoundEnabled ? (
                        <Volume2 className="h-4 w-4" />
                      ) : (
                        <VolumeX className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isSoundEnabled ? "Disable sound" : "Enable sound"}</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <CategoryFilter
                        categories={allCategories}
                        selectedCategories={selectedCategories}
                        onChange={setSelectedCategories}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Filter flashcards by category</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleResetSession}
                      className="transition-all hover:scale-105"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Reset session</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setStatsOpen(!statsOpen)}
                      className={`transition-all hover:scale-105 ${statsOpen ? "bg-primary/10" : ""
                        }`}
                    >
                      <BarChart2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Toggle stats panel</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <ThemeToggle />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Toggle theme</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </header>
        )}

        {/* Stats Bar */}
        <div className={`px-4 md:px-6 ${isMobile ? "mt-16" : ""}`}>
          <StatsBar />
        </div>

        {/* Flashcard Area */}
        <div className="flex-1 flex items-center justify-center p-4 md:p-6">
          <FlashcardReview statsOpen={statsOpen} />
        </div>

        {/* Footer - only on desktop */}
        {!isMobile && (
          <footer className="text-center text-sm text-muted-foreground p-4">
            <p>
              Keyboard shortcuts: Space (flip), → or K (know), ← or D
              (don&apos;t know)
            </p>
          </footer>
        )}
      </motion.div>

      {/* Stats Sidebar */}
      <AnimatePresence>
        {statsOpen && (
          <motion.div
            className="w-full md:w-80 lg:w-96 h-full bg-card border-l overflow-hidden flex flex-col theme-transition"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="flex justify-between items-center p-4 border-b theme-transition">
              <h2 className="text-lg font-medium">Your Progress</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setStatsOpen(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
              <StatsView stats={stats} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
