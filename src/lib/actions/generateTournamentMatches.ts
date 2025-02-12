"use server";

import { z } from "zod";
import { db } from "@/server/db";
import { matches } from "@/server/db/schema";
import { revalidatePath } from "next/cache";

// Define the team schema
const teamSchema = z.object({
  id: z.number(),
  player1Name: z.string(),
  player2Name: z.string(),
  group: z.string().optional(),
});

// Define the tournament schema
const tournamentSchema = z.object({
  id: z.string(),
  type: z.enum(["league", "groups"]),
  numberOfGroups: z.number().optional(),
});

// Define the input validation schema
const generateMatchesSchema = z.object({
  tournament: tournamentSchema,
  teams: z.array(teamSchema),
});

type GenerateMatchesInput = z.infer<typeof generateMatchesSchema>;
type Team = z.infer<typeof teamSchema>;

export async function generateTournamentMatches(input: GenerateMatchesInput) {
  try {
    // Validate the input
    const validatedData = generateMatchesSchema.parse(input);
    const { tournament, teams: tournamentTeams } = validatedData;

    if (tournamentTeams.length < 2) {
      return {
        success: false,
        error: "Not enough teams to generate matches",
      };
    }

    const matchesToCreate = [];

    if (tournament.type === "league") {
      // For league format, each team plays against every other team once
      for (let i = 0; i < tournamentTeams.length; i++) {
        const team1 = tournamentTeams[i];
        if (!team1?.id) continue;

        for (let j = i + 1; j < tournamentTeams.length; j++) {
          const team2 = tournamentTeams[j];
          if (!team2?.id) continue;

          matchesToCreate.push({
            tournamentId: tournament.id,
            team1Id: team1.id,
            team2Id: team2.id,
            scoreTeam1: null,
            scoreTeam2: null,
            stage: "league",
          });
        }
      }
    } else if (tournament.type === "groups") {
      // For groups format, teams only play against others in their group
      const teamsByGroup = tournamentTeams.reduce(
        (acc, team) => {
          const group = team.group;
          if (!group) return acc;

          if (!acc[group]) {
            acc[group] = [];
          }
          acc[group].push(team);
          return acc;
        },
        {} as Record<string, Team[]>,
      );

      // Generate matches within each group
      Object.entries(teamsByGroup).forEach(([group, groupTeams]) => {
        for (let i = 0; i < groupTeams.length; i++) {
          const team1 = groupTeams[i];
          if (!team1?.id) continue;

          for (let j = i + 1; j < groupTeams.length; j++) {
            const team2 = groupTeams[j];
            if (!team2?.id) continue;

            matchesToCreate.push({
              tournamentId: tournament.id,
              team1Id: team1.id,
              team2Id: team2.id,
              scoreTeam1: null,
              scoreTeam2: null,
              stage: `group_stage`,
            });
          }
        }
      });
    }

    // Insert all matches
    const createdMatches = await db
      .insert(matches)
      .values(matchesToCreate)
      .returning();

    // Revalidate the tournament page
    revalidatePath(`/tournaments/${tournament.id}`);

    return { success: true, data: createdMatches };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error:
          "Invalid input: " + error.errors.map((e) => e.message).join(", "),
      };
    }

    console.error("Failed to generate matches:", error);
    return {
      success: false,
      error: "Failed to generate matches. Please try again.",
    };
  }
}
