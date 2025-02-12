"use server";

import { z } from "zod";
import { db } from "@/server/db";
import { teams } from "@/server/db/schema";
import { revalidatePath } from "next/cache";

// Define the input validation schema
const addTeamsSchema = z.object({
  tournamentId: z.number(),
  teams: z.array(
    z.object({
      player1Name: z.string().min(1, "Player 1 name is required"),
      player2Name: z.string().min(1, "Player 2 name is required"),
    }),
  ),
});

export type AddTeamsInput = z.infer<typeof addTeamsSchema>;

export async function addTeamsToTournament(input: AddTeamsInput) {
  try {
    // Validate the input
    const validatedData = addTeamsSchema.parse(input);

    // Insert all teams
    const newTeams = await db
      .insert(teams)
      .values(
        validatedData.teams.map((team) => ({
          tournamentId: validatedData.tournamentId,
          player1Name: team.player1Name,
          player2Name: team.player2Name,
        })),
      )
      .returning();

    // Revalidate the tournaments page
    revalidatePath("/tournaments");
    revalidatePath(`/tournaments/${validatedData.tournamentId}`);

    return { success: true, data: newTeams };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error:
          "Invalid input: " + error.errors.map((e) => e.message).join(", "),
      };
    }

    console.error("Failed to add teams:", error);
    return {
      success: false,
      error: "Failed to add teams. Please try again.",
    };
  }
}
