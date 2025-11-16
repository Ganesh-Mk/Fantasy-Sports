import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Crown, Shield, Sparkles } from "lucide-react";
import { TeamSuggestion } from "@/utils/teamBuilderAlgorithm";

interface SmartSuggestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamSuggestions: TeamSuggestion[];
  generatingSuggestions: boolean;
  onUseSuggestion: (suggestion: TeamSuggestion) => void;
}

export const SmartSuggestModal = ({
  open,
  onOpenChange,
  teamSuggestions,
  generatingSuggestions,
  onUseSuggestion,
}: SmartSuggestModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto px-3">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Smart Team Suggestions
          </DialogTitle>
        </DialogHeader>

        {generatingSuggestions ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
            <span>Generating optimal team suggestions...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {teamSuggestions.map((suggestion) => (
              <Card key={suggestion.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{suggestion.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {suggestion.rationale}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        suggestion.confidence >= 80
                          ? "default"
                          : suggestion.confidence >= 60
                          ? "secondary"
                          : "outline"
                      }
                      className={
                        suggestion.confidence >= 80
                          ? "bg-green-500"
                          : suggestion.confidence >= 60
                          ? "bg-yellow-500"
                          : "bg-gray-500"
                      }
                    >
                      {suggestion.confidence}% Confidence
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium">Captain</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Crown className="h-4 w-4 text-yellow-500" />
                      <span className="font-semibold">
                        {suggestion.captain.name}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {suggestion.captain.role}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Vice-Captain</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Shield className="h-4 w-4 text-blue-500" />
                      <span className="font-semibold">
                        {suggestion.viceCaptain.name}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {suggestion.viceCaptain.role}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">
                      Team Composition
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Credits: {suggestion.totalCredits}/100
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {suggestion.players.map((player) => (
                      <div
                        key={player.player_id}
                        className="flex items-center justify-between p-2 bg-muted/50 rounded text-sm"
                      >
                        <div className="flex items-center gap-2">
                          {player.isCaptain && (
                            <Crown className="h-3 w-3 text-yellow-500" />
                          )}
                          {player.isViceCaptain && (
                            <Shield className="h-3 w-3 text-blue-500" />
                          )}
                          <span className="font-medium truncate">
                            {player.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Badge variant="outline" className="text-xs">
                            {player.role.split("-")[0]}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {player.event_player_credit}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={() => onUseSuggestion(suggestion)}
                  className="w-full bg-gradient-accent hover:opacity-90"
                >
                  Use This Team
                </Button>
              </Card>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
