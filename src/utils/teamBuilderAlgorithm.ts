import {
  Player,
  SelectedPlayer,
  ROLE_LIMITS,
  MAX_CREDITS,
  MAX_PLAYERS_FROM_ONE_TEAM,
} from "@/types/fantasy";

export interface TeamSuggestion {
  id: string;
  name: string;
  strategy: "Balanced" | "Aggressive" | "Value Picks";
  players: SelectedPlayer[];
  totalCredits: number;
  confidence: number; // 0-100
  captain: SelectedPlayer;
  viceCaptain: SelectedPlayer;
  rationale: string;
}

export interface PlayerWithScore extends Player {
  valueScore: number;
  isStar: boolean; // 8-10 credits
  isBudget: boolean; // 6-7 credits
}

// Calculate player value score
export const calculateValueScore = (player: Player): number => {
  return player.event_total_points / player.event_player_credit;
};

// Categorize players
export const categorizePlayer = (player: Player): PlayerWithScore => {
  const valueScore = calculateValueScore(player);
  const credit = player.event_player_credit;
  return {
    ...player,
    valueScore,
    isStar: credit >= 8 && credit <= 10,
    isBudget: credit >= 6 && credit < 8,
  };
};

// Sort players based on strategy
export const sortPlayersForStrategy = (
  players: PlayerWithScore[],
  strategy: "Balanced" | "Aggressive" | "Value Picks"
): PlayerWithScore[] => {
  switch (strategy) {
    case "Aggressive":
      // Prioritize high credits and high value
      return [...players].sort((a, b) => {
        if (a.isStar !== b.isStar) return a.isStar ? -1 : 1;
        return b.valueScore - a.valueScore;
      });
    case "Value Picks":
      // Prioritize budget players with high value
      return [...players].sort((a, b) => {
        if (a.isBudget !== b.isBudget) return a.isBudget ? -1 : 1;
        return b.valueScore - a.valueScore;
      });
    case "Balanced":
    default:
      // Balance between stars and budget, prioritize value
      return [...players].sort((a, b) => {
        // First, prioritize players with value score > 1.5
        const aHighValue = a.valueScore > 1.5;
        const bHighValue = b.valueScore > 1.5;
        if (aHighValue !== bHighValue) return aHighValue ? -1 : 1;

        // Then balance stars and budget
        const aStarOrBudget = a.isStar || a.isBudget;
        const bStarOrBudget = b.isStar || b.isBudget;
        if (aStarOrBudget !== bStarOrBudget) return aStarOrBudget ? -1 : 1;

        return b.valueScore - a.valueScore;
      });
  }
};

// Check if adding a player violates constraints
export const canAddToTeam = (
  currentTeam: Player[],
  player: Player
): boolean => {
  // Check total players
  if (currentTeam.length >= 11) return false;

  // Check role limits
  const roleCount = currentTeam.filter((p) => p.role === player.role).length;
  const roleLimit = ROLE_LIMITS[player.role as keyof typeof ROLE_LIMITS];
  if (roleCount >= roleLimit.max) return false;

  // Check team limit
  const teamCount = currentTeam.filter(
    (p) => p.team_id === player.team_id
  ).length;
  if (teamCount >= MAX_PLAYERS_FROM_ONE_TEAM) return false;

  // Check credits
  const totalCredits =
    currentTeam.reduce((sum, p) => sum + p.event_player_credit, 0) +
    player.event_player_credit;
  if (totalCredits > MAX_CREDITS) return false;

  return true;
};

// Fill remaining slots to meet minimum requirements
export const fillMinimumRequirements = (
  team: Player[],
  availablePlayers: PlayerWithScore[],
  strategy: "Balanced" | "Aggressive" | "Value Picks"
): Player[] => {
  let result = [...team];
  const sortedAvailable = sortPlayersForStrategy(
    availablePlayers.filter(
      (p) => !result.some((tp) => tp.player_id === p.player_id)
    ),
    strategy
  );

  // If we have 11 players but don't meet minimums, we need to replace players
  const hasElevenPlayers = result.length === 11;
  const meetsMinimums = Object.entries(ROLE_LIMITS).every(([role, limits]) => {
    const count = result.filter((p) => p.role === role).length;
    return count >= limits.min;
  });

  if (hasElevenPlayers && !meetsMinimums) {
    // Need to replace players to meet minimum requirements
    for (const [role, limits] of Object.entries(ROLE_LIMITS)) {
      const currentCount = result.filter((p) => p.role === role).length;
      const needed = limits.min - currentCount;

      if (needed > 0) {
        // Find players of this role that we can add
        const rolePlayers = sortedAvailable.filter((p) => p.role === role);

        for (let i = 0; i < needed && i < rolePlayers.length; i++) {
          // Find a player to replace - prefer lower value players that we can remove
          const playerToReplace = result
            .filter((p) => p.role !== role) // Don't replace players of the same role we're adding
            .sort((a, b) => calculateValueScore(a) - calculateValueScore(b))[0]; // Replace lowest value player

          if (
            playerToReplace &&
            canAddToTeam(
              result.filter((p) => p.player_id !== playerToReplace.player_id),
              rolePlayers[i]
            )
          ) {
            // Replace the player
            result = result.filter(
              (p) => p.player_id !== playerToReplace.player_id
            );
            result.push(rolePlayers[i]);
          }
        }
      }
    }
  } else {
    // Original logic for teams with less than 11 players
    // Ensure minimum role requirements
    for (const [role, limits] of Object.entries(ROLE_LIMITS)) {
      const currentCount = result.filter((p) => p.role === role).length;
      const needed = limits.min - currentCount;

      if (needed > 0) {
        const rolePlayers = sortedAvailable.filter(
          (p) => p.role === role && canAddToTeam(result, p)
        );
        for (let i = 0; i < needed && i < rolePlayers.length; i++) {
          result.push(rolePlayers[i]);
        }
      }
    }
  }

  return result;
};

