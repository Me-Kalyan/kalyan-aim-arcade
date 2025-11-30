"use client";

import * as React from "react";
import { Badge } from "@/components/ui/Badge";
import { GameIcon } from "@/components/GameIcon";
import { cn } from "@/lib/utils";
import type { Game, GameCategory, GameDifficulty } from "@/lib/games";

const categoryGradient: Record<GameCategory, string> = {
  valorant: "from-[#FF4655] to-[#C4314B]",
  league: "from-[#E6257E] to-[#C41C6D]",
  csgo: "from-[#FA6400] to-[#CC5200]",
  fortnite: "from-[#4DD9F5] to-[#5BEBE5]",
};

const difficultyColor: Record<GameDifficulty, string> = {
  Easy: "text-success",
  Medium: "text-warning",
  Hard: "text-danger",
};

const gradientMap: Record<GameCategory, string> = {
  valorant: "bg-gradient-to-b from-[#FF4655] via-[#FF794C] to-[#2D1C40]",
  league: "bg-gradient-to-b from-[#E6257E] via-[#C41C6D] to-[#2D1C40]",
  csgo: "bg-gradient-to-b from-[#FA6400] via-[#CC5200] to-[#2D1C40]",
  fortnite: "bg-gradient-to-b from-[#4DD9F5] via-[#5BEBE5] to-[#2D1C40]",
};

export function GameCard({
  game,
  onClick,
}: {
  game: Game;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative w-full rounded-[28px] p-[1px] text-left",
        "shadow-lg dark:shadow-[0_4px_16px_rgba(0,0,0,0.3)]",
        "focus:outline-none focus:ring-2 focus:ring-brand-pink-500/40 dark:focus:ring-brand-pink-500/50",
        "transition-all duration-150 hover:-translate-y-[2px] hover:shadow-elevated dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)] active:translate-y-0",
        "overflow-hidden",
        gradientMap[game.category]
      )}
    >
      <div className="flex h-full flex-col rounded-[26px] bg-white dark:bg-[#12121B] text-ink-primary">
        {/* Header with gradient */}
        <div
          className={cn(
            "relative h-28 overflow-hidden rounded-t-[26px] bg-gradient-to-tr",
            categoryGradient[game.category]
          )}
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-black/65" />

          {/* 2-row layout: title row + badge row */}
          <div className="absolute inset-0 flex flex-col justify-between px-4 py-3 gap-2">
            {/* Row 1: icon + text */}
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center text-white/40 transition-all duration-300 group-hover:scale-110 group-hover:text-white/70">
                <GameIcon gameId={game.id} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/70">
                  Featured game
                </p>
                <h3 className="truncate text-sm font-semibold text-white">
                  {game.name}
                </h3>
              </div>
            </div>

            {/* Row 2: badge aligned right – no overlap */}
            <div className="flex justify-end">
              <Badge
                variant="gaming"
                className="px-3 py-1 text-[10px] whitespace-nowrap"
              >
                {game.category.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 px-5 pb-4 pt-3">
          <p className="text-xs text-ink-muted dark:text-[#B8B8C8]">
            {game.tagline}
          </p>

          <div className="mt-3 flex items-center justify-between text-[11px] text-ink-muted dark:text-[#B8B8C8]">
            <span>
              <span className="inline-block h-2 w-2 rounded-full bg-success align-middle" />{" "}
              {game.playersOnline.toLocaleString()} watching
            </span>
            <span>
              Best score:{" "}
              <span className="font-semibold text-ink-primary dark:text-[#F5F5F5]">
                {game.bestScore.toLocaleString()}
              </span>
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px]">
            <span className={difficultyColor[game.difficulty]}>
              {game.difficulty} mode
            </span>
            <span className="text-brand-pink-500 dark:text-brand-pink-400 transition-transform group-hover:translate-x-0.5">
              View details →
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
