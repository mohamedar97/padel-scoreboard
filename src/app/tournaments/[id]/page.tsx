import TournamentDetails from "@/components/tournamentDetails";
import { getTournamentById } from "@/lib/actions/getTournamentById";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";

export default async function TournamentPageWrapper({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id) {
    return <div>No tournament ID provided</div>;
  }
  return (
    <div className="mx-auto max-w-7xl px-3 py-8">
      <Suspense
        fallback={
          <div className="flex min-h-[200px] items-center justify-center">
            <Spinner size="lg" />
          </div>
        }
      >
        <TournamentWrapper id={id} />
      </Suspense>
    </div>
  );
}

async function TournamentWrapper({ id }: { id: string }) {
  const tournamentData = await getTournamentById(id);
  if (!tournamentData.success || !tournamentData.data)
    return <div>Error: {tournamentData.error}</div>;

  return <TournamentDetails tournament={tournamentData.data} />;
}
