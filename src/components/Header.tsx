import { ArrowLeft, Menu, User, Bell, Settings, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useState } from "react";

interface HeaderProps {
  title: string;
  showBack?: boolean;
}

export const Header = ({ title, showBack = false }: HeaderProps) => {
  const navigate = useNavigate();
  const [notificationCount] = useState(3); // You can make this dynamic

  return (
    <header className="bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-primary-foreground sticky top-0 z-50 shadow-lg backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4">
        {/* Main Header */}
        <div className="flex items-center justify-between py-3 md:py-4">
          {/* Left Section - Logo & Title */}
          <div className="flex items-center gap-3 md:gap-4 flex-1">
            {showBack && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="text-primary-foreground hover:bg-white/20 transition-all shrink-0"
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}

            {/* Logo */}
            <div
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigate("/")}
            >
              <div className="relative">
                <img
                  src="/fantasy-sports-logo.png"
                  alt="Fantasy Sports"
                  className="h-10 w-10 md:h-12 md:w-12 object-contain rounded-lg bg-white/10 p-1.5 backdrop-blur-sm ring-2 ring-white/20"
                />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-primary animate-pulse"></div>
              </div>

              {/* Brand Name - Hidden on small screens */}
              <div className="hidden md:block">
                <h1 className="text-xl lg:text-2xl font-bold tracking-tight">
                  Fantasy Sports
                </h1>
                <p className="text-xs opacity-75 -mt-0.5">Build. Play. Win.</p>
              </div>
            </div>

            {/* Page Title - Only show if not on home */}
            {title !== "Upcoming Matches" && (
              <div className="hidden lg:block ml-4 pl-4 border-l border-white/20">
                <h2 className="text-lg font-semibold">{title}</h2>
              </div>
            )}
          </div>

          {/* Right Section - Navigation & Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-2 mr-4">
              <Button
                variant="ghost"
                className="text-primary-foreground hover:bg-white/20 font-medium"
                onClick={() => navigate("/")}
              >
                Matches
              </Button>
              <Button
                variant="ghost"
                className="text-primary-foreground hover:bg-white/20 font-medium"
                onClick={() => navigate("/my-teams")}
              >
                My Teams
              </Button>
              <Button
                variant="ghost"
                className="text-primary-foreground hover:bg-white/20 font-medium flex items-center gap-1"
                onClick={() => navigate("/leaderboard")}
              >
                <Trophy className="h-4 w-4" />
                Leaderboard
              </Button>
            </nav>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="relative text-primary-foreground hover:bg-white/20 transition-all"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs animate-bounce"
                >
                  {notificationCount}
                </Badge>
              )}
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary-foreground hover:bg-white/20 transition-all"
                  aria-label="User menu"
                >
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div>
                    <p className="font-semibold">Guest User</p>
                    <p className="text-xs text-muted-foreground">
                      guest@fantasy.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/my-teams")}>
                  <Trophy className="mr-2 h-4 w-4" />
                  My Teams
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-primary-foreground hover:bg-white/20"
                  aria-label="Menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Navigation</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/")}>
                  Matches
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/my-teams")}>
                  My Teams
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/leaderboard")}>
                  <Trophy className="mr-2 h-4 w-4" />
                  Leaderboard
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Page Title */}
        {title !== "Upcoming Matches" && (
          <div className="lg:hidden pb-3 pt-1 border-t border-white/10">
            <h2 className="text-base font-semibold flex items-center gap-2">
              {title}
            </h2>
          </div>
        )}
      </div>
    </header>
  );
};
