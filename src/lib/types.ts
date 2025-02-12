export interface Tournament {
  id: string;
  name: string;
  type: "league" | "groups";
  numberOfGroups: number | undefined;
  level: string;
  location: string;
  createdAt: Date;
}
