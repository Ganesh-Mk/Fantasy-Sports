import { Match } from "@/types/fantasy";

export const fetchMatches = async (): Promise<Match[]> => {
  const response = await fetch(
    "https://leaguex.s3.ap-south-1.amazonaws.com/task/fantasy-sports/Get_All_upcoming_Matches.json"
  );
  if (!response.ok) {
    throw new Error("Failed to fetch matches");
  }
  const data = await response.json();
  return data.matches.cricket || [];
};
