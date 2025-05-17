"use client";

import { useFlashcardStore } from "@/store/flashcardStore";

export default function StatsBar() {
  const { known, unknown } = useFlashcardStore();
  return (
    <div className="flex justify-center gap-6 mt-6 text-lg">
      <span className="text-green-600">✔ Known: {known.length}</span>
      <span className="text-red-600">✘ Unknown: {unknown.length}</span>
    </div>
  );
}
