import { Player } from "@/types/fantasy";
import { PlayerStats } from "@/types/contest";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Badge } from "./ui/badge";
import { TrendingUp, Target, Activity } from "lucide-react";

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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="flex-1">
              <p className="text-lg font-bold">{player.name}</p>
              <p className="text-sm text-muted-foreground">{player.role}</p>
            </div>
            <Badge variant="secondary">{player.team_short_name}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-card p-4 rounded-lg border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-primary" />
                <p className="text-xs text-muted-foreground">Credits</p>
              </div>
              <p className="text-2xl font-bold">{player.event_player_credit}</p>
            </div>
            <div className="bg-gradient-card p-4 rounded-lg border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-success" />
                <p className="text-xs text-muted-foreground">Points</p>
              </div>
              <p className="text-2xl font-bold">{player.event_total_points}</p>
            </div>
          </div>

          {stats && (
            <>
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Performance Stats</h4>
                {stats.totalRuns !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Runs</span>
                    <span className="font-semibold">{stats.totalRuns}</span>
                  </div>
                )}
                {stats.wickets !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Wickets</span>
                    <span className="font-semibold">{stats.wickets}</span>
                  </div>
                )}
                {stats.average !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Average</span>
                    <span className="font-semibold">{stats.average.toFixed(2)}</span>
                  </div>
                )}
                {stats.strikeRate !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Strike Rate</span>
                    <span className="font-semibold">{stats.strikeRate.toFixed(2)}</span>
                  </div>
                )}
              </div>

              {stats.recentForm.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <h4 className="font-semibold text-sm">Recent Form</h4>
                  </div>
                  <div className="flex gap-2">
                    {stats.recentForm.map((result, index) => (
                      <div
                        key={index}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          result === "W"
                            ? "bg-success text-success-foreground"
                            : result === "L"
                            ? "bg-destructive text-destructive-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {result}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
