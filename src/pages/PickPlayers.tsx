import { useEffect, useState, useMemo } from "react";
import {
  Info,
  Search,
  Filter,
  Sparkles,
  Crown,
  Shield,
  Zap,
  TrendingUp,
} from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Player,
  SelectedPlayer,
  Match,
  Team,
  ROLE_LIMITS,
  MAX_CREDITS,
} from "@/types/fantasy";
import {
  canAddPlayer,
  getTotalCredits,
  getRoleCount,
} from "@/utils/teamValidation";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PlayerStatsModal } from "@/components/PlayerStatsModal";
import { generatePlayerStats } from "@/services/api/playerStats";
import { PlayerStats } from "@/types/contest";
import { usePlayers } from "@/services/hooks/usePlayers";
import {
  generateTeamSuggestions,
  TeamSuggestion,
  quickFillTeam,
} from "@/utils/teamBuilderAlgorithm";

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
    if (selectedPlayers.length === 11) {
      const teamId = isEditing && existingTeam ? existingTeam.id : "new";
      navigate(`/pick-captain/${matchId}/${teamId}`, {
        state: {
          match,
          players: selectedPlayers,
          team: isEditing ? existingTeam : undefined,
        },
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

      <div className="sticky top-16 md:top-20 z-40 bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-primary-foreground shadow-md border-b border-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3">
          {/* Mobile Layout */}
          <div className="md:hidden">
            <div className="flex items-center justify-between mb-3">
              {/* Stats */}
              <div className="flex gap-4">
                <div>
                  <p className="text-xs opacity-75">Players</p>
                  <p className="text-lg font-bold">
                    {selectedPlayers.length}
                    <span className="text-sm opacity-70">/11</span>
                  </p>
                </div>
                <div className="h-10 w-px bg-white/20"></div>
                <div>
                  <p className="text-xs opacity-75">Credits</p>
                  <p className="text-lg font-bold">{creditsLeft.toFixed(1)}</p>
                </div>
              </div>

              {/* Team Logos */}
              {match && (
                <div className="flex items-center gap-2">
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
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleQuickFill}
                      disabled={
                        !allPlayers ||
                        allPlayers.length === 0 ||
                        selectedPlayers.length >= 11
                      }
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
                      onClick={() => setShowSmartSuggestModal(true)}
                      disabled={
                        !allPlayers ||
                        allPlayers.length === 0 ||
                        generatingSuggestions
                      }
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
              </TooltipProvider>
            </div>
          </div>

          {/* Desktop Layout - Single Compact Row */}
          <div className="hidden md:flex items-center justify-between">
            <div className="flex items-center gap-6">
              {/* Stats */}
              <div className="flex gap-5">
                <div>
                  <p className="text-xs opacity-75">Players</p>
                  <p className="text-xl font-bold">
                    {selectedPlayers.length}
                    <span className="text-sm opacity-70 ml-0.5">/11</span>
                  </p>
                </div>
                <div className="h-11 w-px bg-white/20"></div>
                <div>
                  <p className="text-xs opacity-75">Credits Left</p>
                  <p className="text-xl font-bold">{creditsLeft.toFixed(1)}</p>
                </div>
              </div>

              <div className="h-11 w-px bg-white/20"></div>

              {/* Action Buttons */}
              <TooltipProvider>
                <div className="flex gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleQuickFill}
                        disabled={
                          !allPlayers ||
                          allPlayers.length === 0 ||
                          selectedPlayers.length >= 11
                        }
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
                        onClick={() => setShowSmartSuggestModal(true)}
                        disabled={
                          !allPlayers ||
                          allPlayers.length === 0 ||
                          generatingSuggestions
                        }
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
                </div>
              </TooltipProvider>
            </div>

            {/* Match Info */}
            {match && (
              <div className="flex items-center gap-3">
                <p className="text-sm opacity-75">{match.match_name}</p>
                <div className="flex items-center gap-2">
                  <img
                    src={match.t1_image}
                    alt={match.t1_name}
                    className="w-8 h-8"
                  />
                  <span className="text-xs opacity-50">vs</span>
                  <img
                    src={match.t2_image}
                    alt={match.t2_name}
                    className="w-8 h-8"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-4">
        {/* Filters Section - Responsive Layout */}
        <div className="mb-6">
          {/* Search Bar - Full width on all devices */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search players by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11"
            />
          </div>

          {/* Filter Dropdowns - Responsive Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Select value={teamFilter} onValueChange={setTeamFilter}>
              <SelectTrigger className="w-full h-11">
                <SelectValue placeholder="Team" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Teams</SelectItem>
                {[...new Set(allPlayers?.map((p) => p.team_name) || [])].map(
                  (team) => (
                    <SelectItem key={team} value={team}>
                      {team}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>

            <Select value={countryFilter} onValueChange={setCountryFilter}>
              <SelectTrigger className="w-full h-11">
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Countries</SelectItem>
                {[...new Set(allPlayers?.map((p) => p.country) || [])].map(
                  (country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>

            <Select value={playingFilter} onValueChange={setPlayingFilter}>
              <SelectTrigger className="w-full h-11">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Players</SelectItem>
                <SelectItem value="Playing">Playing</SelectItem>
                <SelectItem value="Not Playing">Not Playing</SelectItem>
              </SelectContent>
            </Select>

            <Select value={creditsFilter} onValueChange={setCreditsFilter}>
              <SelectTrigger className="w-full h-11">
                <SelectValue placeholder="Credits" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Credits</SelectItem>
                <SelectItem value="4-6">4 - 6</SelectItem>
                <SelectItem value="6-8">6 - 8</SelectItem>
                <SelectItem value="8-10">8 - 10</SelectItem>
                <SelectItem value="10+">10+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Role Tabs - Improved Mobile Design */}
        <Tabs
          value={activeRole}
          onValueChange={setActiveRole}
          className="w-full"
        >
          {/* Desktop Tabs - Grid Layout */}
          <TabsList className="hidden md:grid w-full grid-cols-5 mb-6 h-12 bg-muted/50">
            {roles.map((role) => {
              const count =
                role === "All"
                  ? selectedPlayers.length
                  : getRoleCount(selectedPlayers, role);
              const limits =
                role !== "All"
                  ? ROLE_LIMITS[role as keyof typeof ROLE_LIMITS]
                  : null;

              return (
                <TabsTrigger
                  key={role}
                  value={role}
                  className="text-sm font-medium data-[state=active]:bg-background"
                >
                  {role === "All" ? "All Players" : role}
                  {limits && (
                    <span className="ml-2 text-xs opacity-70">
                      ({count}/{limits.max})
                    </span>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Mobile Tabs - Horizontal Scroll with Pills */}
          <div className="md:hidden mb-6">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {roles.map((role) => {
                const count =
                  role === "All"
                    ? selectedPlayers.length
                    : getRoleCount(selectedPlayers, role);
                const limits =
                  role !== "All"
                    ? ROLE_LIMITS[role as keyof typeof ROLE_LIMITS]
                    : null;
                const isActive = activeRole === role;

                return (
                  <button
                    key={role}
                    onClick={() => setActiveRole(role)}
                    className={`
                flex-shrink-0 px-4 py-2.5 rounded-full font-medium text-sm
                transition-all duration-200 whitespace-nowrap
                ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md scale-105"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }
              `}
                  >
                    <span>{role === "All" ? "All" : role.split("-")[0]}</span>
                    {limits && (
                      <span className="ml-1.5 text-xs opacity-80">
                        {count}/{limits.max}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <TabsContent value={activeRole} className="space-y-3 mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredPlayers.map((player) => {
                  const selected = isPlayerSelected(player.player_id);
                  return (
                    <Card
                      key={player.player_id}
                      className={`overflow-hidden cursor-pointer transition-all duration-300 bg-gradient-card hover:shadow-xl group relative ${
                        selected
                          ? "border-primary border-2 shadow-lg shadow-primary/20 ring-2 ring-primary/10"
                          : "border-border hover:border-primary/30"
                      }`}
                      onClick={() => handlePlayerToggle(player)}
                    >
                      {/* Selection Indicator */}
                      {selected && (
                        <div className="absolute top-0 right-0 w-0 h-0 border-l-[40px] border-l-transparent border-t-[40px] border-t-primary">
                          <div className="absolute -top-9 -right-0.5">
                            <svg
                              className="w-5 h-5 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                      )}

                      {/* Player Header */}
                      <div className="p-4 pb-3">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-start gap-3 flex-1">
                            <Checkbox
                              checked={selected}
                              className="mt-1"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-bold text-base truncate">
                                  {player.name}
                                </p>
                                {player.is_playing && (
                                  <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {player.short_name}
                              </p>

                              {/* Badges */}
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <Badge
                                  variant="secondary"
                                  className="text-xs font-medium"
                                >
                                  {player.team_name}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {player.country}
                                </Badge>
                                {player.is_playing && (
                                  <Badge className="text-xs bg-green-500 hover:bg-green-600 border-0">
                                    Playing XI
                                  </Badge>
                                )}
                              </div>

                              {/* Role */}
                              <div className="mt-2">
                                <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                                  {player.role}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Info Button */}
                          {player.player_stats_available && (
                            <button
                              onClick={(e) => handlePlayerInfo(player, e)}
                              className="flex-shrink-0 p-2 hover:bg-primary/10 rounded-lg transition-colors group/info"
                              aria-label="View player stats"
                            >
                              <Info className="h-4 w-4 text-muted-foreground group-hover/info:text-primary transition-colors" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Stats Footer */}
                      <div className="bg-gradient-to-r from-muted/30 via-muted/20 to-muted/30 px-4 py-3 border-t border-border/50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div>
                              <p className="text-xs text-muted-foreground mb-0.5">
                                Points
                              </p>
                              <div className="flex items-baseline gap-1">
                                <p className="text-lg font-bold">
                                  {player.event_total_points}
                                </p>
                                <TrendingUp className="h-3 w-3 text-green-500" />
                              </div>
                            </div>
                            <div className="h-10 w-px bg-border"></div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-0.5">
                                Credits
                              </p>
                              <p className="text-xl font-bold text-primary">
                                {player.event_player_credit}
                              </p>
                            </div>
                          </div>

                          {/* Value Indicator */}
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground mb-0.5">
                              Value
                            </p>
                            <div className="flex items-center gap-1">
                              <Badge
                                variant="outline"
                                className={`text-xs font-bold ${
                                  player.event_total_points /
                                    player.event_player_credit >
                                  1.5
                                    ? "border-green-500 text-green-500"
                                    : player.event_total_points /
                                        player.event_player_credit >
                                      1
                                    ? "border-yellow-500 text-yellow-500"
                                    : "border-muted-foreground text-muted-foreground"
                                }`}
                              >
                                {(
                                  player.event_total_points /
                                  player.event_player_credit
                                ).toFixed(1)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Hover Effect Bottom Bar */}
                      {!selected && (
                        <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          )}
        </Tabs>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border">
        <div className="container mx-auto">
          <Button
            onClick={handleNext}
            disabled={selectedPlayers.length !== 11}
            className="w-full bg-gradient-accent hover:opacity-90 text-accent-foreground font-semibold shadow-glow"
            size="lg"
          >
            Continue ({selectedPlayers.length}/11)
          </Button>
        </div>
      </div>

      <Dialog
        open={showSmartSuggestModal}
        onOpenChange={setShowSmartSuggestModal}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
                    onClick={() => handleUseSuggestedTeam(suggestion)}
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
