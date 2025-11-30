"use client";

import { useEffect, useState } from "react";

export type LeaderboardEntry = {
  rank: number;
  player_id: string;
  handle: string;
  best_score: number;
  game_id: string;
};

export function useLeaderboard(limit?: number, intervalMs = 8000) {
  const [rows, setRows] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/leaderboard");
        if (!res.ok) return;
        const json = await res.json();
        if (cancelled) return;
        const list: LeaderboardEntry[] = json.entries ?? [];
        setRows(limit ? list.slice(0, limit) : list);
      } catch (e) {
        console.error(e);
      }
    }

    load();
    const id = setInterval(load, intervalMs);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [limit, intervalMs]);

  return rows;
}

