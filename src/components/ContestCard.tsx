import { Contest } from "@/types/contest";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Trophy, Users, Ticket } from "lucide-react";
import { Progress } from "./ui/progress";

interface ContestCardProps {
  contest: Contest;
  onJoin: () => void;
}

export const ContestCard = ({ contest, onJoin }: ContestCardProps) => {
  const filledPercentage = (contest.filledSpots / contest.totalSpots) * 100;

  return (
    <Card className="p-5 bg-gradient-card hover:shadow-elegant transition-all duration-300 border-border/50 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge
              variant={
                contest.type === "mega"
                  ? "default"
                  : contest.type === "small"
                  ? "secondary"
                  : "outline"
              }
              className={
                contest.type === "mega"
                  ? "bg-gradient-accent text-accent-foreground"
                  : ""
              }
            >
              {contest.type.toUpperCase()}
            </Badge>
          </div>
          <h3 className="font-bold text-lg">{contest.name}</h3>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-accent">₹{contest.prizePool.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Prize Pool</p>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-accent" />
            <span className="text-muted-foreground">1st Prize</span>
          </div>
          <span className="font-semibold">₹{contest.firstPrize.toLocaleString()}</span>
        </div>

        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Spots</span>
            </div>
            <span className="font-medium">
              {contest.filledSpots} / {contest.totalSpots}
            </span>
          </div>
          <Progress value={filledPercentage} className="h-1.5" />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          onClick={onJoin}
          className="flex-1 bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold"
        >
          <Ticket className="h-4 w-4 mr-2" />
          Join ₹{contest.entryFee}
        </Button>
      </div>
    </Card>
  );
};
