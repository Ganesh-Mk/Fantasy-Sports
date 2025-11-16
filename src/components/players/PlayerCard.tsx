import { Player } from "@/types/fantasy";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Info, TrendingUp } from "lucide-react";

interface PlayerCardProps {
  player: Player;
  isSelected: boolean;
  onToggle: (player: Player) => void;
  onInfoClick: (player: Player, e: React.MouseEvent) => void;
}

export const PlayerCard = ({
  player,
  isSelected,
  onToggle,
  onInfoClick,
}: PlayerCardProps) => {
  return (
    <Card
      className={`overflow-hidden cursor-pointer transition-all duration-300 bg-gradient-card hover:shadow-xl group relative min-w-0 max-w-full ${
        isSelected
          ? "border-primary border-2 shadow-lg shadow-primary/20 ring-2 ring-primary/10"
          : "border-border hover:border-primary/30"
      }`}
      onClick={() => onToggle(player)}
    >
      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute top-0 right-0 w-0 h-0 border-l-[40px] border-l-transparent border-t-[40px] border-t-primary">
          <div className="absolute -top-9 -right-0.5">
            <svg
              className="w-5 h-5 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Player Header */}
      <div className="p-3 pb-2 md:p-4 md:pb-3">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3 flex-1">
            <Checkbox
              checked={isSelected}
              className="mt-1"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-bold text-base truncate">{player.name}</p>
                {player.is_playing && (
                  <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {player.short_name}
              </p>

              {/* Badges */}
              <div className="flex items-center gap-1.5 flex-wrap max-w-full">
                <Badge
                  variant="secondary"
                  className="text-xs font-medium truncate max-w-[120px]"
                >
                  {player.team_name}
                </Badge>
                <Badge
                  variant="outline"
                  className="text-xs truncate max-w-[100px]"
                >
                  {player.country}
                </Badge>
                {player.is_playing && (
                  <Badge className="text-xs bg-green-500 hover:bg-green-600 border-0 flex-shrink-0">
                    Playing XI
                  </Badge>
                )}
              </div>

              {/* Role */}
              <div className="mt-2">
                <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                  {player.role}
                </span>
              </div>
            </div>
          </div>

          {/* Info Button */}
          <button
            onClick={(e) => onInfoClick(player, e)}
            className="flex-shrink-0 p-2 hover:bg-primary/10 rounded-lg transition-colors group/info"
            aria-label="View player stats"
          >
            <Info className="h-4 w-4 text-muted-foreground group-hover/info:text-primary transition-colors" />
          </button>
        </div>
      </div>

      {/* Stats Footer */}
      <div className="bg-gradient-to-r from-muted/30 via-muted/20 to-muted/30 px-3 py-2 md:px-4 md:py-3 border-t border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Points</p>
              <div className="flex items-baseline gap-1">
                <p className="text-lg font-bold">{player.event_total_points}</p>
                <TrendingUp className="h-3 w-3 text-green-500" />
              </div>
            </div>
            <div className="h-10 w-px bg-border"></div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Credits</p>
              <p className="text-xl font-bold text-primary">
                {player.event_player_credit}
              </p>
            </div>
          </div>

          {/* Value Indicator */}
          <div className="text-right">
            <p className="text-xs text-muted-foreground mb-0.5">Value</p>
            <div className="flex items-center gap-1">
              <Badge
                variant="outline"
                className={`text-xs font-bold ${
                  player.event_total_points / player.event_player_credit > 1.5
                    ? "border-green-500 text-green-500"
                    : player.event_total_points / player.event_player_credit > 1
                    ? "border-yellow-500 text-yellow-500"
                    : "border-muted-foreground text-muted-foreground"
                }`}
              >
                {(
                  player.event_total_points / player.event_player_credit
                ).toFixed(1)}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Hover Effect Bottom Bar */}
      {!isSelected && (
        <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
      )}
    </Card>
  );
};
