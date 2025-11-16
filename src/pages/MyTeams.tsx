import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Team, Match } from "@/types/fantasy";
import { Contest } from "@/types/contest";
import { getTeamsByMatch } from "@/utils/teamStorage";
import { generateContests } from "@/services/api/contests";
import {
  Users,
  Trophy,
  Shield,
  Plus,
  Calendar,
  MapPin,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ContestCard } from "@/components/ContestCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

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
          <Card className="overflow-hidden mb-6 shadow-xl border-border/50 animate-fade-in">
            <div className="bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-primary-foreground p-5">
              <div className="flex items-center justify-between gap-4 mb-4">
                {/* Team 1 */}
                <div className="flex flex-col items-center flex-1">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/10 p-3 mb-2">
                    <img
                      src={match.t1_image}
                      alt={match.t1_name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="font-bold text-sm md:text-base">
                    {match.t1_short_name}
                  </p>
                </div>

                {/* VS Divider */}
                <div className="flex flex-col items-center px-4">
                  <div className="text-2xl md:text-3xl font-extrabold mb-1">
                    VS
                  </div>
                  <div className="h-px w-16 bg-white/30"></div>
                </div>

                {/* Team 2 */}
                <div className="flex flex-col items-center flex-1">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/10 p-3 mb-2">
                    <img
                      src={match.t2_image}
                      alt={match.t2_name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="font-bold text-sm md:text-base">
                    {match.t2_short_name}
                  </p>
                </div>
              </div>

              {/* Match Details */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-2 pt-3 border-t border-white/20">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 opacity-75" />
                  <span className="opacity-90">{match.event_name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 opacity-75" />
                  <span className="opacity-90">
                    {format(
                      new Date(match.match_date),
                      "MMM dd, yyyy • hh:mm a"
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Stats Bar */}
            <div className="bg-muted/30 px-5 py-3 flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-muted-foreground">Your Teams:</span>
                  <span className="ml-2 font-bold">{teams.length}</span>
                </div>
                <div className="h-4 w-px bg-border"></div>
                <div>
                  <span className="text-muted-foreground">Contests:</span>
                  <span className="ml-2 font-bold">{contests.length}</span>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs">
                {match.match_status}
              </Badge>
            </div>
          </Card>
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {teams.map((team, index) => {
                    const captain = team.players.find((p) => p.isCaptain);
                    const viceCaptain = team.players.find(
                      (p) => p.isViceCaptain
                    );
                    const totalCredits = team.players.reduce(
                      (sum, p) => sum + p.event_player_credit,
                      0
                    );

                    return (
                      <Card
                        key={team.id}
                        className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-gradient-card group border-border/50 hover:border-primary/30"
                      >
                        {/* Team Header */}
                        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-4 border-b border-border/30">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge className="bg-primary text-primary-foreground">
                                Team {index + 1}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                11 Players
                              </Badge>
                            </div>
                            <Users className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Created{" "}
                            {format(
                              new Date(team.createdAt),
                              "MMM dd, hh:mm a"
                            )}
                          </p>
                        </div>

                        {/* Team Details */}
                        <div className="p-4">
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            {/* Captain */}
                            <div className="flex items-start gap-2">
                              <div className="p-2 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg">
                                <Trophy className="h-4 w-4 text-yellow-500" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-muted-foreground mb-0.5">
                                  Captain
                                </p>
                                <p className="font-bold text-sm truncate">
                                  {captain?.short_name || "Not selected"}
                                </p>
                              </div>
                            </div>

                            {/* Vice Captain */}
                            <div className="flex items-start gap-2">
                              <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg">
                                <Shield className="h-4 w-4 text-blue-500" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-muted-foreground mb-0.5">
                                  Vice Captain
                                </p>
                                <p className="font-bold text-sm truncate">
                                  {viceCaptain?.short_name || "Not selected"}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Credits Used */}
                          <div className="bg-muted/30 rounded-lg p-3 mb-4">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">
                                Credits Used
                              </span>
                              <span className="font-bold">
                                {totalCredits.toFixed(1)} / 100
                              </span>
                            </div>
                            <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-primary to-accent transition-all"
                                style={{ width: `${totalCredits}%` }}
                              ></div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => handleViewTeam(team)}
                            >
                              <Eye className="h-4 w-4 mr-1.5" />
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => handleEditTeam(team)}
                            >
                              <Edit className="h-4 w-4 mr-1.5" />
                              Edit
                            </Button>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
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
        <div className="container mx-auto">
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
