"use server";

import { z } from "zod";
import { db } from "@/server/db";
import { teams } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Define the input validation schema
const updateTeamNameSchema = z.object({
  teamId: z.number(),
  player1Name: z.string().min(1, "Player 1 name is required"),
  player2Name: z.string().min(1, "Player 2 name is required"),
});

export type UpdateTeamNameInput = z.infer<typeof updateTeamNameSchema>;

export async function updateTeamName(input: UpdateTeamNameInput) {
  try {
    // Validate the input
    const validatedData = updateTeamNameSchema.parse(input);

    // Update the team names
    const [updatedTeam] = await db
      .update(teams)
      .set({
        player1Name: validatedData.player1Name,
        player2Name: validatedData.player2Name,
      })
      .where(eq(teams.id, validatedData.teamId))
      .returning();

    if (!updatedTeam) {
      return {
        success: false,
        error: "Team not found",
      };
    }

    // Get tournament ID to revalidate the page
    const [team] = await db
      .select({
        tournamentId: teams.tournamentId,
      })
      .from(teams)
      .where(eq(teams.id, validatedData.teamId))
      .limit(1);

    if (team) {
      revalidatePath(`/tournaments/${team.tournamentId}`);
    }

    return { success: true, data: updatedTeam };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error:
          "Invalid input: " + error.errors.map((e) => e.message).join(", "),
      };
    }

    console.error("Failed to update team names:", error);
    return {
      success: false,
      error: "Failed to update team names. Please try again.",
    };
  }
}
