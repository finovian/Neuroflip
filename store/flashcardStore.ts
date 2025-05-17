import { flashcards } from "@/constants/cards";
import { create } from "zustand";

interface Flashcard {
  id: number;
  front: string;
  back: string;
}

interface FlashcardState {
  cards: Flashcard[];
  current: number;
  known: number[];
  unknown: number[];
  markKnown: () => void;
  markUnknown: () => void;
  nextCard: () => void;
  reset: () => void;
}

export const useFlashcardStore = create<FlashcardState>((set, get) => ({
  cards: flashcards,
  current: 0,
  known: [],
  unknown: [],
  markKnown: () => {
    const { known, current, cards } = get();
    if (!known.includes(cards[current].id)) {
      set({ known: [...known, cards[current].id] });
    }
  },
  markUnknown: () => {
    const { unknown, current, cards } = get();
    if (!unknown.includes(cards[current].id)) {
      set({ unknown: [...unknown, cards[current].id] });
    }
  },
  nextCard: () => {
    const { current, cards } = get();
    set({ current: (current + 1) % cards.length });
  },
  reset: () => set({ current: 0, known: [], unknown: [] }),
}));
