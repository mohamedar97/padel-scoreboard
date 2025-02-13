"use client";

import type { Tournament } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Plus, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";

interface TournamentListProps {
  tournaments: Tournament[];
}

export default function TournamentList({ tournaments }: TournamentListProps) {
  const [showAllTournaments, setShowAllTournaments] = useState(false);

  // Get the latest tournament
  const latestTournament = tournaments[0];
  const olderTournaments = tournaments.slice(1);

  const displayedTournaments = showAllTournaments
    ? tournaments
    : latestTournament
      ? [latestTournament]
      : [];

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-end">
        <Link href="/tournaments/create">
          <Button
            variant="outline"
            className="border-black hover:bg-black hover:text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Tournament
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {displayedTournaments.map((tournament) => (
          <Link href={`/tournaments/${tournament.id}`} key={tournament.id}>
            <Card className="group relative overflow-hidden border border-black/10 transition-all hover:border-black hover:shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl font-bold tracking-tight">
                    {tournament.name}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {tournament === latestTournament && (
                      <Badge className="bg-green-500 hover:bg-green-600">
                        Live
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="mr-2 h-4 w-4" />
                    <time
                      dateTime={new Date(tournament.createdAt).toISOString()}
                    >
                      {new Date(tournament.createdAt).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </time>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="mr-2 h-4 w-4" />
                    {tournament.location}
                  </div>
                  <Badge variant="secondary" className="w-fit">
                    Level: {tournament.level}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {tournaments.length === 0 ? (
        <p className="text-center text-gray-500">No tournaments found.</p>
      ) : (
        olderTournaments.length > 0 &&
        !showAllTournaments && (
          <div className="flex justify-center">
            <Button
              variant="outline"
              className="border-black hover:bg-black hover:text-white"
              onClick={() => setShowAllTournaments(true)}
            >
              <ChevronDown className="mr-2 h-4 w-4" />
              Show Previous Tournaments
            </Button>
          </div>
        )
      )}
    </div>
  );
}
