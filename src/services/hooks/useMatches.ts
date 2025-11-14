import { useQuery } from "@tanstack/react-query";
import { fetchMatches } from "../api/matches";
import { Match } from "@/types/fantasy";

export const useMatches = () => {
  return useQuery<Match[]>({
    queryKey: ["matches"],
    queryFn: fetchMatches,
  });
};
