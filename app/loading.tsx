"use client";
import { motion } from "framer-motion";

const Loading = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 flex flex-col justify-center items-center bg-gradient-to-tr from-gray-900 via-indigo-900 to-black dark:bg-gradient-to-tr dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#0f172a] w-screen h-screen p-6 overflow-hidden z-[9999]"
    >
      <motion.div
        animate={{
          rotate: 360,
          scale: [1, 1.4, 1],
          boxShadow: [
            "0 0 8px 4px rgba(99, 102, 241, 0.7)",
            "0 0 18px 8px rgba(99, 102, 241, 1)",
            "0 0 8px 4px rgba(99, 102, 241, 0.7)",
          ],
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut",
        }}
        className="rounded-full h-16 w-16 border-4 border-t-[rgba(99,102,241,0.8)] border-b-transparent border-r-transparent border-l-transparent"
      />
      <motion.p
        animate={{
          opacity: [0.6, 1, 0.6],
          scale: [0.95, 1.05, 0.95],
          textShadow: [
            "0 0 8px rgba(99, 102, 241, 0.6)",
            "0 0 12px rgba(99, 102, 241, 1)",
            "0 0 8px rgba(99, 102, 241, 0.6)",
          ],
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut",
          delay: 0.2,
        }}
        className="mt-6 text-center text-lg font-extrabold text-indigo-400 tracking-wide"
      >
        Loading, please wait...
      </motion.p>
    </motion.div>
  );
};

export default Loading;
