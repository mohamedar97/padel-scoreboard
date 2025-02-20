"use client";

import type { TournamentWithTeamsAndMatches } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Trophy, LineChart } from "lucide-react";
import { TournamentHeader } from "./TournamentHeader";
import { TeamsTable } from "./TeamsTable";
import { MatchesTable } from "./MatchesTable";
import { Scoreboard } from "./Scoreboard";
import { useState } from "react";
import { toast } from "sonner";
import { updateMatchScore } from "@/lib/actions/updateMatchScore";
import { updateTeamName } from "@/lib/actions/updateTeamName";

interface TournamentPageProps {
  tournament: TournamentWithTeamsAndMatches;
}

export default function TournamentDetails({
  tournament: initialTournament,
}: TournamentPageProps) {
  const [tournament, setTournament] = useState(initialTournament);

  const handleTeamUpdate = async (
    teamId: number,
    player1Name: string,
    player2Name: string,
  ) => {
    // Store the previous state for rollback
    const previousTournament = tournament;

    // Optimistically update the UI
    setTournament((prev) => ({
      ...prev,
      teams: prev.teams.map((team) =>
        team.id === teamId
          ? { ...team, name: `${player1Name}/${player2Name}` }
          : team,
      ),
      matches: prev.matches.map((match) => ({
        ...match,
        team1Name:
          match.team1Id === teamId
            ? `${player1Name}/${player2Name}`
            : match.team1Name,
        team2Name:
          match.team2Id === teamId
            ? `${player1Name}/${player2Name}`
            : match.team2Name,
      })),
    }));

    // Attempt the server update
    const result = await updateTeamName({
      teamId,
      player1Name,
      player2Name,
    });

    if (!result.success) {
      // Revert to previous state if the update failed
      setTournament(previousTournament);
      toast.error(result.error ?? "Failed to update team name");
      return false;
    }

    toast.success("Team updated successfully");
    return true;
  };

  const handleMatchUpdate = async (
    matchId: number,
    scoreTeam1: number,
    scoreTeam2: number,
  ) => {
    // Store the previous state for rollback
    const previousTournament = tournament;

    // Optimistically update the UI
    setTournament((prev) => ({
      ...prev,
      matches: prev.matches.map((match) =>
        match.id === matchId ? { ...match, scoreTeam1, scoreTeam2 } : match,
      ),
    }));

    // Attempt the server update
    const result = await updateMatchScore({
      matchId,
      scoreTeam1,
      scoreTeam2,
    });

    if (!result.success) {
      // Revert to previous state if the update failed
      setTournament(previousTournament);
      toast.error(result.error ?? "Failed to update score");
      return false;
    }

    return true;
  };

  return (
    <div className="space-y-8">
      <TournamentHeader tournament={tournament} />

      <Tabs defaultValue="scoreboard" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="scoreboard" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            Scoreboard
          </TabsTrigger>

          <TabsTrigger value="matches" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Matches
          </TabsTrigger>
          <TabsTrigger value="teams" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Teams
          </TabsTrigger>
        </TabsList>

        <TabsContent value="teams">
          <TeamsTable tournament={tournament} onTeamUpdate={handleTeamUpdate} />
        </TabsContent>

        <TabsContent value="matches">
          <MatchesTable
            tournament={tournament}
            onMatchUpdate={handleMatchUpdate}
          />
        </TabsContent>

        <TabsContent value="scoreboard">
          <Scoreboard tournament={tournament} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
