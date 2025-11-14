import {
  Player,
  SelectedPlayer,
  ROLE_LIMITS,
  MAX_PLAYERS_PER_TEAM,
  MAX_CREDITS,
  MAX_PLAYERS_FROM_ONE_TEAM,
} from "@/types/fantasy";

export const getRoleCount = (players: Player[], role: string): number => {
  return players.filter((p) => p.role === role).length;
};

export const getTeamCount = (players: Player[], teamId: number): number => {
  return players.filter((p) => p.team_id === teamId).length;
};

export const getTotalCredits = (players: Player[]): number => {
  return players.reduce((sum, p) => sum + p.event_player_credit, 0);
};

export const canAddPlayer = (
  currentPlayers: Player[],
  newPlayer: Player
): { canAdd: boolean; reason?: string } => {
  if (currentPlayers.length >= MAX_PLAYERS_PER_TEAM) {
    return { canAdd: false, reason: "Maximum 11 players allowed" };
  }

  const roleCount = getRoleCount(currentPlayers, newPlayer.role);
  const roleLimit = ROLE_LIMITS[newPlayer.role as keyof typeof ROLE_LIMITS];

  if (roleCount >= roleLimit.max) {
    return {
      canAdd: false,
      reason: `Maximum ${roleLimit.max} ${newPlayer.role}s allowed`,
    };
  }

  const teamCount = getTeamCount(currentPlayers, newPlayer.team_id);
  if (teamCount >= MAX_PLAYERS_FROM_ONE_TEAM) {
    return {
      canAdd: false,
      reason: `Maximum ${MAX_PLAYERS_FROM_ONE_TEAM} players from ${newPlayer.team_short_name}`,
    };
  }

  const totalCredits = getTotalCredits([...currentPlayers, newPlayer]);
  if (totalCredits > MAX_CREDITS) {
    return { canAdd: false, reason: "Insufficient credits" };
  }

  return { canAdd: true };
};

export const isTeamValid = (players: SelectedPlayer[]): boolean => {
  if (players.length !== MAX_PLAYERS_PER_TEAM) {
    return false;
  }

  // Check role limits
  for (const [role, limits] of Object.entries(ROLE_LIMITS)) {
    const count = getRoleCount(players, role);
    if (count < limits.min || count > limits.max) {
      return false;
    }
  }

  // Check credits
  if (getTotalCredits(players) > MAX_CREDITS) {
    return false;
  }

  return true;
};

export const canSelectCaptains = (players: SelectedPlayer[]): boolean => {
  return isTeamValid(players);
};
