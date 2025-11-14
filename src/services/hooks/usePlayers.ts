import { useQuery } from "@tanstack/react-query";
import { fetchPlayers } from "../api/players";
import { Player } from "@/types/fantasy";

export const usePlayers = () => {
  return useQuery<Player[]>({
    queryKey: ["players"],
    queryFn: fetchPlayers,
  });
};
