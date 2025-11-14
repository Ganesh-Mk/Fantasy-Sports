import { Match } from "@/types/fantasy";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Calendar, Trophy, Users } from "lucide-react";
import { format } from "date-fns";

interface MatchCardProps {
  match: Match;
  onClick: () => void;
}

export const MatchCard = ({ match, onClick }: MatchCardProps) => {
  return (
    <Card
      onClick={onClick}
      className="p-5 cursor-pointer hover:shadow-elegant transition-all duration-300 bg-gradient-card border-border/50 group"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{format(new Date(match.match_date), "MMM dd, hh:mm a")}</span>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary" className="text-xs">
            {match.match_type}
          </Badge>
          <Badge
            variant={match.match_status === "upcoming" ? "default" : "outline"}
            className="text-xs"
          >
            {match.match_status}
          </Badge>
          {match.is_ipl === 1 && (
            <Badge variant="destructive" className="text-xs">
              IPL
            </Badge>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-6">
        <div className="flex flex-col items-center gap-3 flex-1">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-background to-secondary/30 p-2 group-hover:scale-110 transition-transform">
            <img
              src={match.t1_image}
              alt={match.t1_name}
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-sm font-bold text-center">
            {match.t1_short_name}
          </span>
        </div>

        <div className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          VS
        </div>

        <div className="flex flex-col items-center gap-3 flex-1">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-background to-secondary/30 p-2 group-hover:scale-110 transition-transform">
            <img
              src={match.t2_image}
              alt={match.t2_name}
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-sm font-bold text-center">
            {match.t2_short_name}
          </span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-border/50">
        <p className="text-xs text-muted-foreground text-center">
          {match.event_name}
        </p>
        <div className="flex justify-center gap-2 mt-2">
          {match.leagues_joined > 0 && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="h-3 w-3" />
              <span>{match.leagues_joined} leagues</span>
            </div>
          )}
          {match.in_review === 1 && (
            <Badge variant="outline" className="text-xs">
              In Review
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
};
