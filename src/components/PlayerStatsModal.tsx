import { Player } from "@/types/fantasy";
import { PlayerStats } from "@/types/contest";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Badge } from "./ui/badge";
import {
  TrendingUp,
  Target,
  Activity,
  Award,
  BarChart3,
  Flame,
} from "lucide-react";

interface PlayerStatsModalProps {
  player: Player | null;
  stats: PlayerStats | null;
  open: boolean;
  onClose: () => void;
}

export const PlayerStatsModal = ({
  player,
  stats,
  open,
  onClose,
}: PlayerStatsModalProps) => {
  if (!player) return null;

  // Calculate form indicator
  const getFormStatus = () => {
    if (!stats?.recentForm.length) return null;
    const wins = stats.recentForm.filter((r) => r === "W").length;
    const total = stats.recentForm.length;
    const winRate = (wins / total) * 100;

    if (winRate >= 60)
      return { label: "Hot", color: "text-orange-500", bg: "bg-orange-500/10" };
    if (winRate >= 40)
      return { label: "Good", color: "text-green-500", bg: "bg-green-500/10" };
    return { label: "Cold", color: "text-blue-500", bg: "bg-blue-500/10" };
  };

  const formStatus = getFormStatus();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        {/* Player Header */}
        <DialogHeader className="space-y-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-xl font-bold mb-1">
                {player.name}
              </DialogTitle>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="text-xs">
                  {player.role}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {player.team_short_name}
                </Badge>
                {player.is_playing && (
                  <Badge className="text-xs bg-green-500">Playing XI</Badge>
                )}
                {formStatus && (
                  <Badge
                    className={`text-xs ${formStatus.bg} ${formStatus.color} border-0`}
                  >
                    <Flame className="h-3 w-3 mr-1" />
                    {formStatus.label} Form
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5 mt-4">
          {/* Key Stats Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 p-4 rounded-xl border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-primary/20 rounded-lg">
                  <Target className="h-4 w-4 text-primary" />
                </div>
                <p className="text-xs font-medium text-muted-foreground">
                  Credits
                </p>
              </div>
              <p className="text-3xl font-bold">{player.event_player_credit}</p>
              <div className="absolute -right-4 -bottom-4 opacity-10">
                <Target className="h-20 w-20" />
              </div>
            </div>

            <div className="relative overflow-hidden bg-gradient-to-br from-green-500/10 to-green-500/5 p-4 rounded-xl border border-green-500/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-green-500/20 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
                <p className="text-xs font-medium text-muted-foreground">
                  Points
                </p>
              </div>
              <p className="text-3xl font-bold">{player.event_total_points}</p>
              <div className="absolute -right-4 -bottom-4 opacity-10">
                <TrendingUp className="h-20 w-20" />
              </div>
            </div>
          </div>

          {stats && (
            <>
              {/* Performance Stats */}
              <div className="bg-muted/30 p-4 rounded-xl border border-border/50">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  <h4 className="font-semibold text-sm">Performance Stats</h4>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {stats.totalRuns !== undefined && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Total Runs
                      </p>
                      <p className="text-lg font-bold">{stats.totalRuns}</p>
                    </div>
                  )}
                  {stats.wickets !== undefined && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Wickets
                      </p>
                      <p className="text-lg font-bold">{stats.wickets}</p>
                    </div>
                  )}
                  {stats.average !== undefined && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Average
                      </p>
                      <p className="text-lg font-bold">
                        {stats.average.toFixed(2)}
                      </p>
                    </div>
                  )}
                  {stats.strikeRate !== undefined && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Strike Rate
                      </p>
                      <p className="text-lg font-bold">
                        {stats.strikeRate.toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Form */}
              {stats.recentForm.length > 0 && (
                <div className="bg-muted/30 p-4 rounded-xl border border-border/50">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="h-4 w-4 text-primary" />
                    <h4 className="font-semibold text-sm">Recent Form</h4>
                    <span className="text-xs text-muted-foreground ml-auto">
                      Last {stats.recentForm.length} matches
                    </span>
                  </div>
                  <div className="flex gap-2 justify-center">
                    {stats.recentForm.map((result, index) => (
                      <div
                        key={index}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-transform hover:scale-110 ${
                          result === "W"
                            ? "bg-green-500 text-white shadow-lg shadow-green-500/30"
                            : result === "L"
                            ? "bg-red-500 text-white shadow-lg shadow-red-500/30"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {result}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Player Value Indicator */}
              <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 p-4 rounded-xl border border-primary/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Player Value
                      </p>
                      <p className="text-sm font-semibold">
                        {(
                          player.event_total_points / player.event_player_credit
                        ).toFixed(2)}{" "}
                        pts/credit
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {player.event_total_points / player.event_player_credit >
                    1.5
                      ? "Excellent Value"
                      : player.event_total_points / player.event_player_credit >
                        1
                      ? "Good Value"
                      : "Fair Value"}
                  </Badge>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
