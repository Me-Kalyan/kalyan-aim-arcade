"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";

type Props = {
  gameId: string;
  difficultyLabel: string;
};

type ApiStats = {
  bestScore: number | null;
  avgScore: number | null;
  playersOnline: number;
};

export function GameStatsCard({ gameId, difficultyLabel }: Props) {
  const [stats, setStats] = useState<ApiStats | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(`/api/game-stats/${gameId}`);
        if (!res.ok) return;

        const data = await res.json();
        if (!cancelled) setStats(data);
      } catch (e) {
        console.error(e);
      }
    }

    load();

    const id = setInterval(load, 10_000); // refresh every 10s

    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [gameId]);

  return (
    <Card>
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-subtle dark:text-[#5A5A6A]">
        Stats
      </p>
      <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
        <div>
          <p className="text-[11px] text-ink-soft dark:text-[#8E8E9E]">Best score</p>
          <p className="text-sm font-semibold text-ink-primary dark:text-[#F5F5F5]">
            {stats?.bestScore != null ? stats.bestScore.toLocaleString() : "—"}
          </p>
        </div>
        <div>
          <p className="text-[11px] text-ink-soft dark:text-[#8E8E9E]">Avg score</p>
          <p className="text-sm font-semibold text-ink-primary dark:text-[#F5F5F5]">
            {stats?.avgScore != null ? stats.avgScore.toLocaleString() : "—"}
          </p>
        </div>
        <div>
          <p className="text-[11px] text-ink-soft dark:text-[#8E8E9E]">Difficulty</p>
          <p className="text-sm font-semibold text-ink-primary dark:text-[#F5F5F5]">
            {difficultyLabel}
          </p>
        </div>
        <div>
          <p className="text-[11px] text-ink-soft dark:text-[#8E8E9E]">Players online</p>
          <p className="text-sm font-semibold text-emerald-500">
            {stats ? stats.playersOnline : "—"}
          </p>
        </div>
      </div>
    </Card>
  );
}

