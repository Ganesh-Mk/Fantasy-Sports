import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SelectedPlayer, ROLE_LIMITS } from "@/types/fantasy";
import { getRoleCount } from "@/utils/teamValidation";
import { PlayerCard } from "./PlayerCard";
import { Player } from "@/types/fantasy";

interface RoleTabsProps {
  activeRole: string;
  onRoleChange: (role: string) => void;
  selectedPlayers: SelectedPlayer[];
  filteredPlayers: Player[];
  isPlayerSelected: (playerId: string) => boolean;
  onPlayerToggle: (player: Player) => void;
  onPlayerInfo: (player: Player, e: React.MouseEvent) => void;
}

export const RoleTabs = ({
  activeRole,
  onRoleChange,
  selectedPlayers,
  filteredPlayers,
  isPlayerSelected,
  onPlayerToggle,
  onPlayerInfo,
}: RoleTabsProps) => {
  const roles = ["All", "Wicket-Keeper", "Batsman", "All-Rounder", "Bowler"];

  return (
    <Tabs value={activeRole} onValueChange={onRoleChange}>
      {/* Desktop Tabs - Grid Layout */}
      <TabsList className="hidden md:grid w-full grid-cols-5 mb-6 h-12 bg-muted/50">
        {roles.map((role) => {
          const count =
            role === "All"
              ? selectedPlayers.length
              : getRoleCount(selectedPlayers, role);
          const limits =
            role !== "All"
              ? ROLE_LIMITS[role as keyof typeof ROLE_LIMITS]
              : null;

          return (
            <TabsTrigger
              key={role}
              value={role}
              className="text-sm font-medium data-[state=active]:bg-background"
            >
              {role === "All" ? "All Players" : role}
              {limits && (
                <span className="ml-2 text-xs opacity-70">
                  ({count}/{limits.max})
                </span>
              )}
            </TabsTrigger>
          );
        })}
      </TabsList>

      {/* Mobile Tabs - Horizontal Scroll */}
      <div className="w-full md:hidden mb-4 pr-4 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 min-w-max pb-2">
          {roles.map((role) => {
            const count =
              role === "All"
                ? selectedPlayers.length
                : getRoleCount(selectedPlayers, role);
            const limits =
              role !== "All"
                ? ROLE_LIMITS[role as keyof typeof ROLE_LIMITS]
                : null;
            const isActive = activeRole === role;

            return (
              <button
                key={role}
                onClick={() => onRoleChange(role)}
                className={`
                  px-4 py-2.5 rounded-full font-medium text-sm
                  transition-all duration-200 whitespace-nowrap
                  ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }
                `}
              >
                <span>{role === "All" ? "All" : role.split("-")[0]}</span>
                {limits && (
                  <span className="ml-1.5 text-xs opacity-80">
                    {count}/{limits.max}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <TabsContent value={activeRole} className="mt-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
          {filteredPlayers.map((player) => (
            <PlayerCard
              key={player.player_id}
              player={player}
              isSelected={isPlayerSelected(player.player_id)}
              onToggle={onPlayerToggle}
              onInfoClick={onPlayerInfo}
            />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
};
