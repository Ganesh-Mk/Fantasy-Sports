import { Contest } from "@/types/contest";

export const generateContests = (matchId: number): Contest[] => {
  return [
    {
      id: `contest_${matchId}_1`,
      matchId,
      name: "Mega Contest",
      entryFee: 49,
      prizePool: 100000,
      totalSpots: 10000,
      filledSpots: 8234,
      firstPrize: 25000,
      type: "mega",
    },
    {
      id: `contest_${matchId}_2`,
      matchId,
      name: "Winners Take All",
      entryFee: 199,
      prizePool: 50000,
      totalSpots: 500,
      filledSpots: 423,
      firstPrize: 50000,
      type: "small",
    },
    {
      id: `contest_${matchId}_3`,
      matchId,
      name: "Practice Contest",
      entryFee: 0,
      prizePool: 0,
      totalSpots: 1000,
      filledSpots: 756,
      firstPrize: 0,
      type: "practice",
    },
    {
      id: `contest_${matchId}_4`,
      matchId,
      name: "Head to Head",
      entryFee: 50,
      prizePool: 90,
      totalSpots: 2,
      filledSpots: 1,
      firstPrize: 90,
      type: "small",
    },
  ];
};
