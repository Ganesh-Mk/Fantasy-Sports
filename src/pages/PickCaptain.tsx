import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SelectedPlayer, Match, Team } from "@/types/fantasy";
import { Badge } from "@/components/ui/badge";
import { Trophy, Shield, Star, Info } from "lucide-react";
import { saveTeam, getTeamById } from "@/utils/teamStorage";
import { useToast } from "@/hooks/use-toast";

const PickCaptain = () => {
  const { matchId, teamId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const match = location.state?.match as Match;
  const existingTeam = location.state?.team as Team;
  const newPlayers = location.state?.players as SelectedPlayer[];

  const [players, setPlayers] = useState<SelectedPlayer[]>([]);
  const [captainId, setCaptainId] = useState<string | null>(null);
  const [viceCaptainId, setViceCaptainId] = useState<string | null>(null);

  useEffect(() => {
    if (newPlayers) {
      setPlayers(newPlayers);
      // If editing and existing team, try to keep captain/vice if they are still in players
      if (existingTeam) {
        const captain = existingTeam.players.find((p) => p.isCaptain);
        const viceCaptain = existingTeam.players.find((p) => p.isViceCaptain);
        if (
          captain &&
          newPlayers.some((p) => p.player_id === captain.player_id)
        ) {
          setCaptainId(captain.player_id);
        }
        if (
          viceCaptain &&
          newPlayers.some((p) => p.player_id === viceCaptain.player_id)
        ) {
          setViceCaptainId(viceCaptain.player_id);
        }
      }
    } else if (teamId && teamId !== "new") {
      const team = getTeamById(teamId);
      if (team) {
        setPlayers(team.players);
        const captain = team.players.find((p) => p.isCaptain);
        const viceCaptain = team.players.find((p) => p.isViceCaptain);
        if (captain) setCaptainId(captain.player_id);
        if (viceCaptain) setViceCaptainId(viceCaptain.player_id);
      }
    }
  }, [teamId, newPlayers, existingTeam]);

  const handleSelectCaptain = (playerId: string) => {
    if (captainId === playerId) {
      setCaptainId(null);
    } else {
      setCaptainId(playerId);
      if (viceCaptainId === playerId) {
        setViceCaptainId(null);
      }
    }
  };

  const handleSelectViceCaptain = (playerId: string) => {
    if (viceCaptainId === playerId) {
      setViceCaptainId(null);
    } else {
      setViceCaptainId(playerId);
      if (captainId === playerId) {
        setCaptainId(null);
      }
    }
  };

  const handleSaveTeam = () => {
    if (!captainId || !viceCaptainId) {
      toast({
        title: "Selection Required",
        description: "Please select both captain and vice-captain",
        variant: "destructive",
      });
      return;
    }

    const updatedPlayers = players.map((player) => ({
      ...player,
      isCaptain: player.player_id === captainId,
      isViceCaptain: player.player_id === viceCaptainId,
    }));

    const team: Team = {
      id: teamId === "new" ? `team_${Date.now()}` : teamId!,
      matchId: parseInt(matchId!),
      name: existingTeam?.name || `Team ${new Date().toLocaleString()}`,
      players: updatedPlayers,
      createdAt: existingTeam?.createdAt || new Date().toISOString(),
    };

    saveTeam(team);

    toast({
      title: "Success",
      description: "Team saved successfully!",
    });

    navigate(`/my-teams/${matchId}`, { state: { match } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 pb-32">
      <Header title="Select Captain & Vice Captain" showBack />

      {/* Info Bar */}
      <div className="sticky top-16 md:top-20 z-40 bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-primary-foreground shadow-md border-b border-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3">
          {match && (
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-bold text-sm md:text-base">
                  {match.t1_short_name} vs {match.t2_short_name}
                </p>
                <p className="text-xs opacity-75">{match.event_name}</p>
              </div>
              <div className="flex items-center gap-2">
                <img
                  src={match.t1_image}
                  alt={match.t1_name}
                  className="w-7 h-7 md:w-8 md:h-8"
                />
                <span className="text-xs opacity-50">vs</span>
                <img
                  src={match.t2_image}
                  alt={match.t2_name}
                  className="w-7 h-7 md:w-8 md:h-8"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="container mx-auto px-4 py-4">
        {/* Compact Info & Selection Bar */}
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-xl p-3 mb-4">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-6">
            {/* Info */}
            <div className="flex items-center gap-2 text-sm">
              <Info className="h-4 w-4 text-primary flex-shrink-0" />
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <Trophy className="h-3.5 w-3.5 text-yellow-500" />
                  <span className="text-muted-foreground">
                    Captain gets:{" "}
                    <strong className="text-foreground">2x</strong>
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-blue-500" />
                  <span className="text-muted-foreground">
                    Vice Captain gets :{" "}
                    <strong className="text-foreground">1.5x</strong>
                  </span>
                </div>
              </div>
            </div>

            <div className="h-px md:h-8 w-full md:w-px bg-border"></div>

            {/* Selection Summary - Inline */}
            <div className="flex items-center gap-4 flex-1 flex-wrap">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <div>
                  <span className="text-xs text-muted-foreground mr-1">
                    Captain:
                  </span>
                  <span className="font-bold text-sm">
                    {captainId
                      ? players.find((p) => p.player_id === captainId)
                          ?.short_name
                      : "Not Selected"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-500" />
                <div>
                  <span className="text-xs text-muted-foreground mr-1">
                    Vice Captain:
                  </span>
                  <span className="font-bold text-sm">
                    {viceCaptainId
                      ? players.find((p) => p.player_id === viceCaptainId)
                          ?.short_name
                      : "Not Selected"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Player Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {players.map((player) => {
            const isCaptain = captainId === player.player_id;
            const isViceCaptain = viceCaptainId === player.player_id;

            return (
              <Card
                key={player.player_id}
                className={`p-4 bg-gradient-card transition-all duration-300 ${
                  isCaptain
                    ? "border-yellow-500 border-2 shadow-lg shadow-yellow-500/20 bg-gradient-to-br from-yellow-500/10 to-orange-500/5"
                    : isViceCaptain
                    ? "border-blue-500 border-2 shadow-lg shadow-blue-500/20 bg-gradient-to-br from-blue-500/10 to-purple-500/5"
                    : "border-border hover:shadow-lg hover:border-primary/30"
                }`}
              >
                {/* Player Info */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-bold text-base">{player.short_name}</p>
                      {isCaptain && (
                        <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 text-xs">
                          <Star className="h-3 w-3 mr-1 fill-white" />C
                        </Badge>
                      )}
                      {isViceCaptain && (
                        <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 text-xs">
                          <Shield className="h-3 w-3 mr-1" />
                          VC
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" className="text-xs">
                        {player.team_short_name}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {player.role}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Points</p>
                    <p className="text-lg font-bold">
                      {player.event_total_points}
                    </p>
                  </div>
                </div>

                {/* Selection Buttons */}
                <div className="flex gap-2">
                  <Button
                    variant={isCaptain ? "default" : "outline"}
                    size="sm"
                    className={`flex-1 transition-all ${
                      isCaptain
                        ? "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-md border-0"
                        : "hover:bg-yellow-500/10 hover:border-yellow-500/50"
                    }`}
                    onClick={() => handleSelectCaptain(player.player_id)}
                  >
                    <Trophy className="h-4 w-4 mr-1.5" />
                    {isCaptain ? "Captain" : "Make C"}
                  </Button>
                  <Button
                    variant={isViceCaptain ? "default" : "outline"}
                    size="sm"
                    className={`flex-1 transition-all ${
                      isViceCaptain
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-md border-0"
                        : "hover:bg-blue-500/10 hover:border-blue-500/50"
                    }`}
                    onClick={() => handleSelectViceCaptain(player.player_id)}
                  >
                    <Shield className="h-4 w-4 mr-1.5" />
                    {isViceCaptain ? "Vice Captain" : "Make VC"}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border shadow-xl">
        <div className="container mx-auto">
          <Button
            onClick={handleSaveTeam}
            disabled={!captainId || !viceCaptainId}
            className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed h-12 text-base"
          >
            {captainId && viceCaptainId
              ? "Save Team"
              : "Select Captain & Vice Captain to Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PickCaptain;
