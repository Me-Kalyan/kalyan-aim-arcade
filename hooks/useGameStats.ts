"use client";

import { useEffect, useState } from "react";
import type { GameDifficulty } from "@/lib/games";

export type GameStats = {
  gameId: string;
  difficulty: GameDifficulty | "All";
  bestScore: number;
  avgScore: number;
  playersOnline: number;
};

export function useGameStats(
  gameId: string,
  difficulty?: GameDifficulty,
  intervalMs: number = 8000
) {
  const [data, setData] = useState<GameStats | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const params = new URLSearchParams();
        if (difficulty) params.set("difficulty", difficulty);

        const res = await fetch(
          `/api/game-stats/${gameId}?${params.toString()}`,
          { cache: "no-store" }
        );
        if (!res.ok) return;

        const json = await res.json();
        if (!cancelled) setData(json);
      } catch (e) {
        console.error("useGameStats error", e);
      }
    }

    load();
    const id = setInterval(load, intervalMs);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [gameId, difficulty, intervalMs]);

  return data;
}

