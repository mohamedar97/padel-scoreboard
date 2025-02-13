import CreateTournamentForm from "@/components/tournamentCreation";
import { auth } from "@/server/authConfig";
import { redirect } from "next/navigation";

export default async function CreateTournamentPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }
  return <CreateTournamentForm />;
}
