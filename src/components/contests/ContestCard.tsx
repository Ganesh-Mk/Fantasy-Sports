import { Contest } from "@/types/contest";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, ArrowRight, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ContestCardProps {
  contest: Contest;
  onJoin: () => void;
}

export const ContestCard = ({ contest, onJoin }: ContestCardProps) => {
  const filledPercentage = (contest.filledSpots / contest.totalSpots) * 100;
  const spotsLeft = contest.totalSpots - contest.filledSpots;
  const isAlmostFull = filledPercentage >= 80;
  const isFull = filledPercentage >= 100;

  return (
    <Card className="overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 bg-gradient-card border border-border/50 hover:border-primary/30">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-4 border-b border-border/30">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Badge
              variant={contest.type === "mega" ? "default" : "secondary"}
              className="text-xs"
            >
              {contest.type.toUpperCase()}
            </Badge>
            {isAlmostFull && !isFull && (
              <Badge variant="destructive" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                Filling Fast
              </Badge>
            )}
          </div>
        </div>
        <h3 className="font-bold text-base">{contest.name}</h3>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Prize Pool */}
        <div className="mb-4">
          <p className="text-xs text-muted-foreground mb-1">Prize Pool</p>
          <p className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            ₹{contest.prizePool.toLocaleString()}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Winner Gets</p>
            <div className="flex items-center gap-1.5">
              <Trophy className="h-4 w-4 text-primary" />
              <p className="font-bold">
                ₹{contest.firstPrize.toLocaleString()}
              </p>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Spots Left</p>
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-muted-foreground" />
              <p className="font-bold">{spotsLeft.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-muted-foreground">
              {contest.filledSpots.toLocaleString()} /{" "}
              {contest.totalSpots.toLocaleString()}
            </span>
            <span className="font-medium">
              {filledPercentage.toFixed(0)}% filled
            </span>
          </div>
          <Progress value={filledPercentage} className="h-1.5" />
        </div>

        {/* Footer with Join Button */}
        <div className="flex items-center justify-between pt-3 border-t border-border/30">
          <div>
            <p className="text-xs text-muted-foreground">Entry Fee</p>
            <p className="text-lg font-bold">
              ₹{contest.entryFee.toLocaleString()}
            </p>
          </div>
          <Button
            onClick={onJoin}
            disabled={isFull}
            size="sm"
            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 disabled:opacity-50 px-5"
          >
            {isFull ? "Full" : "Join"}
            {!isFull && <ArrowRight className="h-4 w-4 ml-1.5" />}
          </Button>
        </div>
      </div>
    </Card>
  );
};
