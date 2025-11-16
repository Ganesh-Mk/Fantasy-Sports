import { Team, Match } from "@/types/fantasy";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Trophy, Shield, Eye, Edit } from "lucide-react";
import { format } from "date-fns";

interface TeamCardProps {
  team: Team;
  onView: (team: Team) => void;
  onEdit: (team: Team) => void;
}

export const TeamCard = ({ team, onView, onEdit }: TeamCardProps) => {
  const captain = team.players.find((p) => p.isCaptain);
  const viceCaptain = team.players.find((p) => p.isViceCaptain);
  const totalCredits = team.players.reduce(
    (sum, p) => sum + p.event_player_credit,
    0
  );

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-gradient-card group border-border/50 hover:border-primary/30">
      {/* Team Header */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-4 border-b border-border/30">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Badge className="bg-primary text-primary-foreground">
              Team {Math.floor(Math.random() * 10) + 1} {/* Placeholder */}
            </Badge>
            <Badge variant="outline" className="text-xs">
              11 Players
            </Badge>
          </div>
          <Users className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
        <p className="text-xs text-muted-foreground">
          Created {format(new Date(team.createdAt), "MMM dd, hh:mm a")}
        </p>
      </div>

      {/* Team Details */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Captain */}
          <div className="flex items-start gap-2">
            <div className="p-2 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg">
              <Trophy className="h-4 w-4 text-yellow-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground mb-0.5">Captain</p>
              <p className="font-bold text-sm truncate">
                {captain?.short_name || "Not selected"}
              </p>
            </div>
          </div>

          {/* Vice Captain */}
          <div className="flex items-start gap-2">
            <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg">
              <Shield className="h-4 w-4 text-blue-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground mb-0.5">
                Vice Captain
              </p>
              <p className="font-bold text-sm truncate">
                {viceCaptain?.short_name || "Not selected"}
              </p>
            </div>
          </div>
        </div>

        {/* Credits Used */}
        <div className="bg-muted/30 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Credits Used</span>
            <span className="font-bold">{totalCredits.toFixed(1)} / 100</span>
          </div>
          <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent transition-all"
              style={{ width: `${totalCredits}%` }}
            ></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onView(team)}
          >
            <Eye className="h-4 w-4 mr-1.5" />
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onEdit(team)}
          >
            <Edit className="h-4 w-4 mr-1.5" />
            Edit
          </Button>
        </div>
      </div>
    </Card>
  );
};
