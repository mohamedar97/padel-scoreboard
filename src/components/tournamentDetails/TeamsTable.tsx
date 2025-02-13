import { TournamentWithTeamsAndMatches } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TeamsTableProps {
  tournament: TournamentWithTeamsAndMatches;
}

export function TeamsTable({ tournament }: TeamsTableProps) {
  const sortedTeams = [...(tournament.teams || [])].sort((a, b) => {
    if (!a.group && !b.group) return 0;
    if (!a.group) return 1;
    if (!b.group) return -1;
    return a.group.localeCompare(b.group);
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Teams List</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Team</TableHead>
              {tournament.type === "groups" && <TableHead>Group</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTeams.map((team) => (
              <TableRow key={team.id}>
                <TableCell className="font-medium">{team.name}</TableCell>
                {tournament.type === "groups" && (
                  <TableCell>
                    {team.group && (
                      <Badge variant="secondary">Group {team.group}</Badge>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
