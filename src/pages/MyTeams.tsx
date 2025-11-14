import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Team, Match } from "@/types/fantasy";
import { Contest } from "@/types/contest";
import { getTeamsByMatch } from "@/utils/teamStorage";
import { generateContests } from "@/services/api/contests";
import { Users, Trophy, Shield, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ContestCard } from "@/components/ContestCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const MyTeams = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const match = location.state?.match as Match;
  const [teams, setTeams] = useState<Team[]>([]);
  const [contests, setContests] = useState<Contest[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (matchId) {
      const matchTeams = getTeamsByMatch(parseInt(matchId));
      setTeams(matchTeams);
      const matchContests = generateContests(parseInt(matchId));
      setContests(matchContests);
    }
  }, [matchId]);

  const handleCreateTeam = () => {
    navigate(`/pick-players/${matchId}`, { state: { match } });
  };

  const handleViewTeam = (team: Team) => {
    navigate(`/pick-captain/${matchId}/${team.id}`, { state: { match, team } });
  };

  const handleJoinContest = (contest: Contest) => {
    if (teams.length === 0) {
      toast({
        title: "Create a team first",
        description: "You need to create at least one team to join contests",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Contest joined!",
      description: `Successfully joined ${contest.name}`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 pb-24">
      <Header title="Match Center" showBack />

      <main className="container mx-auto px-4 py-6">
        {/* Match Header */}
        {match && (
          <Card className="p-6 mb-6 bg-gradient-primary text-primary-foreground shadow-elegant animate-fade-in">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={match.t1_image}
                  alt={match.t1_name}
                  className="w-14 h-14 lg:w-16 lg:h-16"
                />
                <div className="text-center lg:text-left">
                  <p className="font-bold text-lg lg:text-xl">
                    {match.t1_short_name} vs {match.t2_short_name}
                  </p>
                  <p className="text-sm opacity-90">{match.event_name}</p>
                </div>
              </div>
              <img
                src={match.t2_image}
                alt={match.t2_name}
                className="w-14 h-14 lg:w-16 lg:h-16"
              />
            </div>
          </Card>
        )}

        <Tabs defaultValue="contests" className="w-full">
          <TabsList className="w-full grid grid-cols-2 mb-6">
            <TabsTrigger value="contests">Contests</TabsTrigger>
            <TabsTrigger value="teams">My Teams ({teams.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="contests" className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {contests.map((contest) => (
                <ContestCard
                  key={contest.id}
                  contest={contest}
                  onJoin={() => handleJoinContest(contest)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="teams" className="space-y-4 animate-fade-in">
            {teams.length === 0 ? (
              <Card className="p-12 text-center bg-gradient-card">
                <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No teams yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first team to join contests
                </p>
                <Button
                  onClick={handleCreateTeam}
                  className="bg-gradient-primary text-primary-foreground"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Team
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {teams.map((team, index) => (
                  <Card
                    key={team.id}
                    className="p-5 cursor-pointer hover:shadow-elegant transition-all duration-300 bg-gradient-card group"
                    onClick={() => handleViewTeam(team)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">Team {index + 1}</Badge>
                      </div>
                      <Users className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Trophy className="h-4 w-4 text-accent" />
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Captain
                          </p>
                          <p className="font-semibold">
                            {team.players.find((p) => p.isCaptain)
                              ?.short_name || "None"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Vice Captain
                          </p>
                          <p className="font-semibold">
                            {team.players.find((p) => p.isViceCaptain)
                              ?.short_name || "None"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border">
        <div className="container mx-auto">
          <Button
            onClick={handleCreateTeam}
            className="w-full bg-gradient-accent hover:opacity-90 text-accent-foreground font-semibold shadow-glow"
            size="lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create New Team
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MyTeams;
