import { Match } from "@/types/fantasy";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";

interface MatchHeaderProps {
  match: Match;
  teamsCount: number;
  contestsCount: number;
}

export const MatchHeader = ({
  match,
  teamsCount,
  contestsCount,
}: MatchHeaderProps) => {
  return (
    <Card className="overflow-hidden mb-6 shadow-xl border-border/50 animate-fade-in">
      <div className="bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-primary-foreground p-5">
        <div className="flex items-center justify-between gap-4 mb-4">
          {/* Team 1 */}
          <div className="flex flex-col items-center flex-1">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/10 p-3 mb-2">
              <img
                src={match.t1_image}
                alt={match.t1_name}
                className="w-full h-full object-contain"
              />
            </div>
            <p className="font-bold text-sm md:text-base">
              {match.t1_short_name}
            </p>
          </div>

          {/* VS Divider */}
          <div className="flex flex-col items-center px-4">
            <div className="text-2xl md:text-3xl font-extrabold mb-1">VS</div>
            <div className="h-px w-16 bg-white/30"></div>
          </div>

          {/* Team 2 */}
          <div className="flex flex-col items-center flex-1">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/10 p-3 mb-2">
              <img
                src={match.t2_image}
                alt={match.t2_name}
                className="w-full h-full object-contain"
              />
            </div>
            <p className="font-bold text-sm md:text-base">
              {match.t2_short_name}
            </p>
          </div>
        </div>

        {/* Match Details */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 pt-3 border-t border-white/20">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 opacity-75" />
            <span className="opacity-90">{match.event_name}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 opacity-75" />
            <span className="opacity-90">
              {format(new Date(match.match_date), "MMM dd, yyyy • hh:mm a")}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="bg-muted/30 px-5 py-3 flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-muted-foreground">Your Teams:</span>
            <span className="ml-2 font-bold">{teamsCount}</span>
          </div>
          <div className="h-4 w-px bg-border"></div>
          <div>
            <span className="text-muted-foreground">Contests:</span>
            <span className="ml-2 font-bold">{contestsCount}</span>
          </div>
        </div>
        <Badge variant="secondary" className="text-xs">
          {match.match_status}
        </Badge>
      </div>
    </Card>
  );
};
