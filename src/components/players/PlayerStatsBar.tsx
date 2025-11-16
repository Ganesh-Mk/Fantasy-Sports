import { Match } from "@/types/fantasy";
import { Button } from "@/components/ui/button";
import { Zap, Sparkles } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PlayerStatsBarProps {
  selectedCount: number;
  creditsLeft: number;
  match: Match | undefined;
  onQuickFill: () => void;
  onAISuggest: () => void;
  canQuickFill: boolean;
  canAISuggest: boolean;
  isGeneratingSuggestions: boolean;
}

export const PlayerStatsBar = ({
  selectedCount,
  creditsLeft,
  match,
  onQuickFill,
  onAISuggest,
  canQuickFill,
  canAISuggest,
  isGeneratingSuggestions,
}: PlayerStatsBarProps) => {
  return (
    <div className="sticky top-16 md:top-20 z-40 bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-primary-foreground shadow-md border-b border-white/10 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 md:gap-6">
            <div>
              <p className="text-xs opacity-75">Players</p>
              <p className="text-lg font-bold">
                {selectedCount}
                <span className="text-sm opacity-70 ml-0.5">/11</span>
              </p>
            </div>
            <div className="h-10 w-px bg-white/20"></div>
            <div>
              <p className="text-xs opacity-75">Credits Left</p>
              <p className="text-lg font-bold">{creditsLeft.toFixed(1)}</p>
            </div>

            {match && (
              <>
                <div className="h-10 w-px bg-white/20 hidden md:block"></div>
                <div className="hidden md:flex items-center gap-2">
                  <img
                    src={match.t1_image}
                    alt={match.t1_name}
                    className="w-6 h-6"
                  />
                  <span className="text-xs opacity-50">vs</span>
                  <img
                    src={match.t2_image}
                    alt={match.t2_name}
                    className="w-6 h-6"
                  />
                </div>
              </>
            )}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={onQuickFill}
                    disabled={!canQuickFill}
                    className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Quick Fill
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Auto-fill remaining player slots</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={onAISuggest}
                    disabled={!canAISuggest || isGeneratingSuggestions}
                    className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    AI Suggest
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Get AI-powered team suggestions</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  );
};
