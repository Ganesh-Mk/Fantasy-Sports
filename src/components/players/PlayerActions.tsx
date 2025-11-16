import { Button } from "@/components/ui/button";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Zap, Sparkles } from "lucide-react";

interface PlayerActionsProps {
  onQuickFill: () => void;
  onAISuggest: () => void;
  canQuickFill: boolean;
  canAISuggest: boolean;
  isGeneratingSuggestions: boolean;
}

export const PlayerActions = ({
  onQuickFill,
  onAISuggest,
  canQuickFill,
  canAISuggest,
  isGeneratingSuggestions,
}: PlayerActionsProps) => {
  return (
    <TooltipProvider>
      <div className="flex gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              size="sm"
              onClick={onQuickFill}
              disabled={!canQuickFill}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              <Zap className="h-4 w-4 mr-1.5" />
              Quick Fill
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Auto-fill remaining slots</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              size="sm"
              onClick={onAISuggest}
              disabled={!canAISuggest || isGeneratingSuggestions}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              <Sparkles className="h-4 w-4 mr-1.5" />
              AI Suggest
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>AI-powered suggestions</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};
