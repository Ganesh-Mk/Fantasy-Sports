import { PlayerStats } from "@/types/contest";

export const generatePlayerStats = (playerId: string): PlayerStats => {
  const roles = ["Batsman", "Bowler", "All-Rounder", "Wicket-Keeper"];
  const randomRole = roles[Math.floor(Math.random() * roles.length)];

  const baseStats: PlayerStats = {
    playerId,
    matchesPlayed: Math.floor(Math.random() * 50) + 10,
    recentForm: Array.from({ length: 5 }, () => {
      const rand = Math.random();
      return rand > 0.6 ? "W" : rand > 0.3 ? "L" : "D";
    }) as ("W" | "L" | "D")[],
  };

  if (randomRole === "Batsman" || randomRole === "All-Rounder") {
    baseStats.totalRuns = Math.floor(Math.random() * 2000) + 500;
    baseStats.average = Math.random() * 40 + 20;
    baseStats.strikeRate = Math.random() * 50 + 120;
  }

  if (randomRole === "Bowler" || randomRole === "All-Rounder") {
    baseStats.wickets = Math.floor(Math.random() * 80) + 20;
    baseStats.economy = Math.random() * 3 + 6;
  }

  return baseStats;
};
