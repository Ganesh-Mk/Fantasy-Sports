import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { MatchCard } from "@/components/MatchCard";
import { Match } from "@/types/fantasy";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Trophy, Users, Search } from "lucide-react";
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
    navigate(`/my-teams/${match.id}`, { state: { match } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <Header title="Upcoming Matches" />

      {/* Hero Section */}
      <div className="bg-gradient-hero text-primary-foreground py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-3xl lg:text-5xl font-bold mb-4">
              Create Your Dream Sports Team
            </h1>
            <p className="text-lg lg:text-xl opacity-90 mb-6">
              Win big prizes by creating the best fantasy sports teams
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-center">
              <div className="flex flex-col items-center">
                <Trophy className="h-8 w-8 mb-2" />
                <p className="text-2xl font-bold">₹10L+</p>
                <p className="text-sm opacity-80">Total Prizes</p>
              </div>
              <div className="flex flex-col items-center">
                <Users className="h-8 w-8 mb-2" />
                <p className="text-2xl font-bold">50K+</p>
                <p className="text-sm opacity-80">Active Users</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-6">Matches</h2>
            <div className="mb-6 space-y-4">
              <div className="flex gap-4 items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search matches by name or event..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
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
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by event" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Events</SelectItem>
                    {[...new Set(matches?.map((m) => m.event_name) || [])].map(
                      (event) => (
                        <SelectItem key={event} value={event}>
                          {event}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
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
          </>
        )}
      </main>
    </div>
  );
};

export default UpcomingMatches;
