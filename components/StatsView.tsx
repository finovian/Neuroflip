"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { useMobile } from "@/hooks/useMobile";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { FlashcardStats } from "@/types";
import CustomTooltip from "./ui/CustomTooltip";

interface StatsViewProps {
  stats: FlashcardStats;
}

export default function StatsView({ stats }: StatsViewProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const isMobile = useMobile();

  const chartData = [
    { name: "Known", value: stats.known, color: { isDark, color: "green" } },
    {
      name: "To Review",
      value: stats.unknown,
      color: { isDark, color: "green" },
    },
  ];

  const historyData = stats.history.slice(-7).map((entry) => ({
    date: new Date(entry.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    known: entry.known,
    unknown: entry.unknown,
  }));

  const COLORS = isDark ? ["#22c55e", "#ef4444"] : ["#16a34a", "#dc2626"];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      className="space-y-4"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={item}>
        <Card className="overflow-hidden transition-all duration-300 hover:shadow-md theme-transition">
          <CardHeader className="pb-2 bg-primary/5 theme-transition">
            <CardTitle className="text-base">Current Streak</CardTitle>
            <CardDescription>Your daily learning streak</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-4">
              <motion.div
                className="text-4xl font-bold text-amber-500"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 10,
                  delay: 0.3,
                }}
              >
                {stats.streak}
              </motion.div>
              <div className="ml-2 text-lg">days</div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card className="overflow-hidden transition-all duration-300 hover:shadow-md theme-transition">
          <CardHeader className="pb-2 bg-primary/5 theme-transition">
            <CardTitle className="text-base">Card Status</CardTitle>
            <CardDescription>Known vs. to review cards</CardDescription>
          </CardHeader>
          <CardContent className="p-0 py-0 px-0">
            <div className={isMobile ? "h-[180px]" : "h-[200px]"}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={isMobile ? 60 : 70}
                    fill={isDark ? "#22c55e" : "#16a34a"} // Known
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    animationDuration={1500}
                    animationBegin={300}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip isDark={isDark} />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {historyData.length > 0 && (
        <motion.div variants={item}>
          <Card className="overflow-hidden transition-all duration-300 hover:shadow-md theme-transition">
            <CardHeader className="pb-2 bg-primary/5 theme-transition">
              <CardTitle className="text-base">Review History</CardTitle>
              <CardDescription>Last 7 days of activity</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 ">
              <div className={isMobile ? "h-[150px]" : "h-[180px]"}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={historyData}>
                    <XAxis
                      dataKey="date"
                      stroke={isDark ? "#888" : "#666"}
                      fontSize={10}
                    />
                    <YAxis stroke={isDark ? "#888" : "#666"} fontSize={10} />
                    <Tooltip content={<CustomTooltip isDark={isDark} />} />

                    <Bar
                      dataKey="known"
                      name="Known"
                      stackId="a"
                      fill={isDark ? "#22c55e" : "#16a34a"}
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="unknown"
                      name="Unknown"
                      stackId="a"
                      fill={isDark ? "#ef4444" : "#dc2626"}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
