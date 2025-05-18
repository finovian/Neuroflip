"use client";

import { AnimatePresence, motion } from "framer-motion";
import type React from "react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/utils/utils";
import { Check, Volume2, X } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMobile } from "@/hooks/useMobile";
import { useToast } from "@/hooks/useToast";
import { useFlashcardStore } from "@/store/useFlashcardStore";
import { useSound } from "../provider/SoundProvider";
import ReviewQueue from "./ReviewQueue";

export default function FlashcardReview({ statsOpen }: { statsOpen: boolean }) {
  const { reviewQueue, markCardAsKnown, markCardAsUnknown, currentCard } =
    useFlashcardStore();
  const [isFlipped, setIsFlipped] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const { toast } = useToast();
  const isMobile = useMobile();
  const { playFlipSound, playSuccessSound, playErrorSound } = useSound();
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsFlipped(false);
  }, [currentCard?.id]);

  const handleFlip = () => {
    if (!isRevealing) {
      setIsFlipped(!isFlipped);
      playFlipSound();
    }
  };

  const handleKnow = () => {
    if (currentCard && isFlipped) {
      setIsRevealing(true);
      playSuccessSound();

      setTimeout(() => {
        markCardAsKnown(currentCard.id);
        setIsRevealing(false);
        toast({
          title: "Card Marked as Known",
          description: "This card will be removed from your current session.",
          variant: "success",
        });
      }, 300);
    } else if (!isFlipped) {
      toast({
        title: "Flip the card first",
        description: "You need to see the answer before marking it as known.",
        variant: "info",
      });
    }
  };

  const handleDontKnow = () => {
    if (currentCard && isFlipped) {
      setIsRevealing(true);
      playErrorSound();

      setTimeout(() => {
        markCardAsUnknown(currentCard.id);
        setIsRevealing(false);
        toast({
          title: "Card Marked for Review",
          description: "This card will appear again later in your session.",
          variant: "warning",
        });
      }, 300);
    } else if (!isFlipped) {
      toast({
        title: "Flip the card first",
        description: "You need to see the answer before marking it.",
        variant: "info",
      });
    }
  };

  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);

      toast({
        title: "Text-to-Speech",
        description: "Reading card content aloud",
        variant: "info",
      });
    } else {
      toast({
        title: "Text-to-Speech Unavailable",
        description: "Your browser doesn't support text-to-speech",
        variant: "destructive",
      });
    }
  };

  // Handle drag gestures for card flipping
  const handleDragStart = (e: React.PointerEvent) => {
    if (isRevealing) return;
    setDragStartX(e.clientX);
  };

  const handleDragEnd = (e: React.PointerEvent) => {
    if (isRevealing) return;

    const dragEndX = e.clientX;
    const dragDistance = dragEndX - dragStartX;

    // If dragged far enough, flip the card
    if (Math.abs(dragDistance) > 50) {
      handleFlip();
    }
  };

  if (reviewQueue.length === 0) {
    return <ReviewQueue />;
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div
        className="flip-card-container"
        ref={cardRef}
        onPointerDown={handleDragStart}
        onPointerUp={handleDragEnd}
      >
        <div className="card-3d-wrapper">
          {/* Interactive area for flipping */}
          <Button
            id="flip-button"
            variant="ghost"
            className="absolute inset-0 w-full h-full p-0 m-0 cursor-pointer z-10"
            onClick={handleFlip}
          >
            <span className="sr-only">Flip Card</span>
          </Button>

          <div className={`card-3d ${isFlipped ? "flipped" : ""}`}>
            {/* Front of card (Question) */}
            <div className="card-face glass-card">
              <div className="card-side-indicator question-indicator">Q</div>

              <div className="w-full h-full flex flex-col items-center justify-center p-8 overflow-hidden card-shine">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 opacity-70 hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          speakText(currentCard?.question || "");
                        }}
                      >
                        <Volume2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Read aloud</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <div className="absolute top-4 left-16 px-2 py-1 bg-primary/10 text-xs font-medium rounded-full">
                  {currentCard?.category}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={`question-${currentCard?.id}`}
                    className="text-center max-w-full break-words"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-xl md:text-2xl font-medium">
                      {currentCard?.question}
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="absolute bottom-4 right-4 text-xs text-muted-foreground">
                  Card {reviewQueue.indexOf(currentCard?.id || "") + 1} of{" "}
                  {reviewQueue.length}
                </div>
              </div>
            </div>

            {/* Back of card (Answer) */}
            <div className="card-face card-face-back glass-card bg-primary/5">
              <div className="card-side-indicator answer-indicator">A</div>

              <div className="w-full h-full flex flex-col items-center justify-center p-8 overflow-hidden card-shine">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 opacity-70 hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          speakText(currentCard?.answer || "");
                        }}
                      >
                        <Volume2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Read aloud</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <div className="absolute top-4 left-16 px-2 py-1 bg-primary/10 text-xs font-medium rounded-full">
                  {currentCard?.category}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={`answer-${currentCard?.id}`}
                    className="text-center max-w-full break-words"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-xl md:text-2xl font-medium text-primary">
                      {currentCard?.answer}
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="absolute bottom-4 right-4 text-xs text-muted-foreground">
                  Card {reviewQueue.indexOf(currentCard?.id || "") + 1} of{" "}
                  {reviewQueue.length}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons - desktop */}
      {!isMobile && (
        <div className="flex gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  id="dont-know-button"
                  variant="outline"
                  size="lg"
                  onClick={handleDontKnow}
                  disabled={isRevealing}
                  className={cn(
                    "w-32 transition-all",
                    isFlipped
                      ? "hover:border-destructive/50 hover:bg-destructive/5"
                      : "opacity-70"
                  )}
                >
                  <X className="mr-2 h-4 w-4" />
                  Don&apos;t Know
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Mark card for review (←)</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleFlip}
                  disabled={isRevealing}
                  className="w-32 transition-all hover:bg-primary/5"
                >
                  <motion.div
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.5 }}
                    className="mr-2"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M3 7L21 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M7 3V21"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>
                  Flip
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Flip card (Space)</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  id="know-button"
                  size="lg"
                  onClick={handleKnow}
                  disabled={isRevealing}
                  className={cn(
                    "w-32 transition-all",
                    isFlipped ? "hover:scale-105" : "opacity-70"
                  )}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Know
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Mark card as known (→)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}

      {/* Action buttons - mobile */}
      {isMobile && !statsOpen && (
        <div className="mobile-action-buttons">
          <Button
            id="dont-know-button"
            variant="outline"
            onClick={handleDontKnow}
            disabled={isRevealing}
            className={cn(
              "flex-1 transition-all",
              isFlipped
                ? "hover:border-destructive/50 hover:bg-destructive/5"
                : "opacity-70"
            )}
          >
            <X className="mr-2 h-4 w-4" />
            Don&apos;t Know
          </Button>

          <Button
            variant="outline"
            onClick={handleFlip}
            disabled={isRevealing}
            className="flex-1 transition-all hover:bg-primary/5"
          >
            <motion.div
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.5 }}
              className="mr-2"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3 7L21 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7 3V21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
            Flip
          </Button>

          <Button
            id="know-button"
            onClick={handleKnow}
            disabled={isRevealing}
            className={cn(
              "flex-1 transition-all",
              isFlipped ? "hover:scale-105" : "opacity-70"
            )}
          >
            <Check className="mr-2 h-4 w-4" />
            Know
          </Button>
        </div>
      )}
    </div>
  );
}
