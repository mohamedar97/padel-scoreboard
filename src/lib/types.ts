export interface Tournament {
  id: string;
  name: string;
  type: "league" | "groups";
  numberOfGroups: number | undefined;
  level: string;
  location: string;
  createdAt: Date;
}

export interface Team {
  id: number;
  player1Name: string;
  player2Name: string;
  group: string | null;
}

export interface Match {
  id: number;
  team1Id: number;
  team2Id: number;
  scoreTeam1: number | null;
  scoreTeam2: number | null;
  stage: string | null;
  matchDate: Date | null;
}

export interface TournamentWithTeamsAndMatches extends Tournament {
  teams: {
    id: number;
    name: string; // Formatted as "player1Name/player2Name"
    group: string | null;
  }[];
  matches: {
    id: number;
    team1Id: number;
    team2Id: number;
    team1Name: string; // Formatted as "player1Name/player2Name"
    team2Name: string; // Formatted as "player1Name/player2Name"
    scoreTeam1: number | null;
    scoreTeam2: number | null;
    stage: string | null;
    matchDate: Date | null;
  }[];
}
