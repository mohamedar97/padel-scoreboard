import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Trophy } from "lucide-react";
import type { TournamentWithTeamsAndMatches } from "@/lib/types";

interface TournamentHeaderProps {
  tournament: TournamentWithTeamsAndMatches;
}

export function TournamentHeader({ tournament }: TournamentHeaderProps) {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">{tournament.name}</h1>
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center text-gray-500">
          <Calendar className="mr-2 h-5 w-5" />
          <time dateTime={new Date(tournament.createdAt).toISOString()}>
            {new Date(tournament.createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>
        <div className="flex items-center text-gray-500">
          <MapPin className="mr-2 h-5 w-5" />
          {tournament.location}
        </div>
        <Badge variant="secondary" className="flex items-center gap-2">
          <Trophy className="h-4 w-4" />
          Level: {tournament.level}
        </Badge>
        <Badge variant="outline" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          {tournament.type === "groups"
            ? `Groups (${tournament.numberOfGroups})`
            : "League"}
        </Badge>
      </div>
    </div>
  );
}
