import { Tournament } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@/server/authConfig";

interface TournamentListProps {
  tournaments: Tournament[];
}

export default async function TournamentList({
  tournaments,
}: TournamentListProps) {
  const session = await auth();
  return (
    <div className="w-full space-y-6">
      {true && (
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
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tournaments.map((tournament) => (
          <Card
            key={tournament.id}
            className="group relative overflow-hidden border border-black/10 transition-all hover:border-black hover:shadow-lg"
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <CardTitle className="text-xl font-bold tracking-tight">
                  {tournament.name}
                </CardTitle>
                <Badge variant="outline" className="border-black">
                  {tournament.type}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="mr-2 h-4 w-4" />
                <time dateTime={new Date(tournament.createdAt).toISOString()}>
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
            </CardContent>
          </Card>
        ))}
      </div>

      {tournaments.length === 0 && (
        <p className="text-center text-gray-500">No tournaments found.</p>
      )}
    </div>
  );
}
