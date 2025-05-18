"use client";

import { Flashcard, FlashcardStats } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockFlashcards } from "@/constants/mockFlashcards";

interface FlashcardState {
  flashcards: Flashcard[];
  reviewQueue: string[];
  currentCard: Flashcard | null;
  stats: FlashcardStats;
  selectedCategories: string[];
  allCategories: string[];

  initializeStore: () => void;
  resetSession: () => void;
  markCardAsKnown: (id: string) => void;
  markCardAsUnknown: (id: string) => void;
  setSelectedCategories: (categories: string[]) => void;
}

export const useFlashcardStore = create<FlashcardState>()(
  persist(
    (set, get) => ({
      flashcards: [],
      reviewQueue: [],
      currentCard: null,
      stats: {
        known: 0,
        unknown: 0,
        streak: 0,
        lastReviewDate: null,
        history: [],
      },
      selectedCategories: [],
      allCategories: [],

      initializeStore: () => {
        const { flashcards, reviewQueue, stats } = get();

        if (flashcards.length === 0) {
          set({ flashcards: mockFlashcards });
        }

        const categories = Array.from(
          new Set(mockFlashcards.map((card) => card.category))
        );
        set({ allCategories: categories });

        // Initialize selected categories if empty
        if (get().selectedCategories.length === 0) {
          set({ selectedCategories: categories });
        }

        // Initialize review queue if empty
        if (reviewQueue.length === 0) {
          const filteredCards = get().flashcards.filter((card) =>
            get().selectedCategories.includes(card.category)
          );
          const shuffledIds = [...filteredCards.map((card) => card.id)].sort(
            () => Math.random() - 0.5
          );

          set({
            reviewQueue: shuffledIds,
            currentCard:
              filteredCards.find((card) => card.id === shuffledIds[0]) || null,
          });
        }

        // Update streak
        const today = new Date().toISOString().split("T")[0];
        const lastReviewDate = stats.lastReviewDate;

        if (lastReviewDate) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split("T")[0];

          // If last review was before yesterday, reset streak
          if (lastReviewDate < yesterdayStr) {
            set((state) => ({
              stats: {
                ...state.stats,
                streak: 0,
              },
            }));
          }
        }

        // Set today as review date if it's a new day
        if (!lastReviewDate || lastReviewDate !== today) {
          set((state) => ({
            stats: {
              ...state.stats,
              lastReviewDate: today,
            },
          }));
        }
      },

      resetSession: () => {
        const filteredCards = get().flashcards.filter((card) =>
          get().selectedCategories.includes(card.category)
        );
        const shuffledIds = [...filteredCards.map((card) => card.id)].sort(
          () => Math.random() - 0.5
        );

        set({
          reviewQueue: shuffledIds,
          currentCard:
            filteredCards.find((card) => card.id === shuffledIds[0]) || null,
        });
      },

      markCardAsKnown: (id: string) => {
        set((state) => {
          // Remove card from queue
          const newQueue = state.reviewQueue.filter((cardId) => cardId !== id);

          // Update stats
          const newStats = {
            ...state.stats,
            known: state.stats.known + 1,
          };

          // Update history
          const today = new Date().toISOString().split("T")[0];
          let history = [...state.stats.history];
          const todayEntry = history.find((entry) => entry.date === today);

          if (todayEntry) {
            history = history.map((entry) =>
              entry.date === today
                ? { ...entry, known: entry.known + 1 }
                : entry
            );
          } else {
            history.push({ date: today, known: 1, unknown: 0 });

            // Update streak if it's a new day
            if (state.stats.lastReviewDate !== today) {
              const yesterday = new Date();
              yesterday.setDate(yesterday.getDate() - 1);
              const yesterdayStr = yesterday.toISOString().split("T")[0];

              // Increment streak if last review was yesterday
              if (state.stats.lastReviewDate === yesterdayStr) {
                newStats.streak += 1;
              } else {
                newStats.streak = 1;
              }

              newStats.lastReviewDate = today;
            }
          }

          newStats.history = history;

          // Get next card
          const nextCard =
            newQueue.length > 0
              ? state.flashcards.find((card) => card.id === newQueue[0]) || null
              : null;

          return {
            reviewQueue: newQueue,
            currentCard: nextCard,
            stats: newStats,
          };
        });
      },

      markCardAsUnknown: (id: string) => {
        set((state) => {
          // Move card to end of queue for review later
          const newQueue = state.reviewQueue.filter((cardId) => cardId !== id);
          newQueue.push(id);

          // Update stats
          const newStats = {
            ...state.stats,
            unknown: state.stats.unknown + 1,
          };

          // Update history
          const today = new Date().toISOString().split("T")[0];
          let history = [...state.stats.history];
          const todayEntry = history.find((entry) => entry.date === today);

          if (todayEntry) {
            history = history.map((entry) =>
              entry.date === today
                ? { ...entry, unknown: entry.unknown + 1 }
                : entry
            );
          } else {
            history.push({ date: today, known: 0, unknown: 1 });

            // Update streak if it's a new day
            if (state.stats.lastReviewDate !== today) {
              const yesterday = new Date();
              yesterday.setDate(yesterday.getDate() - 1);
              const yesterdayStr = yesterday.toISOString().split("T")[0];

              // Increment streak if last review was yesterday
              if (state.stats.lastReviewDate === yesterdayStr) {
                newStats.streak += 1;
              } else {
                newStats.streak = 1;
              }

              newStats.lastReviewDate = today;
            }
          }

          newStats.history = history;

          // Get next card
          const nextCard =
            newQueue.length > 0
              ? state.flashcards.find((card) => card.id === newQueue[0]) || null
              : null;

          return {
            reviewQueue: newQueue,
            currentCard: nextCard,
            stats: newStats,
          };
        });
      },

      setSelectedCategories: (categories: string[]) => {
        set({ selectedCategories: categories });
        get().resetSession();
      },
    }),
    {
      name: "neuroflip-storage",
      partialize: (state) => ({
        stats: state.stats,
        selectedCategories: state.selectedCategories,
      }),
    }
  )
);
