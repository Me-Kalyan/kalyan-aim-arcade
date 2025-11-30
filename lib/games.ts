export type GameCategory = "valorant" | "league" | "csgo" | "fortnite";

export type GameDifficulty = "Easy" | "Medium" | "Hard";

export type Game = {
  id: string;
  name: string;
  tagline: string;
  category: GameCategory;
  playersOnline: number;
  bestScore: number;
  difficulty: GameDifficulty;
};

export type LeaderboardEntry = {
  rank: number;
  player: string;
  game: string;
  score: number;
  delta?: number;
};

export const ALL_GAMES: Game[] = [
  {
    id: "reaction-rush",
    name: "Reaction Rush",
    tagline: "High-speed aim & reflex trainer.",
    category: "valorant",
    playersOnline: 238,
    bestScore: 9820,
    difficulty: "Medium",
  },
  {
    id: "memory-grid",
    name: "Memory Grid",
    tagline: "Memorise tile patterns under pressure.",
    category: "league",
    playersOnline: 121,
    bestScore: 7430,
    difficulty: "Easy",
  },
  {
    id: "spray-control",
    name: "Spray Control",
    tagline: "Hold mouse1, manage recoil, stay on head.",
    category: "csgo",
    playersOnline: 96,
    bestScore: 11010,
    difficulty: "Hard",
  },
  {
    id: "drop-royale",
    name: "Drop Royale",
    tagline: "Fortnite-style drop timing and tracking.",
    category: "fortnite",
    playersOnline: 164,
    bestScore: 8700,
    difficulty: "Medium",
  },
];

export const GLOBAL_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, player: "nova", game: "Reaction Rush", score: 12040, delta: +2 },
  { rank: 2, player: "zenith", game: "Spray Control", score: 11680, delta: -1 },
  { rank: 3, player: "pixel", game: "Memory Grid", score: 9900, delta: 0 },
  { rank: 4, player: "echo", game: "Drop Royale", score: 9820, delta: +1 },
  { rank: 5, player: "ghost", game: "Reaction Rush", score: 8870, delta: -3 },
  { rank: 6, player: "orbit", game: "Memory Grid", score: 8610, delta: 0 },
  { rank: 7, player: "luma", game: "Spray Control", score: 8440, delta: +4 },
];

export const GAME_DETAILS: Record<
  string,
  {
    id: string;
    name: string;
    tagline: string;
    description: string;
    difficulty: GameDifficulty;
    bestScore: number;
    avgScore: number;
    playersOnline: number;
  }
> = {
  "reaction-rush": {
    id: "reaction-rush",
    name: "Reaction Rush",
    tagline: "Tap when targets flash. Miss and you lose your streak.",
    description:
      "A reaction-time warmup inspired by tactical FPS duels. Targets appear in random positions with a tight timer. Maintain your streak and push into sudden-death rounds.",
    difficulty: "Medium",
    bestScore: 9820,
    avgScore: 4210,
    playersOnline: 238,
  },
  "memory-grid": {
    id: "memory-grid",
    name: "Memory Grid",
    tagline: "Memorise, flip and rebuild the grid.",
    description:
      "Great for focus and working memory. Watch the tiles light up, then recreate the pattern before the timer fades. Higher levels add distractors and decoys.",
    difficulty: "Easy",
    bestScore: 7430,
    avgScore: 3610,
    playersOnline: 121,
  },
  "spray-control": {
    id: "spray-control",
    name: "Spray Control",
    tagline: "Beat the recoil pattern every round.",
    description:
      "Built for recoil tracking. A silhouette target moves as if strafing; your spray pattern must stay on-target to maintain accuracy multipliers.",
    difficulty: "Hard",
    bestScore: 11010,
    avgScore: 5120,
    playersOnline: 96,
  },
  "drop-royale": {
    id: "drop-royale",
    name: "Drop Royale",
    tagline: "Land, loot, rotate and survive.",
    description:
      "Simulates battle royale drop decisions with heat maps and loot zones. The better your pathing, the more points you stack before the circle closes.",
    difficulty: "Medium",
    bestScore: 8700,
    avgScore: 4330,
    playersOnline: 164,
  },
};

