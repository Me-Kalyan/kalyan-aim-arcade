"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { type GameDifficulty } from "@/lib/games";
import { Card } from "@/components/ui/Card";
import { GameDifficultySelector } from "@/components/GameDifficultySelector";
import { useArcadeRating } from "@/lib/arcade-rating";
import { useLeaderboard } from "@/hooks/useLeaderboard";

type DifficultyFilter = GameDifficulty | "All";

export default function LeaderboardPage() {
  const rating = useArcadeRating();
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("All");
  const entries = useLeaderboard(undefined, 8000, difficulty);

  const hasRating = rating.combinedScore != null;

  // Transform API entries to match LeaderboardTable format
  const tableEntries = entries.map((row) => ({
    rank: row.rank,
    player: row.handle,
    game: row.game_id.replace("-", " "),
    score: row.best_score,
    delta: undefined as number | undefined,
  }));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Leaderboard"
        title="Global ranking across all games."
        description="Later you can filter by game, region or friends. For now this is a combined global view."
        rightSlot={
          <div className="flex items-center gap-2">
            <span className="text-xs text-ink-muted dark:text-[#B8B8C8]">Difficulty</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  difficulty === "All"
                    ? "bg-brand-pink-500 text-white shadow-[0_0_14px_rgba(255,77,219,0.7)]"
                    : "text-ink-muted bg-surface-subtle dark:bg-[#1A1A24] hover:bg-white/10 dark:hover:bg-white/10"
                }`}
                onClick={() => setDifficulty("All")}
              >
                All
              </button>
              <GameDifficultySelector
                value={difficulty === "All" ? "Medium" : difficulty}
                onChange={(d) => setDifficulty(d)}
              />
            </div>
          </div>
        }
      />
      {/* Your rating summary */}
      <Card>
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-subtle dark:text-[#5A5A6A]">
          Your arcade rating
        </p>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            {hasRating ? (
              <p className="text-sm text-ink-soft dark:text-[#8E8E9E] max-w-md">
                Combined score across aim, memory, tracking and decision-making,
                using all four games.
              </p>
            ) : (
              <p className="text-sm text-ink-soft dark:text-[#8E8E9E] max-w-md">
                Play any of the mini games to unlock your personal rating.
              </p>
            )}
          </div>
          <div className="flex items-end gap-6">
            <div className="text-right">
              <p className="text-[11px] text-ink-soft dark:text-[#8E8E9E] mb-1">Rating</p>
              <p className="text-2xl font-semibold text-brand-pink-500 dark:text-brand-pink-400 leading-none">
                {hasRating ? `${rating.combinedScore}/100` : "—"}
              </p>
            </div>
            <div className="text-right text-[11px]">
              <div className="space-y-1.5">
                <p className="text-ink-soft dark:text-[#8E8E9E]">
                  Reaction (RR):{" "}
                  <span className="font-medium text-ink-primary dark:text-[#F5F5F5]">
                    {rating.reactionScore != null
                      ? `${rating.reactionScore}/100`
                      : "—"}
                  </span>
                </p>
                <p className="text-ink-soft dark:text-[#8E8E9E]">
                  Memory (MG):{" "}
                  <span className="font-medium text-ink-primary dark:text-[#F5F5F5]">
                    {rating.memoryScore != null
                      ? `${rating.memoryScore}/100`
                      : "—"}
                  </span>
                </p>
                <p className="text-ink-soft dark:text-[#8E8E9E]">
                  Aim / tracking (SC):{" "}
                  <span className="font-medium text-ink-primary dark:text-[#F5F5F5]">
                    {rating.sprayScore != null
                      ? `${rating.sprayScore}/100`
                      : "—"}
                  </span>
                </p>
                <p className="text-ink-soft dark:text-[#8E8E9E]">
                  Decision (DR):{" "}
                  <span className="font-medium text-ink-primary dark:text-[#F5F5F5]">
                    {rating.dropScore != null
                      ? `${rating.dropScore}/100`
                      : "—"}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
      {/* Global leaderboard */}
      <LeaderboardTable entries={tableEntries} />
    </div>
  );
}

