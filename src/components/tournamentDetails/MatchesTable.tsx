"use client";

import { TournamentWithTeamsAndMatches } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { updateMatchScore } from "@/lib/actions/updateMatchScore";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { Calculator } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface MatchesTableProps {
  tournament: TournamentWithTeamsAndMatches;
}

export function MatchesTable({ tournament }: MatchesTableProps) {
  const { data: session } = useSession();
  const [editingMatch, setEditingMatch] = useState<{
    id: number;
    team1Name: string;
    team2Name: string;
    scoreTeam1: string;
    scoreTeam2: string;
  } | null>(null);

  const matchesByStage = (tournament.matches || []).reduce<
    Record<string, typeof tournament.matches>
  >((acc, match) => {
    const stage = match.stage || "Group Stage";
    if (!acc[stage]) {
      acc[stage] = [];
    }
    acc[stage].push(match);
    return acc;
  }, {});

  const handleScoreSubmit = async () => {
    if (!editingMatch) return;

    const scoreTeam1 = parseInt(editingMatch.scoreTeam1);
    const scoreTeam2 = parseInt(editingMatch.scoreTeam2);

    if (
      isNaN(scoreTeam1) ||
      isNaN(scoreTeam2) ||
      scoreTeam1 > 6 ||
      scoreTeam2 > 6
    ) {
      toast.error("Please enter valid scores");
      return;
    }

    const result = await updateMatchScore({
      matchId: editingMatch.id,
      scoreTeam1,
      scoreTeam2,
    });

    if (result.success) {
      toast.success("Score updated successfully");
      setEditingMatch(null);
    } else {
      toast.error(result.error || "Failed to update score");
    }
  };

  const startEditing = (match: (typeof tournament.matches)[0]) => {
    setEditingMatch({
      id: match.id,
      team1Name: match.team1Name || "",
      team2Name: match.team2Name || "",
      scoreTeam1: match.scoreTeam1?.toString() || "",
      scoreTeam2: match.scoreTeam2?.toString() || "",
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Matches Schedule</CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <div className="space-y-6">
            {Object.entries(matchesByStage).map(([stage, matches]) => (
              <div key={stage} className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {true && (
                        <TableHead className="w-[100px]">Actions</TableHead>
                      )}
                      <TableHead>Team 1</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Team 2</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {matches.map((match) => (
                      <TableRow key={match.id}>
                        {true && (
                          <TableCell>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => startEditing(match)}
                            >
                              <Calculator className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        )}
                        <TableCell className="text-xs font-medium lg:text-base">
                          {match.team1Name}
                        </TableCell>
                        <TableCell className="text-center lg:text-start">
                          <span className="text-xs font-semibold lg:text-base">
                            {match.scoreTeam1 !== null
                              ? `${match.scoreTeam1} - ${match.scoreTeam2}`
                              : "-"}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs font-medium lg:text-base">
                          {match.team2Name}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!editingMatch} onOpenChange={() => setEditingMatch(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Match Score</DialogTitle>
          </DialogHeader>
          {editingMatch && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-3 items-center gap-4">
                <div className="text-right font-medium">
                  {editingMatch.team1Name}
                </div>
                <Input
                  type="number"
                  value={editingMatch.scoreTeam1}
                  onChange={(e) =>
                    setEditingMatch({
                      ...editingMatch,
                      scoreTeam1: e.target.value,
                    })
                  }
                  className="col-span-1 text-center"
                  min={0}
                  max={6}
                />
                <div />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <div className="text-right font-medium">
                  {editingMatch.team2Name}
                </div>
                <Input
                  type="number"
                  value={editingMatch.scoreTeam2}
                  onChange={(e) =>
                    setEditingMatch({
                      ...editingMatch,
                      scoreTeam2: e.target.value,
                    })
                  }
                  className="col-span-1 text-center"
                  min={0}
                  max={6}
                />
                <div />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              className="my-2"
              onClick={() => setEditingMatch(null)}
            >
              Cancel
            </Button>
            <Button className="my-2" onClick={handleScoreSubmit}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
