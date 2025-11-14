import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SelectedPlayer, Match, Team } from "@/types/fantasy";
import { Badge } from "@/components/ui/badge";
import { Trophy, Shield } from "lucide-react";
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
  const [captainId, setCaptainId] = useState<number | null>(null);
  const [viceCaptainId, setViceCaptainId] = useState<number | null>(null);

  useEffect(() => {
    if (teamId === "new" && newPlayers) {
      setPlayers(newPlayers);
    } else if (teamId && teamId !== "new") {
      const team = getTeamById(teamId);
      if (team) {
        setPlayers(team.players);
        const captain = team.players.find(p => p.isCaptain);
        const viceCaptain = team.players.find(p => p.isViceCaptain);
        if (captain) setCaptainId(captain.id);
        if (viceCaptain) setViceCaptainId(viceCaptain.id);
      }
    }
  }, [teamId, newPlayers]);

  const handleSelectCaptain = (playerId: number) => {
    if (captainId === playerId) {
      setCaptainId(null);
    } else {
      setCaptainId(playerId);
      if (viceCaptainId === playerId) {
        setViceCaptainId(null);
      }
    }
  };

  const handleSelectViceCaptain = (playerId: number) => {
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

    const updatedPlayers = players.map(player => ({
      ...player,
      isCaptain: player.id === captainId,
      isViceCaptain: player.id === viceCaptainId,
    }));

    const team: Team = {
      id: teamId === "new" ? `team_${Date.now()}` : teamId!,
      matchId: parseInt(matchId!),
      name: `Team ${new Date().toLocaleString()}`,
      players: updatedPlayers,
      createdAt: new Date().toISOString(),
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

      <div className="sticky top-14 z-40 bg-gradient-primary text-primary-foreground p-4 shadow-elegant">
        <div className="container mx-auto">
          {match && (
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold">{match.t1_short_name} vs {match.t2_short_name}</p>
                <p className="text-xs opacity-90">{match.event_name}</p>
              </div>
              <div className="flex items-center gap-2">
                <img src={match.t1_image} alt={match.t1_name} className="w-8 h-8" />
                <img src={match.t2_image} alt={match.t2_name} className="w-8 h-8" />
              </div>
            </div>
          )}
        </div>
      </div>

      <main className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
          {players.map((player) => {
            const isCaptain = captainId === player.id;
            const isViceCaptain = viceCaptainId === player.id;

            return (
              <Card
                key={player.id}
                className={`p-4 bg-gradient-card transition-all ${
                  isCaptain || isViceCaptain ? "border-accent border-2 shadow-glow" : "hover:shadow-elegant"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex-1">
                      <p className="font-semibold">{player.short_name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {player.team_short_name}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {player.role}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant={isCaptain ? "default" : "outline"}
                    size="sm"
                    className={`flex-1 ${
                      isCaptain
                        ? "bg-gradient-accent text-accent-foreground"
                        : ""
                    }`}
                    onClick={() => handleSelectCaptain(player.id)}
                  >
                    <Trophy className="h-4 w-4 mr-1" />
                    {isCaptain ? "Captain" : "C"}
                  </Button>
                  <Button
                    variant={isViceCaptain ? "default" : "outline"}
                    size="sm"
                    className={`flex-1 ${
                      isViceCaptain
                        ? "bg-muted hover:bg-muted/90"
                        : ""
                    }`}
                    onClick={() => handleSelectViceCaptain(player.id)}
                  >
                    <Shield className="h-4 w-4 mr-1" />
                    {isViceCaptain ? "Vice Captain" : "VC"}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border">
        <div className="container mx-auto">
          <Button
            onClick={handleSaveTeam}
            disabled={!captainId || !viceCaptainId}
            className="w-full bg-gradient-accent hover:opacity-90 text-accent-foreground font-semibold shadow-glow"
            size="lg"
          >
            Save Team
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PickCaptain;
