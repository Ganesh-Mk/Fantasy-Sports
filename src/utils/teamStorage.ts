import { Team } from "@/types/fantasy";

const STORAGE_KEY = "fantasy_teams";

export const getTeams = (): Team[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const getTeamsByMatch = (matchId: number): Team[] => {
  return getTeams().filter((team) => team.matchId === matchId);
};

export const saveTeam = (team: Team): void => {
  const teams = getTeams();
  const existingIndex = teams.findIndex((t) => t.id === team.id);

  if (existingIndex >= 0) {
    teams[existingIndex] = team;
  } else {
    teams.push(team);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(teams));
};

export const deleteTeam = (teamId: string): void => {
  const teams = getTeams().filter((t) => t.id !== teamId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(teams));
};

export const getTeamById = (teamId: string): Team | undefined => {
  return getTeams().find((t) => t.id === teamId);
};
