import { Player } from "@/types/fantasy";

export const fetchPlayers = async (): Promise<Player[]> => {
  const response = await fetch(
    "https://leaguex.s3.ap-south-1.amazonaws.com/task/fantasy-sports/Get_All_Players_of_match.json"
  );
  if (!response.ok) {
    throw new Error("Failed to fetch players");
  }
  const data = await response.json();
  return data;
};
