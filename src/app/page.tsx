import TournamentList from "@/components/TournamentList";
import { getTournaments } from "@/lib/actions/getTournaments";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";

export default async function TournamentsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Padel Tournaments</h1>
      </div>
      <Suspense
        fallback={
          <div className="flex min-h-[200px] items-center justify-center">
            <Spinner size="lg" />
          </div>
        }
      >
        <TournamentListWrapper />
      </Suspense>
    </div>
  );
}

async function TournamentListWrapper() {
  const tournamentData = await getTournaments();
  if (!tournamentData.success || !tournamentData.data)
    return <div>Error: {tournamentData.error}</div>;
  return <TournamentList tournaments={tournamentData.data} />;
}
