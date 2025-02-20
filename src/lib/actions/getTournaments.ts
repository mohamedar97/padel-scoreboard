"use server";

import { db } from "@/server/db";
import { tournaments } from "@/server/db/schema";
import { desc } from "drizzle-orm";
import type { Tournament } from "../types";
import { unstable_cache as cache } from "next/cache";

export const getTournaments = cache(
  async () => {
    try {
      // Fetch tournaments ordered by creation date (newest first)
      const allTournaments = await db
        .select()
        .from(tournaments)
        .orderBy(desc(tournaments.createdAt));

      return { success: true, data: allTournaments as Tournament[] };
    } catch (error) {
      console.error("Failed to fetch tournaments:", error);
      return {
        success: false,
        error: "Failed to fetch tournaments. Please try again.",
      };
    }
  },
  ["tournaments-list"],
  {
    revalidate: 60, // Cache for 1 minute
    tags: ["tournaments"],
  },
);
