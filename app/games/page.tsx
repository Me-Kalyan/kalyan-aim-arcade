"use client";

import { PageHeader } from "@/components/PageHeader";
import { GameCard } from "@/components/GameCard";
import { ALL_GAMES } from "@/lib/games";

const GAME_SKILL_TAGS: Record<
  string,
  { label: string; detail: string }
> = {
  "reaction-rush": {
    label: "Aim · Reaction",
    detail: "Fast click reactions and flick timing.",
  },
  "memory-grid": {
    label: "Memory · Focus",
    detail: "Short-term pattern memory under pressure.",
  },
  "spray-control": {
    label: "Aim · Tracking",
    detail: "Smooth tracking and recoil control.",
  },
  "drop-royale": {
    label: "Decision · Macro",
    detail: "Risk/reward decisions and zone reading.",
  },
};

export default function GamesPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Games"
        title="Choose your next micro-challenge."
        description="All games are designed to be quick sessions with leaderboard-friendly scores."
        rightSlot={
          <input
            placeholder="Search games…"
            className="h-9 min-w-[200px] rounded-pill border border-surface-border dark:border-[#252530] bg-surface-card dark:bg-[#13131A] px-3 text-xs text-ink-primary dark:text-[#F5F5F5] outline-none placeholder:text-ink-subtle dark:placeholder:text-[#5A5A6A] focus:border-brand-pink-500 dark:focus:border-brand-pink-400 focus:ring-2 focus:ring-brand-pink-500/20 dark:focus:ring-brand-pink-500/30 transition-colors duration-200"
          />
        }
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ALL_GAMES.map((game) => {
          const skill = GAME_SKILL_TAGS[game.id];
          return (
            <div key={game.id} className="space-y-1">
              <GameCard
                game={game}
                onClick={() =>
                  (window.location.href = `/game/${game.id}`)
                }
              />
              {skill && (
                <div className="rounded-pill bg-surface-subtle dark:bg-[#1A1A24] px-3 py-1 text-[11px] text-ink-soft dark:text-[#8E8E9E] flex items-center justify-between transition-colors duration-200">
                  <span className="font-medium text-ink-primary dark:text-[#F5F5F5]">
                    {skill.label}
                  </span>
                  <span className="hidden sm:inline">
                    {skill.detail}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

