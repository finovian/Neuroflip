import Flashcard from "@/components/Flashcard";
import StatsBar from "@/components/StatsBar";
import React from "react";

const page = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl font-bold mb-8">🧠 NeuroFlip</h1>
      <Flashcard />
      <StatsBar />
    </div>
  );
};

export default page;
