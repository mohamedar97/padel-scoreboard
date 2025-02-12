export interface Tournament {
  id: number;
  name: string;
  type: "league" | "groups";
  numberOfGroups: number | undefined;
  level: string;
  location: string;
  createdAt: Date;
}
