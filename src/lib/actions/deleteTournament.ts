"use server";

import { z } from "zod";
import { db } from "@/server/db";
import { tournaments } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Define the input validation schema
const deleteTournamentSchema = z.object({
  tournamentId: z.string(),
});

export type DeleteTournamentInput = z.infer<typeof deleteTournamentSchema>;

export async function deleteTournament(input: DeleteTournamentInput) {
  try {
    // Validate the input
    const validatedData = deleteTournamentSchema.parse(input);

    // Delete the tournament
    const [deletedTournament] = await db
      .delete(tournaments)
      .where(eq(tournaments.id, validatedData.tournamentId))
      .returning();

    if (!deletedTournament) {
      return {
        success: false,
        error: "Tournament not found",
      };
    }

    // Revalidate the tournaments page and redirect to home
    revalidatePath("/");
    revalidatePath("/tournaments");

    return { success: true, data: deletedTournament };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error:
          "Invalid input: " + error.errors.map((e) => e.message).join(", "),
      };
    }

    console.error("Failed to delete tournament:", error);
    return {
      success: false,
      error: "Failed to delete tournament. Please try again.",
    };
  }
}
