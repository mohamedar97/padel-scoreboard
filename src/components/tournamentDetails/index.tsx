"use client";

import { TournamentWithTeamsAndMatches } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Trophy, LineChart } from "lucide-react";
import { TournamentHeader } from "./TournamentHeader";
import { TeamsTable } from "./TeamsTable";
import { MatchesTable } from "./MatchesTable";
import { Scoreboard } from "./Scoreboard";

interface TournamentPageProps {
  tournament: TournamentWithTeamsAndMatches;
}

export default function TournamentDetails({ tournament }: TournamentPageProps) {
  return (
    <div className="space-y-8">
      <TournamentHeader tournament={tournament} />

      <Tabs defaultValue="scoreboard" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="scoreboard" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            Scoreboard
          </TabsTrigger>
          <TabsTrigger value="teams" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Teams
          </TabsTrigger>
          <TabsTrigger value="matches" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Matches
          </TabsTrigger>
        </TabsList>

        <TabsContent value="teams">
          <TeamsTable tournament={tournament} />
        </TabsContent>

        <TabsContent value="matches">
          <MatchesTable tournament={tournament} />
        </TabsContent>

        <TabsContent value="scoreboard">
          <Scoreboard tournament={tournament} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
