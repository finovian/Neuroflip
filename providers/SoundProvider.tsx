"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

interface SoundContextType {
  playFlipSound: () => void;
  playSuccessSound: () => void;
  playErrorSound: () => void;
  isSoundEnabled: boolean;
  toggleSound: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [flipSound, setFlipSound] = useState<HTMLAudioElement | null>(null);
  const [successSound, setSuccessSound] = useState<HTMLAudioElement | null>(
    null
  );
  const [errorSound, setErrorSound] = useState<HTMLAudioElement | null>(null);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [, setIsInitialized] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const soundPref = localStorage.getItem("neuroflip-sound-enabled");
      if (soundPref !== null) {
        setIsSoundEnabled(soundPref === "true");
      }

      const flip = new Audio("/sounds/page-flip.mp3");
      const success = new Audio("/sounds/success.mp3");
      const error = new Audio("/sounds/error.mp3");

      flip.volume = 0.3;
      success.volume = 0.2;
      error.volume = 0.2;

      flip.load();
      success.load();
      error.load();

      setFlipSound(flip);
      setSuccessSound(success);
      setErrorSound(error);
      setIsInitialized(true);
    }
  }, []);

  const playFlipSound = () => {
    if (flipSound && isSoundEnabled) {
      flipSound.currentTime = 0;
      flipSound.play().catch((e) => console.log("Audio play failed:", e));
    }
  };

  const playSuccessSound = () => {
    if (successSound && isSoundEnabled) {
      successSound.currentTime = 0;
      successSound.play().catch((e) => console.log("Audio play failed:", e));
    }
  };

  const playErrorSound = () => {
    if (errorSound && isSoundEnabled) {
      errorSound.currentTime = 0;
      errorSound.play().catch((e) => console.log("Audio play failed:", e));
    }
  };

  const toggleSound = () => {
    const newState = !isSoundEnabled;
    setIsSoundEnabled(newState);
    localStorage.setItem("neuroflip-sound-enabled", newState.toString());
  };

  return (
    <SoundContext.Provider
      value={{
        playFlipSound,
        playSuccessSound,
        playErrorSound,
        isSoundEnabled,
        toggleSound,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error("useSound must be used within a SoundProvider");
  }
  return context;
}
