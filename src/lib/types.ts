export interface Tournament {
  id: number;
  name: string;
  type: "league" | "groups";
  createdAt: Date;
}
