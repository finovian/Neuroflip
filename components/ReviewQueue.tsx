"use client";
import React from "react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Check, RotateCw } from "lucide-react";
import { useFlashcardStore } from "@/store/useFlashcardStore";

const ReviewQueue = () => {
  return (

    <motion.div
      className="flex flex-col items-center justify-center p-6 text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="rounded-full bg-primary/10 p-6 mb-4"
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
      >
        <Check className="h-10 w-10 text-primary" />
      </motion.div>
      <h2 className="text-2xl font-bold mb-2">All caught up!</h2>
      <p className="text-muted-foreground mb-6">
        You&apos;ve reviewed all the flashcards in your queue.
      </p>
      <Button
        onClick={() => useFlashcardStore.getState().resetSession()}
        className="transition-all hover:scale-105"
      >
        <RotateCw className="mr-2 h-4 w-4" />
        Start New Session
      </Button>
    </motion.div>
  );
};

export default ReviewQueue;
