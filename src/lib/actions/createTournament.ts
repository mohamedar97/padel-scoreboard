"use server";

import { z } from "zod";
import { db } from "@/server/db";
import { tournaments } from "@/server/db/schema";
import { revalidatePath, revalidateTag } from "next/cache";

// Define the input validation schema
const createTournamentSchema = z.object({
  name: z.string().min(1, "Tournament name is required"),
  type: z.enum(["league", "groups"], {
    errorMap: () => ({
      message: "Tournament type must be either 'league' or 'groups'",
    }),
  }),
  level: z.string().min(1, "Tournament level is required"),
  location: z.string().min(1, "Tournament location is required"),
  numberOfGroups: z.number().min(2).max(10).optional(),
});

export type CreateTournamentInput = z.infer<typeof createTournamentSchema>;

export async function createTournament(input: CreateTournamentInput) {
  try {
    // Validate the input
    const validatedData = createTournamentSchema.parse(input);

    // Insert the tournament
    const [newTournament] = await db
      .insert(tournaments)
      .values({
        name: validatedData.name,
        type: validatedData.type,
        numberOfGroups: validatedData.numberOfGroups,
        level: validatedData.level,
        location: validatedData.location,
      })
      .returning();

    // Revalidate the tournaments page to show the new tournament
    revalidatePath("/");
    revalidateTag("tournaments");
    return { success: true, data: newTournament };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error:
          "Invalid input: " + error.errors.map((e) => e.message).join(", "),
      };
    }

    console.error("Failed to create tournament:", error);
    return {
      success: false,
      error: "Failed to create tournament. Please try again.",
    };
  }
}
