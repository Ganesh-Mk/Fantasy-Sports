import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UpcomingMatches from "./pages/UpcomingMatches";
import MyTeams from "./pages/MyTeams";
import PickPlayers from "./pages/PickPlayers";
import PickCaptain from "./pages/PickCaptain";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UpcomingMatches />} />
          <Route path="/my-teams/:matchId" element={<MyTeams />} />
          <Route path="/pick-players/:matchId" element={<PickPlayers />} />
          <Route
            path="/pick-captain/:matchId/:teamId"
            element={<PickCaptain />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
