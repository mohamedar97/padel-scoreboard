import type { TournamentWithTeamsAndMatches } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ScoreboardProps {
  tournament: TournamentWithTeamsAndMatches;
}

interface TeamStats {
  id: number;
  name: string;
  group: string | null;
  points: number;
  matchesPlayed: number;
  setsWon: number;
  setsLost: number;
  setsDifference: number;
}

export function Scoreboard({ tournament }: ScoreboardProps) {
  // Calculate team statistics
  const teamStats: TeamStats[] = tournament.teams.map((team) => {
    const stats = {
      id: team.id,
      name: team.name,
      group: team.group,
      points: 0,
      matchesPlayed: 0,
      setsWon: 0,
      setsLost: 0,
      setsDifference: 0,
    };

    // Calculate statistics from matches
    (tournament.matches || []).forEach((match) => {
      // Skip matches that haven't been played yet
      if (match.scoreTeam1 === null || match.scoreTeam2 === null) return;

      if (match.team1Id === team.id || match.team2Id === team.id) {
        stats.matchesPlayed++;

        const isTeam1 = match.team1Id === team.id;
        const teamScore = isTeam1 ? match.scoreTeam1 : match.scoreTeam2;
        const opponentScore = isTeam1 ? match.scoreTeam2 : match.scoreTeam1;

        stats.setsWon += teamScore;
        stats.setsLost += opponentScore;

        // Award points (2 for win, 1 for draw, 0 for loss)
        if (teamScore > opponentScore) {
          stats.points += 3;
        } else if (teamScore === opponentScore) {
          stats.points += 1;
        }
      }
    });

    stats.setsDifference = stats.setsWon - stats.setsLost;
    return stats;
  });

  // Sort teams by points, then set difference
  const sortedStats = teamStats.sort((a, b) => {
    if (a.points !== b.points) return b.points - a.points;
    if (a.setsDifference !== b.setsDifference)
      return b.setsDifference - a.setsDifference;
    return b.setsWon - a.setsWon;
  });

  // Group teams by their group if it's a groups tournament
  const groupedStats =
    tournament.type === "groups"
      ? sortedStats.reduce(
          (acc, stat) => {
            const group = stat.group ?? "No Group";
            if (!acc[group]) acc[group] = [];
            acc[group].push(stat);
            return acc;
          },
          {} as Record<string, TeamStats[]>,
        )
      : { "League Standings": sortedStats };

  return (
    <div className="space-y-8">
      {Object.entries(groupedStats).map(([group, stats]) => (
        <Card key={group}>
          <CardHeader>
            <CardTitle>Group {group}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Position</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead className="text-right">MP</TableHead>
                  <TableHead className="text-right">Points</TableHead>
                  <TableHead className="text-right">+/-</TableHead>
                  <TableHead className="text-right">+</TableHead>
                  <TableHead className="text-right">-</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.map((stat, index) => (
                  <TableRow key={stat.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{stat.name}</TableCell>
                    <TableCell className="text-right">
                      {stat.matchesPlayed}
                    </TableCell>
                    <TableCell className="text-right">{stat.points}</TableCell>
                    <TableCell className="text-right">
                      {stat.setsDifference}
                    </TableCell>
                    <TableCell className="text-right">{stat.setsWon}</TableCell>
                    <TableCell className="text-right">
                      {stat.setsLost}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
