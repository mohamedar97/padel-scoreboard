"use client";

import type { TournamentWithTeamsAndMatches } from "@/lib/types";
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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface MatchesTableProps {
  tournament: TournamentWithTeamsAndMatches;
  onMatchUpdate: (
    matchId: number,
    scoreTeam1: number,
    scoreTeam2: number,
  ) => Promise<boolean>;
}

export function MatchesTable({ tournament, onMatchUpdate }: MatchesTableProps) {
  const { data: session } = useSession();
  const [showIncompleteOnly, setShowIncompleteOnly] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState<string>("all");
  const [editingMatch, setEditingMatch] = useState<{
    id: number;
    team1Name: string;
    team2Name: string;
    scoreTeam1: string;
    scoreTeam2: string;
  } | null>(null);

  // Get unique teams from matches
  const uniqueTeams = Array.from(
    new Set(
      tournament.matches?.flatMap((match) => [
        match.team1Name,
        match.team2Name,
      ]) || [],
    ),
  ).filter(Boolean);

  // Filter matches based on filters
  const filteredMatches = (tournament.matches || []).filter((match) => {
    if (showIncompleteOnly && match.scoreTeam1 !== null) return false;
    if (
      selectedTeam !== "all" &&
      match.team1Name !== selectedTeam &&
      match.team2Name !== selectedTeam
    )
      return false;
    return true;
  });

  const matchesByStage = filteredMatches.reduce<
    Record<string, typeof tournament.matches>
  >((acc, match) => {
    const stage = match.stage ?? "Group Stage";
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

    // Close dialog immediately
    setEditingMatch(null);

    // Update the score
    await onMatchUpdate(editingMatch.id, scoreTeam1, scoreTeam2);
  };

  const startEditing = (match: (typeof tournament.matches)[0]) => {
    setEditingMatch({
      id: match.id,
      team1Name: match.team1Name ?? "",
      team2Name: match.team2Name ?? "",
      scoreTeam1: match.scoreTeam1?.toString() ?? "",
      scoreTeam2: match.scoreTeam2?.toString() ?? "",
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Matches Schedule</CardTitle>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="incomplete-matches"
                checked={showIncompleteOnly}
                onCheckedChange={setShowIncompleteOnly}
              />
              <Label htmlFor="incomplete-matches">
                Show incomplete matches only
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by team" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All teams</SelectItem>
                  {uniqueTeams.map((team) => (
                    <SelectItem key={team} value={team}>
                      {team}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
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
              <div className="flex items-center justify-center gap-4">
                <div className="w-[200px] truncate text-start font-medium">
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
                  className="max-w-[100px] text-center"
                  min={0}
                  max={6}
                />
                <div />
              </div>
              <div className="flex items-center justify-center gap-4">
                <div className="w-[200px] truncate text-start font-medium">
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
                  className="col-span-1 max-w-[100px] text-center"
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
