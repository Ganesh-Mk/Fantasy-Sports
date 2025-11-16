import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Player } from "@/types/fantasy";
import { Search } from "lucide-react";

interface PlayerFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  teamFilter: string;
  onTeamFilterChange: (value: string) => void;
  countryFilter: string;
  onCountryFilterChange: (value: string) => void;
  playingFilter: string;
  onPlayingFilterChange: (value: string) => void;
  creditsFilter: string;
  onCreditsFilterChange: (value: string) => void;
  allPlayers: Player[];
}

export const PlayerFilters = ({
  searchTerm,
  onSearchChange,
  teamFilter,
  onTeamFilterChange,
  countryFilter,
  onCountryFilterChange,
  playingFilter,
  onPlayingFilterChange,
  creditsFilter,
  onCreditsFilterChange,
  allPlayers,
}: PlayerFiltersProps) => {
  return (
    <div className="mb-4 space-y-3">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search players by name..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 h-10"
        />
      </div>

      {/* Filter Dropdowns */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        <Select value={teamFilter} onValueChange={onTeamFilterChange}>
          <SelectTrigger className="w-full h-10">
            <SelectValue placeholder="Team" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Teams</SelectItem>
            {[...new Set(allPlayers?.map((p) => p.team_name) || [])].map(
              (team) => (
                <SelectItem key={team} value={team}>
                  {team}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>

        <Select value={countryFilter} onValueChange={onCountryFilterChange}>
          <SelectTrigger className="w-full h-10">
            <SelectValue placeholder="Country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Countries</SelectItem>
            {[...new Set(allPlayers?.map((p) => p.country) || [])].map(
              (country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>

        <Select value={playingFilter} onValueChange={onPlayingFilterChange}>
          <SelectTrigger className="w-full h-10">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Players</SelectItem>
            <SelectItem value="Playing">Playing</SelectItem>
            <SelectItem value="Not Playing">Not Playing</SelectItem>
          </SelectContent>
        </Select>

        <Select value={creditsFilter} onValueChange={onCreditsFilterChange}>
          <SelectTrigger className="w-full h-10">
            <SelectValue placeholder="Credits" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Credits</SelectItem>
            <SelectItem value="4-6">4 - 6</SelectItem>
            <SelectItem value="6-8">6 - 8</SelectItem>
            <SelectItem value="8-10">8 - 10</SelectItem>
            <SelectItem value="10+">10+</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
