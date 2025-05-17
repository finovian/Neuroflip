"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useFlashcardStore } from "@/store/flashcardStore";

export default function Flashcard() {
  const { cards, current, markKnown, markUnknown, nextCard } =
    useFlashcardStore();
  const [flipped, setFlipped] = useState(false);
  const card = cards[current];

  const handleAction = (isKnown: boolean) => {
    if (isKnown) {
      markKnown();
    } else {
      markUnknown();
    }
    setFlipped(false);
    setTimeout(nextCard, 300);
  };

  return (
    <div className="flex flex-col items-center">
      <motion.div
        className="w-96 h-60 bg-white shadow-lg rounded-xl cursor-pointer flex items-center justify-center text-xl text-gray-800 font-semibold border"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        onClick={() => setFlipped(!flipped)}
        style={{
          perspective: 1000,
          transformStyle: "preserve-3d",
          transform: `rotateY(${flipped ? 180 : 0}deg)`,
        }}
      >
        <div className="absolute">{!flipped ? card.front : card.back}</div>
      </motion.div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={() => handleAction(true)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Know
        </button>
        <button
          onClick={() => handleAction(false)}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Don't Know
        </button>
      </div>
    </div>
  );
}
