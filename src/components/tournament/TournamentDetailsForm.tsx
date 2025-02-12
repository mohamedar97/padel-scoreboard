import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface TournamentDetailsFormProps {
  name: string;
  type: "league" | "groups";
  level: string;
  location: string;
  onNameChange: (name: string) => void;
  onTypeChange: (type: "league" | "groups") => void;
  onLevelChange: (level: string) => void;
  onLocationChange: (location: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function TournamentDetailsForm({
  name,
  type,
  level,
  location,
  onNameChange,
  onTypeChange,
  onLevelChange,
  onLocationChange,
  onSubmit,
}: TournamentDetailsFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!type) {
      toast.error("Please select a tournament type");
      return;
    }

    if (!level) {
      toast.error("Please select a tournament level");
      return;
    }

    if (!location) {
      toast.error("Please select a tournament location");
      return;
    }

    onSubmit(e);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Create New Tournament</h1>
        <p className="text-muted-foreground">
          Enter the tournament details to get started
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {name && (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-900">{name}</p>
            </div>
          )}

          <div className="space-y-2">
            <label
              htmlFor="type"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Tournament Type
            </label>
            <Select
              value={type || undefined}
              onValueChange={(value: "league" | "groups") =>
                onTypeChange(value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select tournament type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="league">League</SelectItem>
                <SelectItem value="groups">Groups</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="level"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Tournament Level
            </label>
            <Select
              value={level || undefined}
              onValueChange={(value: string) => onLevelChange(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select tournament level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Beginners">Beginners</SelectItem>
                <SelectItem value="Level D">Level D</SelectItem>
                <SelectItem value="Level C">Level C</SelectItem>
                <SelectItem value="Mixed">Mixed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="location"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Tournament Location
            </label>
            <Select
              value={location || undefined}
              onValueChange={(value: string) => onLocationChange(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select tournament location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Jo Padel">Jo Padel</SelectItem>
                <SelectItem value="The Field">The Field</SelectItem>
                <SelectItem value="Helwan Club">Helwan Club</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button type="submit" className="w-full">
          Next: Add Teams
        </Button>
      </form>
    </div>
  );
}
