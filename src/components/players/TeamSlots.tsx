import {
  SelectedPlayer,
  ROLE_LIMITS,
  MAX_CREDITS,
  MAX_PLAYERS_FROM_ONE_TEAM,
  Match,
} from "@/types/fantasy";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getRoleCount, getTotalCredits } from "@/utils/teamValidation";
import { X, AlertCircle, CheckCircle2, Zap, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TeamSlotsProps {
  selectedPlayers: SelectedPlayer[];
  onRemovePlayer: (playerId: string) => void;
  match?: Match;
  onQuickFill?: () => void;
  onAISuggest?: () => void;
  canQuickFill?: boolean;
  canAISuggest?: boolean;
  isGeneratingSuggestions?: boolean;
}

export const TeamSlots = ({
  selectedPlayers,
  onRemovePlayer,
  match,
  onQuickFill,
  onAISuggest,
  canQuickFill,
  canAISuggest,
  isGeneratingSuggestions,
}: TeamSlotsProps) => {
  const totalCredits = getTotalCredits(selectedPlayers);
  const creditsLeft = MAX_CREDITS - totalCredits;
  const creditsValid = totalCredits <= MAX_CREDITS;
  const creditsPercentage = (totalCredits / MAX_CREDITS) * 100;

  const roleValidation = Object.entries(ROLE_LIMITS).map(([role, limits]) => {
    const count = getRoleCount(selectedPlayers, role);
    return {
      role,
      count,
      min: limits.min,
      max: limits.max,
      valid: count >= limits.min && count <= limits.max,
    };
  });

  const teamCounts = selectedPlayers.reduce((acc, player) => {
    acc[player.team_short_name] = (acc[player.team_short_name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const teamValidation = Object.entries(teamCounts).map(([team, count]) => ({
    team,
    count,
    valid: count <= MAX_PLAYERS_FROM_ONE_TEAM,
  }));

  const allValid =
    creditsValid &&
    roleValidation.every((r) => r.valid) &&
    teamValidation.every((t) => t.valid) &&
    selectedPlayers.length === 11;

  return (
    <div className="space-y-3 pt-4">
      {/* Stats Summary */}
      <Card className="p-3 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">
                Players Selected
              </p>
              <p className="text-2xl font-bold">
                {selectedPlayers.length}
                <span className="text-sm opacity-70 ml-0.5">/11</span>
              </p>
            </div>
            <div className="h-12 w-px bg-border"></div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground mb-0.5">
                Credits Left
              </p>
              <p className="text-2xl font-bold">{creditsLeft.toFixed(1)}</p>
            </div>
          </div>

          {/* Match Info */}
          {match && (
            <>
              <div className="h-px bg-border"></div>
              <div className="flex items-center justify-center gap-2">
                <img
                  src={match.t1_image}
                  alt={match.t1_name}
                  className="w-6 h-6"
                />
                <span className="text-xs text-muted-foreground">vs</span>
                <img
                  src={match.t2_image}
                  alt={match.t2_name}
                  className="w-6 h-6"
                />
              </div>
            </>
          )}

          {/* Action Buttons */}
          {(onQuickFill || onAISuggest) && (
            <>
              <div className="h-px bg-border"></div>
              <div className="flex gap-2">
                {onQuickFill && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={onQuickFill}
                          disabled={!canQuickFill}
                          className="flex-1"
                        >
                          <Zap className="h-3.5 w-3.5 mr-1.5" />
                          Quick Fill
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>Auto-fill remaining slots</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                {onAISuggest && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={onAISuggest}
                          disabled={!canAISuggest || isGeneratingSuggestions}
                          className="flex-1"
                        >
                          <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                          AI Suggest
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>Get AI suggestions</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </>
          )}
        </div>
      </Card>

      {/* Credits Progress */}
      <Card className="p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Credits Used</span>
          <span
            className={`font-bold ${
              creditsValid ? "text-green-600" : "text-red-600"
            }`}
          >
            {totalCredits.toFixed(1)}/100
          </span>
        </div>
        <Progress
          value={creditsPercentage}
          className={`h-2 ${!creditsValid ? "bg-red-500/20" : ""}`}
        />
        {!creditsValid && (
          <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Over budget!
          </p>
        )}
      </Card>

      {/* Role Requirements */}
      <Card className="p-3">
        <h4 className="text-sm font-semibold mb-2">Role Requirements</h4>
        <div className="grid grid-cols-2 gap-2">
          {roleValidation.map(({ role, count, min, max, valid }) => (
            <div
              key={role}
              className={`flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all ${
                valid
                  ? "border-green-500/30 bg-green-500/10"
                  : "border-red-500/30 bg-red-500/10"
              }`}
            >
              <div className="flex items-center gap-1 mb-1">
                {valid ? (
                  <CheckCircle2 className="h-3 w-3 text-green-600" />
                ) : (
                  <AlertCircle className="h-3 w-3 text-red-600" />
                )}
                <span
                  className={`text-xs font-medium ${
                    valid ? "" : "text-red-600"
                  }`}
                >
                  {role.split("-")[0]}
                </span>
              </div>
              <span
                className={`text-sm font-bold ${
                  valid ? "text-green-600" : "text-red-600"
                }`}
              >
                {count}/{min}-{max}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Team Distribution */}
      {teamValidation.length > 0 && (
        <Card className="p-3">
          <h4 className="text-sm font-semibold mb-2">Team Distribution</h4>
          <div className="flex flex-wrap gap-1.5">
            {teamValidation.map(({ team, count, valid }) => (
              <Badge
                key={team}
                variant={valid ? "secondary" : "destructive"}
                className="text-xs"
              >
                {team}: {count}/7
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {/* Selected Players Grid */}
      <Card className="p-3">
        <h4 className="text-sm font-semibold mb-2">Selected Players</h4>
        {selectedPlayers.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">
            No players selected yet
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-2">
            {selectedPlayers.map((player) => (
              <div
                key={player.player_id}
                className="flex items-center justify-between p-2 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">
                    {player.short_name}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{player.team_short_name}</span>
                    <span>•</span>
                    <span>{player.role.split("-")[0]}</span>
                    <span>•</span>
                    <span className="font-medium text-primary">
                      {player.event_player_credit} cr
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onRemovePlayer(player.player_id)}
                  className="p-1.5 hover:bg-red-100 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                  title="Remove player"
                >
                  <X className="h-3.5 w-3.5 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
