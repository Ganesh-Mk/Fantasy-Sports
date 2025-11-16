import { SelectedPlayer } from "@/types/fantasy";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Shield, Star } from "lucide-react";

interface CaptainCardProps {
  player: SelectedPlayer;
  isCaptain: boolean;
  isViceCaptain: boolean;
  onSelectCaptain: (playerId: string) => void;
  onSelectViceCaptain: (playerId: string) => void;
}

export const CaptainCard = ({
  player,
  isCaptain,
  isViceCaptain,
  onSelectCaptain,
  onSelectViceCaptain,
}: CaptainCardProps) => {
  return (
    <Card
      className={`p-4 bg-gradient-card transition-all duration-300 ${
        isCaptain
          ? "border-yellow-500 border-2 shadow-lg shadow-yellow-500/20 bg-gradient-to-br from-yellow-500/10 to-orange-500/5"
          : isViceCaptain
          ? "border-blue-500 border-2 shadow-lg shadow-blue-500/20 bg-gradient-to-br from-blue-500/10 to-purple-500/5"
          : "border-border hover:shadow-lg hover:border-primary/30"
      }`}
    >
      {/* Player Info */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <p className="font-bold text-base">{player.short_name}</p>
            {isCaptain && (
              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 text-xs">
                <Star className="h-3 w-3 mr-1 fill-white" />C
              </Badge>
            )}
            {isViceCaptain && (
              <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 text-xs">
                <Shield className="h-3 w-3 mr-1" />
                VC
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="text-xs">
              {player.team_short_name}
            </Badge>
            <span className="text-xs text-muted-foreground">{player.role}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Points</p>
          <p className="text-lg font-bold">{player.event_total_points}</p>
        </div>
      </div>

      {/* Selection Buttons */}
      <div className="flex gap-2">
        <Button
          variant={isCaptain ? "default" : "outline"}
          size="sm"
          className={`flex-1 transition-all ${
            isCaptain
              ? "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-md border-0"
              : "hover:bg-yellow-500/10 hover:border-yellow-500/50"
          }`}
          onClick={() => onSelectCaptain(player.player_id)}
        >
          <Trophy className="h-4 w-4 mr-1.5" />
          {isCaptain ? "Captain" : "Make C"}
        </Button>
        <Button
          variant={isViceCaptain ? "default" : "outline"}
          size="sm"
          className={`flex-1 transition-all ${
            isViceCaptain
              ? "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-md border-0"
              : "hover:bg-blue-500/10 hover:border-blue-500/50"
          }`}
          onClick={() => onSelectViceCaptain(player.player_id)}
        >
          <Shield className="h-4 w-4 mr-1.5" />
          {isViceCaptain ? "Vice Captain" : "Make VC"}
        </Button>
      </div>
    </Card>
  );
};
