"use server";

import { db } from "@/server/db";
import { matches, teams, tournaments } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { sql } from "drizzle-orm";
import type { TournamentWithTeamsAndMatches } from "../types";

export async function getTournamentById(id: string) {
  try {
    const [tournament] = await db
      .select({
        id: tournaments.id,
        name: tournaments.name,
        type: tournaments.type,
        numberOfGroups: tournaments.numberOfGroups,
        level: tournaments.level,
        location: tournaments.location,
        createdAt: tournaments.createdAt,
        teams: sql<Array<{ id: number; name: string; group: string | null }>>`
          array_agg(distinct jsonb_build_object(
            'id', ${teams.id},
            'name', concat(${teams.player1Name}, '/', ${teams.player2Name}),
            'group', ${teams.group}
          )) filter (where ${teams.id} is not null)
        `,
        matches: sql<
          Array<{
            id: number;
            team1Id: number;
            team2Id: number;
            team1Name: string;
            team2Name: string;
            scoreTeam1: number | null;
            scoreTeam2: number | null;
            stage: string | null;
            matchDate: Date | null;
          }>
        >`
          array_agg(distinct jsonb_build_object(
            'id', ${matches.id},
            'team1Id', ${matches.team1Id},
            'team2Id', ${matches.team2Id},
            'team1Name', (
              SELECT concat(t.player1_name, '/', t.player2_name)
              FROM padel_team t
              WHERE t.id = ${matches.team1Id}
            ),
            'team2Name', (
              SELECT concat(t.player1_name, '/', t.player2_name)
              FROM padel_team t
              WHERE t.id = ${matches.team2Id}
            ),
            'scoreTeam1', ${matches.scoreTeam1},
            'scoreTeam2', ${matches.scoreTeam2},
            'stage', ${matches.stage},
            'matchDate', ${matches.matchDate}
          )) filter (where ${matches.id} is not null)
        `,
      })
      .from(tournaments)
      .leftJoin(teams, eq(teams.tournamentId, tournaments.id))
      .leftJoin(matches, eq(matches.tournamentId, tournaments.id))
      .where(eq(tournaments.id, id))
      .groupBy(tournaments.id)
      .limit(1);

    if (!tournament) {
      return {
        success: false,
        error: "Tournament not found",
      };
    }
    // Convert null arrays to empty arrays

    return { success: true, data: tournament as TournamentWithTeamsAndMatches };
  } catch (error) {
    console.error("Failed to fetch tournament:", error);
    return {
      success: false,
      error: "Failed to fetch tournament. Please try again.",
    };
  }
}
