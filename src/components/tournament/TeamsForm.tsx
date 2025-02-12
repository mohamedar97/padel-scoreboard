import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Edit2 } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Team = {
  player1Name: string;
  player2Name: string;
  group?: string;
};

interface TeamsFormProps {
  currentTeam: Team;
  onUpdateTeam: (
    field: "player1Name" | "player2Name" | "group",
    value: string,
  ) => void;
  onAddTeam: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  teams: Team[];
  onRemoveTeam: (index: number) => void;
  onEditTeam: (index: number) => void;
  isGroupTournament?: boolean;
  numberOfGroups?: number;
  isEditing: boolean;
}

export function TeamsForm({
  currentTeam,
  onUpdateTeam,
  onAddTeam,
  onSubmit,
  teams,
  onRemoveTeam,
  onEditTeam,
  isGroupTournament,
  numberOfGroups,
  isEditing,
}: TeamsFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (teams.length === 0) {
      toast.error("Please add at least one team");
      return;
    }

    // Check if any team has empty player names
    const hasEmptyTeams = teams.some(
      (team) => !team.player1Name.trim() || !team.player2Name.trim(),
    );

    if (hasEmptyTeams) {
      toast.error("All teams must have both player names filled");
      return;
    }

    // Check if any team in a group tournament is missing a group
    if (isGroupTournament && teams.some((team) => !team.group)) {
      toast.error("All teams must be assigned to a group");
      return;
    }

    onSubmit(e);
  };

  const handleAddTeam = () => {
    if (!currentTeam.player1Name.trim() || !currentTeam.player2Name.trim()) {
      toast.error("Please fill in both player names");
      return;
    }
    if (isGroupTournament && !currentTeam.group) {
      toast.error("Please select a group for the team");
      return;
    }
    onAddTeam();
  };

  // Generate group options based on numberOfGroups
  const groupOptions = Array.from({ length: numberOfGroups || 0 }, (_, i) =>
    String.fromCharCode(65 + i),
  );

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Add Teams</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col gap-4 rounded-lg border p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Player 1
              </label>
              <Input
                value={currentTeam.player1Name}
                onChange={(e) => onUpdateTeam("player1Name", e.target.value)}
                placeholder="Enter player 1 name"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Player 2
              </label>
              <Input
                value={currentTeam.player2Name}
                onChange={(e) => onUpdateTeam("player2Name", e.target.value)}
                placeholder="Enter player 2 name"
                className="w-full"
              />
            </div>
          </div>
          {isGroupTournament && (
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Group
              </label>
              <Select
                value={currentTeam.group}
                onValueChange={(value) => onUpdateTeam("group", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select group" />
                </SelectTrigger>
                <SelectContent>
                  {groupOptions.map((group) => (
                    <SelectItem key={group} value={group}>
                      Group {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={handleAddTeam}
            className="w-full"
          >
            {isEditing ? "Update Team" : "Add Team"}
          </Button>
        </div>

        {teams.length > 0 && (
          <div className="rounded-lg border p-4">
            <h2 className="mb-4 text-lg font-semibold">Teams List</h2>
            <div className="max-h-[200px] space-y-3 overflow-y-auto lg:max-h-[500px]">
              {teams.map((team, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="font-medium">
                      {team.player1Name} & {team.player2Name}
                      {isGroupTournament && team.group && (
                        <span className="ml-2 text-sm text-muted-foreground">
                          (Group {team.group})
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditTeam(index)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveTeam(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full"
              disabled={teams.some(
                (team) =>
                  !team.player1Name ||
                  !team.player2Name ||
                  (isGroupTournament && !team.group),
              )}
            >
              Create Tournament
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
