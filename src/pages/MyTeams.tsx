import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Team, Match } from "@/types/fantasy";
import { Contest } from "@/types/contest";
import { getTeamsByMatch } from "@/utils/teamStorage";
import { generateContests } from "@/services/api/contests";
import { Plus } from "lucide-react";
import { ContestCard } from "@/components/contests/ContestCard";
import { TeamCard } from "@/components/teams/TeamCard";
import { MatchHeader } from "@/components/matches/MatchHeader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Users, Trophy } from "lucide-react";

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

  const handleEditTeam = (team: Team) => {
    navigate(`/pick-players/${matchId}`, {
      state: { match, team, isEditing: true },
    });
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
        {/* Enhanced Match Header */}
        {match && (
          <MatchHeader
            match={match}
            teamsCount={teams.length}
            contestsCount={contests.length}
          />
        )}

        {/* Tabs */}
        <Tabs defaultValue="teams" className="w-full">
          <TabsList className="w-full grid grid-cols-2 mb-6 h-11 bg-muted/50">
            <TabsTrigger
              value="teams"
              className="data-[state=active]:bg-background font-medium"
            >
              <Users className="h-4 w-4 mr-2" />
              My Teams ({teams.length})
            </TabsTrigger>
            <TabsTrigger
              value="contests"
              className="data-[state=active]:bg-background font-medium"
            >
              <Trophy className="h-4 w-4 mr-2" />
              Contests ({contests.length})
            </TabsTrigger>
          </TabsList>

          {/* Teams Tab */}
          <TabsContent value="teams" className="space-y-4 animate-fade-in">
            {teams.length === 0 ? (
              <Card className="p-12 md:p-16 text-center bg-gradient-to-br from-card to-muted/20 border-dashed border-2">
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">
                    Create Your First Team
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Build your dream team and compete in exciting contests to
                    win big prizes
                  </p>
                  <Button
                    onClick={handleCreateTeam}
                    size="lg"
                    className="bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold shadow-lg"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Create Your Team
                  </Button>
                </div>
              </Card>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Your Teams</h2>
                  <p className="text-sm text-muted-foreground">
                    {teams.length} team{teams.length !== 1 ? "s" : ""} created
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
                  {teams.map((team) => (
                    <TeamCard
                      key={team.id}
                      team={team}
                      onView={handleViewTeam}
                      onEdit={handleEditTeam}
                    />
                  ))}
                </div>
              </>
            )}
          </TabsContent>

          {/* Contests Tab */}
          <TabsContent value="contests" className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Available Contests</h2>
              <Badge variant="secondary">{contests.length} contests</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {contests.map((contest) => (
                <ContestCard
                  key={contest.id}
                  contest={contest}
                  onJoin={() => handleJoinContest(contest)}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border shadow-xl">
        <div className="container mx-auto px-0">
          <Button
            onClick={handleCreateTeam}
            className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold shadow-lg h-12 text-base"
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
