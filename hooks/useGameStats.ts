"use client";

import { useEffect, useState } from "react";

export type GameStats = {
  gameId: string;
  bestScore: number | null;
  avgScore: number | null;
  playersOnline: number;
};

export function useGameStats(gameId: string) {
  const [data, setData] = useState<GameStats | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(`/api/game-stats/${gameId}`);
        if (!res.ok) return;
        const json = await res.json();
        if (!cancelled) setData(json);
      } catch (e) {
        console.error(e);
      }
    }

    load();
    const id = setInterval(load, 10_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [gameId]);

  return data;
}

