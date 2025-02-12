"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTournament } from "@/lib/actions/createTournament";
import { addTeamsToTournament } from "@/lib/actions/addTeamsToTournament";
import { toast } from "sonner";
import { TournamentDetailsForm } from "@/components/tournament/TournamentDetailsForm";
import { TeamsForm } from "@/components/tournament/TeamsForm";

type Team = {
  player1Name: string;
  player2Name: string;
  group?: string;
};
export default function CreateTournamentForm() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [currentTeam, setCurrentTeam] = useState<Team>({
    player1Name: "",
    player2Name: "",
    group: undefined,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "" as "league" | "groups",
    level: "",
    location: "",
    numberOfGroups: undefined as number | undefined,
    teams: [] as Team[],
  });

  const handleTournamentSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    setStep(2);
  };

  const addTeam = () => {
    if (currentTeam.player1Name && currentTeam.player2Name) {
      if (isEditing) {
        setFormData((prev) => ({
          ...prev,
          teams: prev.teams.map((team, i) =>
            i ===
            prev.teams.findIndex(
              (t) =>
                t.player1Name === currentTeam.player1Name &&
                t.player2Name === currentTeam.player2Name,
            )
              ? currentTeam
              : team,
          ),
        }));
        setIsEditing(false);
      } else {
        setFormData((prev) => ({
          ...prev,
          teams: [...prev.teams, currentTeam],
        }));
      }
      setCurrentTeam({
        player1Name: "",
        player2Name: "",
        group: undefined,
      });
    }
  };

  const removeTeam = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      teams: prev.teams.filter((_, i) => i !== index),
    }));
  };

  const editTeam = (index: number) => {
    const teamToEdit = formData.teams[index];
    if (!teamToEdit) return;

    setCurrentTeam(teamToEdit);
    setIsEditing(true);
  };

  const updateTeam = (
    field: "player1Name" | "player2Name" | "group",
    value: string,
  ) => {
    setCurrentTeam((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await createTournament({
      name: formData.name,
      type: formData.type,
      level: formData.level,
      location: formData.location,
      numberOfGroups: formData.numberOfGroups,
    });

    if (!result.success || !result.data) {
      toast.error("Try again later");
      return;
    }
    const tournamentId = result.data.id;

    try {
      const result = await addTeamsToTournament({
        tournamentId,
        teams: formData.teams,
      });

      if (result.success) {
        toast.success("Teams added successfully!");
        router.push(`/tournaments/${tournamentId}`);
      } else {
        toast.error(result.error || "Failed to add teams");
      }
    } catch (error) {
      toast.error("Something went wrong while adding teams");
    }
  };

  // Auto-generate tournament name when level or location changes
  const updateTournamentName = (
    newLevel: string | undefined,
    newLocation: string | undefined,
  ) => {
    if (newLevel && newLocation) {
      const today = new Date();
      const day = today.toLocaleDateString("en-US", { weekday: "long" });
      const name = `${day} ${newLevel} Tournament in ${newLocation}`;
      setFormData((prev) => ({ ...prev, name }));
    }
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      {step === 1 ? (
        <TournamentDetailsForm
          name={formData.name}
          type={formData.type}
          level={formData.level}
          location={formData.location}
          numberOfGroups={formData.numberOfGroups}
          onNameChange={(name) => setFormData((prev) => ({ ...prev, name }))}
          onTypeChange={(type) => {
            setFormData((prev) => ({
              ...prev,
              type,
              // Reset numberOfGroups when switching types
              numberOfGroups:
                type === "league" ? undefined : prev.numberOfGroups,
            }));
          }}
          onLevelChange={(level) => {
            setFormData((prev) => ({ ...prev, level }));
            updateTournamentName(level, formData.location);
          }}
          onLocationChange={(location) => {
            setFormData((prev) => ({ ...prev, location }));
            updateTournamentName(formData.level, location);
          }}
          onNumberOfGroupsChange={(numberOfGroups) =>
            setFormData((prev) => ({ ...prev, numberOfGroups }))
          }
          onSubmit={handleTournamentSubmit}
        />
      ) : (
        <TeamsForm
          currentTeam={currentTeam}
          onUpdateTeam={updateTeam}
          onAddTeam={addTeam}
          onSubmit={handleSubmit}
          teams={formData.teams}
          onRemoveTeam={removeTeam}
          onEditTeam={editTeam}
          isGroupTournament={formData.type === "groups"}
          numberOfGroups={formData.numberOfGroups}
          isEditing={isEditing}
        />
      )}
    </div>
  );
}
