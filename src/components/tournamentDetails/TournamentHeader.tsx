import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Trophy, Trash2 } from "lucide-react";
import type { TournamentWithTeamsAndMatches } from "@/lib/types";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { deleteTournament } from "@/lib/actions/deleteTournament";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface TournamentHeaderProps {
  tournament: TournamentWithTeamsAndMatches;
}

export function TournamentHeader({ tournament }: TournamentHeaderProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteTournament({ tournamentId: tournament.id });
    setIsDeleting(false);

    if (result.success) {
      toast.success("Tournament deleted successfully");
      router.push("/");
    } else {
      toast.error(result.error ?? "Failed to delete tournament");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{tournament.name}</h1>
        {session && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" disabled={isDeleting}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Tournament
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  tournament and all its associated data including teams and
                  matches.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
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
