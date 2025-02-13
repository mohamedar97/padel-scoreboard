"use server";

import { z } from "zod";
import { db } from "@/server/db";
import { matches } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Define the input validation schema
const updateMatchScoreSchema = z.object({
  matchId: z.number(),
  scoreTeam1: z.number().min(0),
  scoreTeam2: z.number().min(0),
});

export type UpdateMatchScoreInput = z.infer<typeof updateMatchScoreSchema>;

export async function updateMatchScore(input: UpdateMatchScoreInput) {
  try {
    // Validate the input
    const validatedData = updateMatchScoreSchema.parse(input);

    // Update the match score
    const [updatedMatch] = await db
      .update(matches)
      .set({
        scoreTeam1: validatedData.scoreTeam1,
        scoreTeam2: validatedData.scoreTeam2,
      })
      .where(eq(matches.id, validatedData.matchId))
      .returning();

    if (!updatedMatch) {
      return {
        success: false,
        error: "Match not found",
      };
    }

    // Revalidate the tournament page
    // We need to get the tournament ID to revalidate the correct page
    const [match] = await db
      .select({
        tournamentId: matches.tournamentId,
      })
      .from(matches)
      .where(eq(matches.id, validatedData.matchId))
      .limit(1);

    if (match) {
      revalidatePath(`/tournaments/${match.tournamentId}`);
    }

    return { success: true, data: updatedMatch };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error:
          "Invalid input: " + error.errors.map((e) => e.message).join(", "),
      };
    }

    console.error("Failed to update match score:", error);
    return {
      success: false,
      error: "Failed to update match score. Please try again.",
    };
  }
}
