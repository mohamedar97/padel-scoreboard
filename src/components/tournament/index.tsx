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
};
export default function CreateTournamentForm() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "" as "league" | "groups",
    level: "",
    location: "",
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
        setFormData((prev) => {
          const newTeams = [...prev.teams];
          newTeams[currentTeamIndex] = currentTeam;
          return { ...prev, teams: newTeams };
        });
        setIsEditing(false);
      } else {
        setFormData((prev) => ({
          ...prev,
          teams: [...prev.teams],
        }));
      }
      setCurrentTeamIndex(formData.teams.length);
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

    setCurrentTeamIndex(index);
    setIsEditing(true);
  };

  const updateTeam = (field: "player1Name" | "player2Name", value: string) => {
    setFormData((prev) => {
      const newTeams = [...prev.teams];
      newTeams[currentTeamIndex] = {
        player1Name: "",
        player2Name: "",
        ...newTeams[currentTeamIndex],
        [field]: value,
      };
      return { ...prev, teams: newTeams };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await createTournament({
      name: formData.name,
      type: formData.type,
      level: formData.level,
      location: formData.location,
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

  const currentTeam = formData.teams[currentTeamIndex] || {
    player1Name: "",
    player2Name: "",
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
          onNameChange={(name) => setFormData((prev) => ({ ...prev, name }))}
          onTypeChange={(type) => setFormData((prev) => ({ ...prev, type }))}
          onLevelChange={(level) => {
            setFormData((prev) => ({ ...prev, level }));
            updateTournamentName(level, formData.location);
          }}
          onLocationChange={(location) => {
            setFormData((prev) => ({ ...prev, location }));
            updateTournamentName(formData.level, location);
          }}
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
        />
      )}
    </div>
  );
}