// Generate a team suggestion
export const generateTeamSuggestion = (
  allPlayers: Player[],
  strategy: "Balanced" | "Aggressive" | "Value Picks"
): TeamSuggestion | null => {
  const playersWithScore = allPlayers.map(categorizePlayer);
  const sortedPlayers = sortPlayersForStrategy(playersWithScore, strategy);

  const team: Player[] = [];
  let totalCredits = 0;

  // Select players greedily
  for (const player of sortedPlayers) {
    if (canAddToTeam(team, player)) {
      team.push(player);
      totalCredits += player.event_player_credit;

      // Stop when we have 11 players
      if (team.length === 11) break;
    }
  }

  // If we don't have 11 players, try to fill minimum requirements
  if (team.length < 11) {
    const filledTeam = fillMinimumRequirements(
      team,
      playersWithScore,
      strategy
    );
    if (filledTeam.length === 11) {
      team.splice(0, team.length, ...filledTeam);
      totalCredits = team.reduce((sum, p) => sum + p.event_player_credit, 0);
    } else {
      // Cannot form a valid team
      return null;
    }
  }

  // Even with 11 players, ensure minimum role requirements are met
  const meetsMinimums = Object.entries(ROLE_LIMITS).every(([role, limits]) => {
    const count = team.filter((p) => p.role === role).length;
    return count >= limits.min;
  });

  if (!meetsMinimums) {
    const adjustedTeam = fillMinimumRequirements(
      team,
      playersWithScore,
      strategy
    );
    if (adjustedTeam.length === 11) {
      team.splice(0, team.length, ...adjustedTeam);
      totalCredits = team.reduce((sum, p) => sum + p.event_player_credit, 0);
    } else {
      // Cannot form a valid team
      return null;
    }
  }

  // Select captain and vice-captain (highest value scores)
  const sortedForCaptain = [...team].sort(
    (a, b) => b.event_total_points - a.event_total_points
  );
  const captain = sortedForCaptain[0];
  const viceCaptain = sortedForCaptain[1];

  // Calculate confidence based on average value score and team balance
  const avgValueScore =
    team.reduce((sum, p) => sum + calculateValueScore(p), 0) / 11;
  const roleBalance = Object.entries(ROLE_LIMITS).every(([role, limits]) => {
    const count = team.filter((p) => p.role === role).length;
    return count >= limits.min && count <= limits.max;
  });
  const teamDiversity = new Set(team.map((p) => p.team_id)).size >= 2;
  const confidence = Math.min(
    100,
    Math.round(
      avgValueScore * 20 +
        (roleBalance ? 30 : 0) +
        (teamDiversity ? 20 : 0) +
        30
    )
  );

  const rationale = getStrategyRationale(strategy, team);

  return {
    id: `${strategy.toLowerCase().replace(" ", "-")}-${Date.now()}`,
    name: strategy,
    strategy,
    players: team.map((p) => ({
      ...p,
      isCaptain: p.player_id === captain.player_id,
      isViceCaptain: p.player_id === viceCaptain.player_id,
    })),
    totalCredits,
    confidence,
    captain: { ...captain, isCaptain: true },
    viceCaptain: { ...viceCaptain, isViceCaptain: true },
    rationale,
  };
};

// Generate all three team suggestions
export const generateTeamSuggestions = (
  allPlayers: Player[]
): TeamSuggestion[] => {
  const suggestions: TeamSuggestion[] = [];
  const strategies: ("Balanced" | "Aggressive" | "Value Picks")[] = [
    "Balanced",
    "Aggressive",
    "Value Picks",
  ];

  for (const strategy of strategies) {
    const suggestion = generateTeamSuggestion(allPlayers, strategy);
    if (suggestion) {
      suggestions.push(suggestion);
    }
  }

  return suggestions;
};

// Get rationale for strategy
// Quick fill remaining slots in a partially built team
export const quickFillTeam = (
  currentPlayers: Player[],
  allPlayers: Player[]
): Player[] => {
  const playersWithScore = allPlayers.map(categorizePlayer);
  const availablePlayers = playersWithScore.filter(
    (p) => !currentPlayers.some((cp) => cp.player_id === p.player_id)
  );

  // Sort by value score descending
  const sortedAvailable = availablePlayers.sort(
    (a, b) => b.valueScore - a.valueScore
  );

  let filledTeam = [...currentPlayers];

  // Fill to 11 players
  for (const player of sortedAvailable) {
    if (filledTeam.length >= 11) break;
    if (canAddToTeam(filledTeam, player)) {
      filledTeam.push(player);
    }
  }

  // If we have 11 players but don't meet minimum requirements, adjust
  if (filledTeam.length === 11) {
    const meetsMinimums = Object.entries(ROLE_LIMITS).every(
      ([role, limits]) => {
        const count = filledTeam.filter((p) => p.role === role).length;
        return count >= limits.min;
      }
    );

    if (!meetsMinimums) {
      filledTeam = fillMinimumRequirements(
        filledTeam,
        playersWithScore,
        "Balanced" // Use balanced strategy for quick fill
      );
    }
  }

  return filledTeam;
};

// Get rationale for strategy
const getStrategyRationale = (
  strategy: "Balanced" | "Aggressive" | "Value Picks",
  team: Player[]
): string => {
  switch (strategy) {
    case "Balanced":
      return "A well-rounded team balancing high-value stars with budget picks for optimal performance.";
    case "Aggressive":
      return "Focuses on premium players with proven track records for maximum fantasy points.";
    case "Value Picks":
      return "Prioritizes underrated players offering great value for their credit cost.";
  }
};
