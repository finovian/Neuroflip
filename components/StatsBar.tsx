"use client";

import { Flame, Brain, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useMobile } from "@/hooks/useMobile";
import { useFlashcardStore } from "@/stores/useFlashcardStore";
import { Progress } from "./ui/progress";

export default function StatsBar() {
  const { stats, reviewQueue } = useFlashcardStore();
  const [progressValue, setProgressValue] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);
  const isMobile = useMobile();

  const totalCards = stats.known + stats.unknown + reviewQueue.length;
  const progressPercentage =
    totalCards > 0 ? Math.round((stats.known / totalCards) * 100) : 0;

  useEffect(() => {
    setProgressValue(0);
    const timer = setTimeout(() => {
      setProgressValue(progressPercentage);
    }, 300);
    return () => clearTimeout(timer);
  }, [progressPercentage]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <motion.div
      className="w-full bg-card rounded-lg p-3 shadow-sm border theme-transition"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      whileHover={{ boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)" }}
    >
      {isMobile ? (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <motion.div
              className="flex items-center gap-1 text-amber-500"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Flame className="h-4 w-4" />
              <span className="font-bold">{stats.streak}</span>
              <span className="text-xs text-muted-foreground">days</span>
            </motion.div>

            <motion.div
              className="flex items-center gap-1 text-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Brain className="h-4 w-4" />
              <span className="font-bold">{stats.known}</span>
              <span className="text-xs text-muted-foreground">known</span>
            </motion.div>

            <motion.div
              className="flex items-center gap-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Clock className="h-4 w-4" />
              <span className="font-bold">{formatTime(sessionTime)}</span>
            </motion.div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Progress</span>
              <span>{progressPercentage}%</span>
            </div>
            <Progress
              value={progressValue}
              className="h-1.5 transition-all duration-1000 ease-out"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <motion.div
                className="flex items-center gap-1 text-amber-500"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Flame className="h-5 w-5" />
                <span className="font-bold">{stats.streak}</span>
                <span className="text-sm text-muted-foreground">
                  day streak
                </span>
              </motion.div>

              <motion.div
                className="flex items-center gap-1 text-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Brain className="h-5 w-5" />
                <span className="font-bold">{stats.known}</span>
                <span className="text-sm text-muted-foreground">mastered</span>
              </motion.div>

              <motion.div
                className="flex items-center gap-1"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Clock className="h-5 w-5" />
                <span className="font-bold">{formatTime(sessionTime)}</span>
              </motion.div>
            </div>

            <div className="flex gap-4 text-sm">
              <div>
                <span className="font-medium text-green-500">
                  {stats.known}
                </span>{" "}
                known
              </div>
              <div>
                <span className="font-medium text-red-500">
                  {stats.unknown}
                </span>{" "}
                to review
              </div>
              <div>
                <span className="font-medium">{reviewQueue.length}</span>{" "}
                remaining
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Progress</span>
              <span>{progressPercentage}%</span>
            </div>
            <Progress
              value={progressValue}
              className="h-2 transition-all duration-1000 ease-out"
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}
