import type { TournamentWithTeamsAndMatches } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useSession } from "next-auth/react";

interface TeamsTableProps {
  tournament: TournamentWithTeamsAndMatches;
  onTeamUpdate: (
    teamId: number,
    player1Name: string,
    player2Name: string,
  ) => Promise<boolean>;
}

export function TeamsTable({ tournament, onTeamUpdate }: TeamsTableProps) {
  const [selectedTeam, setSelectedTeam] = useState<{
    id: number;
    player1Name: string;
    player2Name: string;
  } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { data: session } = useSession();

  const handleEditClick = (team: { id: number; name: string }) => {
    const [player1Name = "", player2Name = ""] = team.name.split("/");
    setSelectedTeam({
      id: team.id,
      player1Name,
      player2Name,
    });
    setIsDialogOpen(true);
  };

  const handleUpdateTeam = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedTeam) return;

    setIsUpdating(true);
    const formData = new FormData(e.currentTarget);
    const player1Name = formData.get("player1Name") as string;
    const player2Name = formData.get("player2Name") as string;

    // Close dialog immediately for better UX
    setIsDialogOpen(false);

    await onTeamUpdate(selectedTeam.id, player1Name, player2Name);

    setIsUpdating(false);
  };

  const sortedTeams = [...(tournament.teams || [])].sort((a, b) => {
    if (!a.group && !b.group) return 0;
    if (!a.group) return 1;
    if (!b.group) return -1;
    return a.group.localeCompare(b.group);
  });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Teams List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Team</TableHead>
                {tournament.type === "groups" && <TableHead>Group</TableHead>}
                {session && (
                  <TableHead className="w-[100px]">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTeams.map((team) => (
                <TableRow key={team.id}>
                  <TableCell className="font-medium">{team.name}</TableCell>
                  {tournament.type === "groups" && (
                    <TableCell>
                      {team.group && (
                        <Badge variant="secondary">Group {team.group}</Badge>
                      )}
                    </TableCell>
                  )}
                  <TableCell>
                    {session && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClick(team)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Team</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateTeam} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="player1Name"
                className="text-sm font-medium leading-none"
              >
                Player 1 Name
              </label>
              <Input
                id="player1Name"
                name="player1Name"
                defaultValue={selectedTeam?.player1Name}
                required
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="player2Name"
                className="text-sm font-medium leading-none"
              >
                Player 2 Name
              </label>
              <Input
                id="player2Name"
                name="player2Name"
                defaultValue={selectedTeam?.player2Name}
                required
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? "Updating..." : "Update"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
