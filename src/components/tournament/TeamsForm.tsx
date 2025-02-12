import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Edit2 } from "lucide-react";
import { toast } from "sonner";

type Team = {
  player1Name: string;
  player2Name: string;
};

interface TeamsFormProps {
  currentTeam: Team;
  onUpdateTeam: (field: "player1Name" | "player2Name", value: string) => void;
  onAddTeam: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  teams: Team[];
  onRemoveTeam: (index: number) => void;
  onEditTeam: (index: number) => void;
}

export function TeamsForm({
  currentTeam,
  onUpdateTeam,
  onAddTeam,
  onSubmit,
  teams,
  onRemoveTeam,
  onEditTeam,
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

    onSubmit(e);
  };

  const handleAddTeam = () => {
    if (!currentTeam.player1Name.trim() || !currentTeam.player2Name.trim()) {
      toast.error("Please fill in both player names");
      return;
    }
    onAddTeam();
  };

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
          <Button
            type="button"
            variant="outline"
            onClick={handleAddTeam}
            className="w-full"
          >
            Add Another Team
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
                (team) => !team.player1Name || !team.player2Name,
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
