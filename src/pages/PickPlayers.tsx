import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  Player,
  SelectedPlayer,
  Match,
  Team,
  MAX_CREDITS,
} from "@/types/fantasy";
import {
  canAddPlayer,
  getTotalCredits,
  isTeamValid,
} from "@/utils/teamValidation";
import { Loader2, ChevronDown, ChevronUp, Zap, Sparkles } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { PlayerStatsModal } from "@/components/players/PlayerStatsModal";
import { PlayerFilters } from "@/components/players/PlayerFilters";
import { RoleTabs } from "@/components/players/RoleTabs";
import { SmartSuggestModal } from "@/components/players/SmartSuggestModal";
import { TeamSlots } from "@/components/players/TeamSlots";
import { generatePlayerStats } from "@/services/api/playerStats";
import { PlayerStats } from "@/types/contest";
import { usePlayers } from "@/services/hooks/usePlayers";
import {
  generateTeamSuggestions,
  TeamSuggestion,
  quickFillTeam,
} from "@/utils/teamBuilderAlgorithm";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const PickPlayers = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const match = location.state?.match as Match;
  const existingTeam = location.state?.team as Team;
  const isEditing = location.state?.isEditing as boolean;
  const { toast } = useToast();

  const { data: allPlayers, isLoading: loading, error } = usePlayers();
  const [selectedPlayers, setSelectedPlayers] = useState<SelectedPlayer[]>([]);
  const [activeRole, setActiveRole] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [teamFilter, setTeamFilter] = useState<string>("All");
  const [countryFilter, setCountryFilter] = useState<string>("All");
  const [playingFilter, setPlayingFilter] = useState<string>("All");
  const [creditsFilter, setCreditsFilter] = useState<string>("All");
  const [selectedPlayerForStats, setSelectedPlayerForStats] =
    useState<Player | null>(null);
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showSmartSuggestModal, setShowSmartSuggestModal] = useState(false);
  const [generatingSuggestions, setGeneratingSuggestions] = useState(false);
  const [isTeamSlotsOpen, setIsTeamSlotsOpen] = useState(false);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load players",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  useEffect(() => {
    if (isEditing && existingTeam) {
      setSelectedPlayers(existingTeam.players);
    }
  }, [isEditing, existingTeam]);

  const teamSuggestions = useMemo(() => {
    if (!allPlayers || allPlayers.length === 0) return [];
    setGeneratingSuggestions(true);
    const suggestions = generateTeamSuggestions(allPlayers);
    setGeneratingSuggestions(false);
    return suggestions;
  }, [allPlayers]);

  const filteredPlayers = allPlayers
    ? allPlayers
        .filter((p) => activeRole === "All" || p.role === activeRole)
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.short_name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter((p) => teamFilter === "All" || p.team_name === teamFilter)
        .filter((p) => countryFilter === "All" || p.country === countryFilter)
        .filter(
          (p) =>
            playingFilter === "All" ||
            (playingFilter === "Playing" ? p.is_playing : !p.is_playing)
        )
        .filter((p) => {
          if (creditsFilter === "All") return true;
          const credit = p.event_player_credit;
          switch (creditsFilter) {
            case "4-6":
              return credit >= 4 && credit < 6;
            case "6-8":
              return credit >= 6 && credit < 8;
            case "8-10":
              return credit >= 8 && credit < 10;
            case "10+":
              return credit >= 10;
            default:
              return true;
          }
        })
    : [];

  const isPlayerSelected = (playerId: string) => {
    return selectedPlayers.some((p) => p.player_id === playerId);
  };

  const handlePlayerToggle = (player: Player) => {
    if (isPlayerSelected(player.player_id)) {
      setSelectedPlayers(
        selectedPlayers.filter((p) => p.player_id !== player.player_id)
      );
    } else {
      const validation = canAddPlayer(selectedPlayers, player);
      if (validation.canAdd) {
        setSelectedPlayers([...selectedPlayers, player]);
      } else {
        toast({
          title: "Cannot add player",
          description: validation.reason,
          variant: "destructive",
        });
      }
    }
  };

  const handlePlayerInfo = (player: Player, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPlayerForStats(player);
    setPlayerStats(generatePlayerStats(player.player_id));
    setShowStatsModal(true);
  };

  const handleNext = () => {
    if (selectedPlayers.length === 11 && isTeamValid(selectedPlayers)) {
      const teamId = isEditing && existingTeam ? existingTeam.id : "new";
      navigate(`/pick-captain/${matchId}/${teamId}`, {
        state: {
          match,
          players: selectedPlayers,
          team: isEditing ? existingTeam : undefined,
        },
      });
    } else {
      toast({
        title: "Invalid Team",
        description:
          "Please ensure your team meets all the requirements before proceeding.",
        variant: "destructive",
      });
    }
  };

  const handleUseSuggestedTeam = (suggestion: TeamSuggestion) => {
    setSelectedPlayers(suggestion.players);
    setShowSmartSuggestModal(false);
    toast({
      title: "Team Applied",
      description: `${suggestion.name} team has been selected. You can modify it as needed.`,
    });
  };

  const handleQuickFill = () => {
    if (!allPlayers) return;
    const filledTeam = quickFillTeam(selectedPlayers, allPlayers);
    setSelectedPlayers(filledTeam);
    toast({
      title: "Team Filled",
      description: `Added ${
        filledTeam.length - selectedPlayers.length
      } players to complete your team.`,
    });
  };

  const creditsLeft = MAX_CREDITS - getTotalCredits(selectedPlayers);
  const roles = ["All", "Wicket-Keeper", "Batsman", "All-Rounder", "Bowler"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 pb-32">
      <Header title="Select Players" showBack />

      <div className="lg:hidden container mx-auto px-4 pt-4">
        <Collapsible open={isTeamSlotsOpen} onOpenChange={setIsTeamSlotsOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="outline"
              className="w-full mb-4 justify-between"
              size="lg"
            >
              <span className="font-semibold">
                Your Team ({selectedPlayers.length}/11)
              </span>
              {isTeamSlotsOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <TeamSlots
              selectedPlayers={selectedPlayers}
              onRemovePlayer={(playerId) => {
                setSelectedPlayers(
                  selectedPlayers.filter((p) => p.player_id !== playerId)
                );
              }}
              match={match}
              onQuickFill={handleQuickFill}
              onAISuggest={() => setShowSmartSuggestModal(true)}
              canQuickFill={
                !!allPlayers &&
                allPlayers.length > 0 &&
                selectedPlayers.length < 11
              }
              canAISuggest={!!allPlayers && allPlayers.length > 0}
              isGeneratingSuggestions={generatingSuggestions}
            />
          </CollapsibleContent>
        </Collapsible>
      </div>

      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content - Player List */}
          <div className="flex-1 order-2 lg:order-1">
            <PlayerFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              teamFilter={teamFilter}
              onTeamFilterChange={setTeamFilter}
              countryFilter={countryFilter}
              onCountryFilterChange={setCountryFilter}
              playingFilter={playingFilter}
              onPlayingFilterChange={setPlayingFilter}
              creditsFilter={creditsFilter}
              onCreditsFilterChange={setCreditsFilter}
              allPlayers={allPlayers || []}
            />

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <RoleTabs
                activeRole={activeRole}
                onRoleChange={setActiveRole}
                selectedPlayers={selectedPlayers}
                filteredPlayers={filteredPlayers}
                isPlayerSelected={isPlayerSelected}
                onPlayerToggle={handlePlayerToggle}
                onPlayerInfo={handlePlayerInfo}
              />
            )}
          </div>

          {/* Sidebar - Updated sticky position (now top-20 since stats bar is removed) */}
          <aside className="w-full lg:w-96 order-1 lg:order-2 hidden lg:block">
            <div className="sticky top-20 space-y-4">
              <TeamSlots
                selectedPlayers={selectedPlayers}
                onRemovePlayer={(playerId) => {
                  setSelectedPlayers(
                    selectedPlayers.filter((p) => p.player_id !== playerId)
                  );
                }}
                match={match}
                onQuickFill={handleQuickFill}
                onAISuggest={() => setShowSmartSuggestModal(true)}
                canQuickFill={
                  !!allPlayers &&
                  allPlayers.length > 0 &&
                  selectedPlayers.length < 11
                }
                canAISuggest={!!allPlayers && allPlayers.length > 0}
                isGeneratingSuggestions={generatingSuggestions}
              />
            </div>
          </aside>
        </div>
      </div>

      {/* Fixed Bottom Bar - highest z-index */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border shadow-xl z-40">
        <div className="container mx-auto">
          <Button
            onClick={handleNext}
            disabled={
              selectedPlayers.length !== 11 || !isTeamValid(selectedPlayers)
            }
            className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed h-12"
            size="lg"
          >
            Continue ({selectedPlayers.length}/11)
            {selectedPlayers.length === 11 &&
              !isTeamValid(selectedPlayers) &&
              " - Fix Team Rules"}
          </Button>
        </div>
      </div>

      <SmartSuggestModal
        open={showSmartSuggestModal}
        onOpenChange={setShowSmartSuggestModal}
        teamSuggestions={teamSuggestions}
        generatingSuggestions={generatingSuggestions}
        onUseSuggestion={handleUseSuggestedTeam}
      />

      <PlayerStatsModal
        player={selectedPlayerForStats}
        stats={playerStats}
        open={showStatsModal}
        onClose={() => setShowStatsModal(false)}
      />
    </div>
  );
};

export default PickPlayers;
