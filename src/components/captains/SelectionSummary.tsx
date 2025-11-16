import { SelectedPlayer } from "@/types/fantasy";
import { Trophy, Shield, Info } from "lucide-react";

interface SelectionSummaryProps {
  captainId: string | null;
  viceCaptainId: string | null;
  players: SelectedPlayer[];
}

export const SelectionSummary = ({
  captainId,
  viceCaptainId,
  players,
}: SelectionSummaryProps) => {
  return (
    <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-xl p-3 mb-4">
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3 lg:gap-6">
        {/* Info Section */}
        <div className="flex items-start gap-2 text-sm">
          <Info className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Trophy className="h-3.5 w-3.5 text-yellow-500 flex-shrink-0" />
              <span className="text-muted-foreground text-xs sm:text-sm">
                Captain: <strong className="text-foreground">2x</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
              <span className="text-muted-foreground text-xs sm:text-sm">
                Vice Captain: <strong className="text-foreground">1.5x</strong>
              </span>
            </div>
          </div>
        </div>

        <div className="h-px lg:h-8 w-full lg:w-px bg-border"></div>

        {/* Selection Cards */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 flex-1 w-full lg:w-auto">
          <div
            className={`flex-1 p-2.5 rounded-lg border-2 transition-all min-w-0 ${
              captainId
                ? "bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/40"
                : "bg-muted/30 border-border"
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <Trophy className="h-3.5 w-3.5 text-yellow-500" />
                <p className="text-xs font-medium opacity-75 whitespace-nowrap">
                  C:
                </p>
              </div>
              <p className="font-bold text-sm truncate ml-auto">
                {captainId
                  ? players.find((p) => p.player_id === captainId)?.short_name
                  : "Not Selected"}
              </p>
            </div>
          </div>

          <div
            className={`flex-1 p-2.5 rounded-lg border-2 transition-all min-w-0 ${
              viceCaptainId
                ? "bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-500/40"
                : "bg-muted/30 border-border"
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <Shield className="h-3.5 w-3.5 text-blue-500" />
                <p className="text-xs font-medium opacity-75 whitespace-nowrap">
                  VC:
                </p>
              </div>
              <p className="font-bold text-sm truncate ml-auto">
                {viceCaptainId
                  ? players.find((p) => p.player_id === viceCaptainId)
                      ?.short_name
                  : "Not Selected"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
