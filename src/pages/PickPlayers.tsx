import { useEffect, useState } from "react";
import { Info, Search, Filter } from "lucide-react";
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
  Player,
  SelectedPlayer,
  Match,
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

const PickPlayers = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const match = location.state?.match as Match;
  const { toast } = useToast();

  const { data: allPlayers, isLoading: loading, error } = usePlayers();
  const [selectedPlayers, setSelectedPlayers] = useState<SelectedPlayer[]>([]);
  const [activeRole, setActiveRole] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [teamFilter, setTeamFilter] = useState<string>("All");
  const [countryFilter, setCountryFilter] = useState<string>("All");
  const [playingFilter, setPlayingFilter] = useState<string>("All");
  const [selectedPlayerForStats, setSelectedPlayerForStats] =
    useState<Player | null>(null);
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
  const [showStatsModal, setShowStatsModal] = useState(false);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load players",
        variant: "destructive",
      });
    }
  }, [error, toast]);

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
      navigate(`/pick-captain/${matchId}/new`, {
        state: { match, players: selectedPlayers },
      });
    }
  };

  const creditsLeft = MAX_CREDITS - getTotalCredits(selectedPlayers);
  const roles = ["All", "Wicket-Keeper", "Batsman", "All-Rounder", "Bowler"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 pb-32">
      <Header title="Select Players" showBack />

      <div className="sticky top-14 z-40 bg-gradient-primary text-primary-foreground p-4 shadow-elegant">
        <div className="container mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex gap-4">
            <div>
              <p className="text-xs opacity-90">Players</p>
              <p className="font-bold">{selectedPlayers.length}/11</p>
            </div>
            <div>
              <p className="text-xs opacity-90">Credits Left</p>
              <p className="font-bold">{creditsLeft.toFixed(1)}</p>
            </div>
          </div>
          {match && (
            <div className="flex items-center gap-2">
              <img
                src={match.t1_image}
                alt={match.t1_name}
                className="w-8 h-8"
              />
              <img
                src={match.t2_image}
                alt={match.t2_name}
                className="w-8 h-8"
              />
            </div>
          )}
        </div>
      </div>

      <main className="container mx-auto px-4 py-4">
        <div className="mb-4 space-y-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search players by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <Select value={teamFilter} onValueChange={setTeamFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by team" />
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
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by country" />
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
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Playing status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Players</SelectItem>
                <SelectItem value="Playing">Playing</SelectItem>
                <SelectItem value="Not Playing">Not Playing</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Tabs
          value={activeRole}
          onValueChange={setActiveRole}
          className="w-full"
        >
          <TabsList className="w-full grid grid-cols-5 mb-4">
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
                <TabsTrigger key={role} value={role} className="text-xs">
                  {role === "All" ? "All" : role.split("-")[0]}
                  {limits && ` (${count})`}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <TabsContent value={activeRole} className="space-y-3">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                {filteredPlayers.map((player) => {
                  const selected = isPlayerSelected(player.player_id);
                  return (
                    <Card
                      key={player.player_id}
                      className={`p-4 cursor-pointer transition-all bg-gradient-card hover:shadow-elegant group ${
                        selected ? "border-accent border-2 shadow-glow" : ""
                      }`}
                      onClick={() => handlePlayerToggle(player)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3 flex-1">
                          <Checkbox checked={selected} />
                          <div className="flex-1">
                            <p className="font-semibold">{player.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {player.short_name}
                            </p>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <Badge variant="secondary" className="text-xs">
                                {player.team_name}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {player.country}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {player.role}
                              </span>
                              {player.is_playing && (
                                <Badge
                                  variant="default"
                                  className="text-xs bg-green-500"
                                >
                                  Playing
                                </Badge>
                              )}
                              {player.player_stats_available && (
                                <Info className="h-3 w-3 text-blue-500" />
                              )}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={(e) => handlePlayerInfo(player, e)}
                          className="p-2 hover:bg-muted rounded-full transition-colors"
                        >
                          <Info className="h-4 w-4 text-muted-foreground hover:text-primary" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-border/50">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Points
                          </p>
                          <p className="font-semibold">
                            {player.event_total_points}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            Credits
                          </p>
                          <p className="font-bold text-lg text-accent">
                            {player.event_player_credit}
                          </p>
                        </div>
                      </div>
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
