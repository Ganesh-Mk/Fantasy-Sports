export interface Contest {
  id: string;
  matchId: number;
  name: string;
  entryFee: number;
  prizePool: number;
  totalSpots: number;
  filledSpots: number;
  firstPrize: number;
  type: "mega" | "small" | "practice";
}

export interface PlayerStats {
  playerId: string;
  matchesPlayed: number;
  totalRuns?: number;
  wickets?: number;
  average?: number;
  strikeRate?: number;
  economy?: number;
  recentForm: ("W" | "L" | "D")[];
}
