export interface Tournament {
  id: number;
  name: string;
  type: "league" | "groups";
  level: string;
  location: string;
  createdAt: Date;
}
