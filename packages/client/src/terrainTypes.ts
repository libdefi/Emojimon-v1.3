export enum TerrainType {
  TallGrass = 1,
  Boulder,
  Goal,
  Start
}

type TerrainConfig = {
  emoji: string;
};

export const terrainTypes: Record<TerrainType, TerrainConfig> = {
  [TerrainType.TallGrass]: {
    emoji: "🌲",
  },
  [TerrainType.Boulder]: {
    emoji: "🧱",
  },
  [TerrainType.Goal]: {
    emoji: "👑",
  },
  [TerrainType.Start]: {
    emoji: "🕳",
  },
};
