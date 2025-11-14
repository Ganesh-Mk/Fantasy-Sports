export interface Match {
  id: number;
  short_name: string;
  is_ipl: number;
  match_name: string;
  event_id: number;
  team_a_id: number;
  team_b_id: number;
  event_name: string;
  sport_id: number;
  sport_type: string;
  announcement: string | null;
  toss_details: string | null;
  match_status: string;
  match_result: string;
  match_type: string;
  match_date: string;
  playing_xi_added: number;
  match_completed_at: string | null;
  t1_name: string;
  t2_name: string;
  t1_short_name: string;
  t2_short_name: string;
  t1_image: string;
  t2_image: string;
  leagues_joined: number;
  in_review: number;
}

export interface Player {
  player_id: string;
  name: string;
  role: "Batsman" | "Bowler" | "All-Rounder" | "Wicket-Keeper";
  country: string;
  short_name: string;
  team_name: string;
  team_logo: string;
  team_short_name: string;
  event_total_points: number;
  event_player_credit: number;
  team_id: number;
  is_playing: boolean;
  player_stats_available: boolean;
}

export interface SelectedPlayer extends Player {
  isCaptain?: boolean;
  isViceCaptain?: boolean;
}

export interface Team {
  id: string;
  matchId: number;
  name: string;
  players: SelectedPlayer[];
  createdAt: string;
}

export const ROLE_LIMITS = {
  Batsman: { min: 3, max: 7 },
  Bowler: { min: 3, max: 7 },
  "All-Rounder": { min: 0, max: 4 },
  "Wicket-Keeper": { min: 1, max: 5 },
};

export const MAX_PLAYERS_PER_TEAM = 11;
export const MAX_CREDITS = 100;
export const MAX_PLAYERS_FROM_ONE_TEAM = 7;
