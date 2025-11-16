import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { SelectedPlayer, Match, Team } from "@/types/fantasy";
import { Trophy, Shield, Info } from "lucide-react";
import { saveTeam, getTeamById } from "@/utils/teamStorage";
import { useToast } from "@/hooks/use-toast";
import { SelectionSummary } from "@/components/captains/SelectionSummary";
import { CaptainCard } from "@/components/captains/CaptainCard";

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

      {/* Instructions */}
      <div className="container mx-auto px-4 py-4">
        {/* Compact Info & Selection Bar */}
        <SelectionSummary
          captainId={captainId}
          viceCaptainId={viceCaptainId}
          players={players}
        />

        {/* Player Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {players.map((player) => (
            <CaptainCard
              key={player.player_id}
              player={player}
              isCaptain={captainId === player.player_id}
              isViceCaptain={viceCaptainId === player.player_id}
              onSelectCaptain={handleSelectCaptain}
              onSelectViceCaptain={handleSelectViceCaptain}
            />
          ))}
        </div>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-3 left-0 right-0 px-4 ">
        <div className="container mx-auto px-0">
          <Button
            onClick={handleSaveTeam}
            disabled={!captainId || !viceCaptainId}
            className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed h-12 text-base"
          >
            {captainId && viceCaptainId
              ? "Save Team"
              : "Select C & VC to Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PickCaptain;
