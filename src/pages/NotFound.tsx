import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-secondary/20 p-4">
      <div className="text-center max-w-md">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <img
              src="/fantasy-sports-logo.png"
              alt="Fantasy Sports"
              className="h-20 w-20 object-contain rounded-xl bg-white/10 p-3 backdrop-blur-sm ring-2 ring-primary/20"
            />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-background"></div>
          </div>
        </div>

        {/* 404 Display */}
        <div className="mb-6">
          <h1 className="text-8xl md:text-9xl font-extrabold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-2">
            404
          </h1>
          <div className="h-1 w-24 mx-auto bg-gradient-to-r from-primary to-accent rounded-full mb-4"></div>
        </div>

        {/* Message */}
        <h2 className="text-2xl md:text-3xl font-bold mb-3">Page Not Found</h2>
        <p className="text-muted-foreground mb-8 text-base">
          Oops! The page you're looking for doesn't exist. It might have been
          moved or deleted.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          <Button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 gap-2"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Button>
        </div>

        {/* Helpful Links */}
        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground mb-3">
            Need help? Try these:
          </p>
          <div className="flex flex-wrap gap-2 justify-center text-sm">
            <Button
              variant="link"
              size="sm"
              onClick={() => navigate("/")}
              className="text-primary"
            >
              Upcoming Matches
            </Button>
            <span className="text-muted-foreground">•</span>
            <Button
              variant="link"
              size="sm"
              onClick={() => navigate("/my-teams")}
              className="text-primary"
            >
              My Teams
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
