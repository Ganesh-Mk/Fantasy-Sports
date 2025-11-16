import { Match } from "@/types/fantasy";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, TrendingUp, Clock } from "lucide-react";
import { format } from "date-fns";

interface MatchCardProps {
  match: Match;
  onClick: () => void;
}

export const MatchCard = ({ match, onClick }: MatchCardProps) => {
  return (
    <Card
      onClick={onClick}
      className="overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-card/80 border border-border/50 group hover:border-primary/30 hover:scale-[1.02]"
    >
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-4 border-b border-border/30">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span className="font-medium">
              {format(new Date(match.match_date), "MMM dd, yyyy")}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span className="font-medium">
              {format(new Date(match.match_date), "hh:mm a")}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {match.is_ipl === 1 && (
            <Badge className="bg-gradient-to-r from-orange-500 to-pink-600 text-white border-0 text-xs font-semibold">
              IPL
            </Badge>
          )}
          <Badge variant="secondary" className="text-xs font-medium">
            {match.match_type}
          </Badge>
          <Badge
            variant={match.match_status === "upcoming" ? "default" : "outline"}
            className="text-xs capitalize"
          >
            {match.match_status}
          </Badge>
        </div>
      </div>

      {/* Teams Section */}
      <div className="p-5">
        <div className="flex items-center justify-between gap-4 mb-4">
          {/* Team 1 */}
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 p-3 group-hover:scale-110 transition-transform duration-300 shadow-md">
                <img
                  src={match.t1_image}
                  alt={match.t1_name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-card flex items-center justify-center">
                <TrendingUp className="h-3 w-3 text-white" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold">{match.t1_short_name}</p>
              <p className="text-xs text-muted-foreground truncate max-w-[80px]">
                {match.t1_name}
              </p>
            </div>
          </div>

          {/* VS Divider */}
          <div className="flex flex-col items-center gap-2 px-2">
            <div className="text-xl font-extrabold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              VS
            </div>
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-border to-transparent"></div>
          </div>

          {/* Team 2 */}
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 p-3 group-hover:scale-110 transition-transform duration-300 shadow-md">
                <img
                  src={match.t2_image}
                  alt={match.t2_name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-card flex items-center justify-center">
                <TrendingUp className="h-3 w-3 text-white" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold">{match.t2_short_name}</p>
              <p className="text-xs text-muted-foreground truncate max-w-[80px]">
                {match.t2_name}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="pt-3 border-t border-border/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              <span className="truncate max-w-[180px]">{match.event_name}</span>
            </div>

            {match.leagues_joined > 0 && (
              <Badge variant="outline" className="text-xs">
                {match.leagues_joined} Contests
              </Badge>
            )}
          </div>

          {match.in_review === 1 && (
            <div className="mt-2">
              <Badge
                variant="secondary"
                className="text-xs w-full justify-center"
              >
                Under Review
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Hover Effect Bottom Bar */}
      <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
    </Card>
  );
};
