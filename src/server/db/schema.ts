import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTableCreator,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `padel_${name}`);

export const tournaments = createTable(
  "tournament",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    name: varchar("name", { length: 255 }).notNull(),
    type: varchar("type", { length: 50 })
      .$type<"league" | "groups">()
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (tournament) => ({
    nameIndex: index("tournament_name_idx").on(tournament.name),
    typeIndex: index("tournament_type_idx").on(tournament.type),
  }),
);

export const teams = createTable(
  "team",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    tournamentId: integer("tournament_id")
      .notNull()
      .references(() => tournaments.id),
    player1Name: varchar("player1_name", { length: 255 }).notNull(),
    player2Name: varchar("player2_name", { length: 255 }).notNull(),
    group: varchar("group", { length: 50 }), // optional, used only for groups tournaments
  },
  (team) => ({
    tournamentIdIdx: index("team_tournament_id_idx").on(team.tournamentId),
    groupIndex: index("team_group_idx").on(team.group),
  }),
);

export const matches = createTable(
  "match",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    tournamentId: integer("tournament_id")
      .notNull()
      .references(() => tournaments.id),
    team1Id: integer("team1_id")
      .notNull()
      .references(() => teams.id),
    team2Id: integer("team2_id")
      .notNull()
      .references(() => teams.id),
    scoreTeam1: integer("score_team1").notNull(),
    scoreTeam2: integer("score_team2").notNull(),
    stage: varchar("stage", { length: 50 }), // e.g., "league", "group", "semi-final", "final"
    matchDate: timestamp("match_date", { withTimezone: true }),
  },
  (match) => ({
    tournamentIdIdx: index("match_tournament_id_idx").on(match.tournamentId),
    team1IdIdx: index("match_team1_id_idx").on(match.team1Id),
    team2IdIdx: index("match_team2_id_idx").on(match.team2Id),
    stageIndex: index("match_stage_idx").on(match.stage),
    matchDateIdx: index("match_date_idx").on(match.matchDate),
  }),
);

export const tournamentsRelations = relations(tournaments, ({ many }) => ({
  teams: many(teams),
  matches: many(matches),
}));

export const teamsRelations = relations(teams, ({ one, many }) => ({
  tournament: one(tournaments, {
    fields: [teams.tournamentId],
    references: [tournaments.id],
  }),
  matchesAsTeam1: many(matches, { relationName: "Team1" }),
  matchesAsTeam2: many(matches, { relationName: "Team2" }),
}));

export const matchesRelations = relations(matches, ({ one }) => ({
  tournament: one(tournaments, {
    fields: [matches.tournamentId],
    references: [tournaments.id],
  }),
  team1: one(teams, {
    fields: [matches.team1Id],
    references: [teams.id],
    relationName: "Team1",
  }),
  team2: one(teams, {
    fields: [matches.team2Id],
    references: [teams.id],
    relationName: "Team2",
  }),
}));
