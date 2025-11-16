import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { MatchCard } from "@/components/matches/MatchCard";
import { Match } from "@/types/fantasy";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  Trophy,
  Users,
  Search,
  TrendingUp,
  Clock,
  Zap,
  Target,
  Award,
  Sparkles,
  ArrowRight,
  Star,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMatches } from "@/services/hooks/useMatches";
import { useEffect, useState } from "react";

const UpcomingMatches = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: matches, isLoading: loading, error } = useMatches();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [eventFilter, setEventFilter] = useState<string>("All");

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load matches",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const filteredMatches = matches
    ? matches
        .filter(
          (m) =>
            m.match_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.event_name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter(
          (m) => statusFilter === "All" || m.match_status === statusFilter
        )
        .filter((m) => eventFilter === "All" || m.event_name === eventFilter)
    : [];

  const handleMatchClick = (match: Match) => {
    navigate(`/pick-players/${match.id}`, { state: { match } });
  };

  // Stats for hero section
  const totalMatches = matches?.length || 0;
  const liveMatches =
    matches?.filter((m) => m.match_status === "Live")?.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <Header title="Upcoming Matches" />

      {/* Enhanced Hero Section */}
      <div className="relative bg-gradient-to-br from-primary via-primary/95 to-primary/80 text-primary-foreground overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full">
            <div className="absolute top-20 left-20 w-2 h-2 bg-white/40 rounded-full animate-ping"></div>
            <div className="absolute top-40 right-32 w-2 h-2 bg-white/40 rounded-full animate-ping delay-500"></div>
            <div className="absolute bottom-32 left-1/3 w-2 h-2 bg-white/40 rounded-full animate-ping delay-1000"></div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 lg:py-20 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Top Badge */}
            <div className="flex justify-center mb-6 animate-fade-in">
              <Badge
                variant="secondary"
                className="px-4 py-2 text-sm font-medium bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30 transition-all"
              >
                <Sparkles className="w-4 h-4 mr-2 inline" />
                India's #1 Fantasy Sports Platform
              </Badge>
            </div>

            {/* Main Headline */}
            <div className="text-center mb-8 animate-slide-up">
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold mb-4 leading-tight">
                Build Your
                <span className="block bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-300 bg-clip-text text-transparent animate-gradient">
                  Dream Team
                </span>
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl opacity-95 mb-8 max-w-3xl mx-auto font-light">
                Join millions of fans creating winning fantasy teams. Pick your
                players, compete with friends, and win real cash prizes every
                day.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
                  onClick={() =>
                    filteredMatches.length > 0 &&
                    handleMatchClick(filteredMatches[0])
                  }
                >
                  Start Playing Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20 font-semibold px-8 py-6 text-lg"
                  onClick={() => navigate("/")}
                >
                  View My Teams
                </Button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
              {/* Prize Pool */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all transform hover:scale-105 hover:shadow-xl">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-yellow-400/20 p-3 rounded-full mb-3">
                    <Trophy className="h-7 w-7 text-yellow-300" />
                  </div>
                  <p className="text-3xl md:text-4xl font-bold mb-1">₹10L+</p>
                  <p className="text-sm opacity-80 font-medium">Total Prizes</p>
                </div>
              </div>

              {/* Active Users */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all transform hover:scale-105 hover:shadow-xl">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-blue-400/20 p-3 rounded-full mb-3">
                    <Users className="h-7 w-7 text-blue-300" />
                  </div>
                  <p className="text-3xl md:text-4xl font-bold mb-1">50K+</p>
                  <p className="text-sm opacity-80 font-medium">
                    Active Players
                  </p>
                </div>
              </div>

              {/* Live Matches */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all transform hover:scale-105 hover:shadow-xl">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-green-400/20 p-3 rounded-full mb-3 relative">
                    <Zap className="h-7 w-7 text-green-300" />
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                  </div>
                  <p className="text-3xl md:text-4xl font-bold mb-1">
                    {liveMatches > 0 ? liveMatches : totalMatches}
                  </p>
                  <p className="text-sm opacity-80 font-medium">
                    {liveMatches > 0 ? "Live Now" : "Upcoming"}
                  </p>
                </div>
              </div>

              {/* Win Rate */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all transform hover:scale-105 hover:shadow-xl">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-purple-400/20 p-3 rounded-full mb-3">
                    <TrendingUp className="h-7 w-7 text-purple-300" />
                  </div>
                  <p className="text-3xl md:text-4xl font-bold mb-1">98%</p>
                  <p className="text-sm opacity-80 font-medium">Win Rate</p>
                </div>
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="grid md:grid-cols-3 gap-4 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-start gap-3">
                <div className="bg-white/10 p-2 rounded-lg mt-1">
                  <Target className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">AI-Powered Insights</h3>
                  <p className="text-sm opacity-80">
                    Smart team suggestions based on player performance
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-white/10 p-2 rounded-lg mt-1">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Real-Time Updates</h3>
                  <p className="text-sm opacity-80">
                    Live scores and instant team performance tracking
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-white/10 p-2 rounded-lg mt-1">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Instant Withdrawals</h3>
                  <p className="text-sm opacity-80">
                    Win and withdraw your prizes within minutes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Wave Decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
          >
            <path
              d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z"
              fill="currentColor"
              className="text-background"
            />
          </svg>
        </div>
      </div>

      {/* Matches Section */}
      <main className="container mx-auto px-4 py-8 -mt-8 relative z-20">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Section Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-2">
                  <Star className="h-6 w-6 text-primary fill-primary" />
                  Upcoming Matches
                </h2>
                <p className="text-muted-foreground">
                  {filteredMatches.length} matches available • Pick your
                  favorites
                </p>
              </div>
            </div>

            {/* Filters Section */}
            <div className="mb-6">
              <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search matches by name or event..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Filter Buttons - Single row on desktop, second row on mobile */}
                <div className="flex gap-4 items-center">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Statuses</SelectItem>
                      {[
                        ...new Set(matches?.map((m) => m.match_status) || []),
                      ].map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={eventFilter} onValueChange={setEventFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filter by event" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Events</SelectItem>
                      {[
                        ...new Set(matches?.map((m) => m.event_name) || []),
                      ].map((event) => (
                        <SelectItem key={event} value={event}>
                          {event}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Matches Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredMatches.map((match, index) => (
                <div
                  key={match.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <MatchCard
                    match={match}
                    onClick={() => handleMatchClick(match)}
                  />
                </div>
              ))}
            </div>

            {filteredMatches.length === 0 && (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg">
                  No matches found. Try adjusting your filters.
                </p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default UpcomingMatches;
