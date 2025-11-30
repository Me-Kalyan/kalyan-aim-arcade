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

export function GameCard({
  game,
  onClick,
}: {
  game: Game;
  onClick?: () => void;
}) {
  const gradientMap: Record<GameCategory, string> = {
    valorant: "bg-gradient-to-b from-[#FF4655] via-[#FF794C] to-[#2D1C40]",
    league: "bg-gradient-to-b from-[#E6257E] via-[#C41C6D] to-[#2D1C40]",
    csgo: "bg-gradient-to-b from-[#FA6400] via-[#CC5200] to-[#2D1C40]",
    fortnite: "bg-gradient-to-b from-[#4DD9F5] via-[#5BEBE5] to-[#2D1C40]",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative w-full overflow-hidden rounded-[28px] p-[1px] text-left shadow-lg dark:shadow-[0_4px_16px_rgba(0,0,0,0.3)] focus:outline-none focus:ring-2 focus:ring-brand-pink-500/40 dark:focus:ring-brand-pink-500/50 transition-all duration-150 hover:-translate-y-[2px] hover:shadow-elevated dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)] active:translate-y-0",
        gradientMap[game.category]
      )}
    >
      <div className="flex h-full flex-col rounded-[28px] bg-white dark:bg-[#12121B] text-ink-primary">
        {/* Header with gradient */}
        <div
          className={cn(
            "relative h-28 bg-gradient-to-tr overflow-hidden rounded-t-[28px]",
            categoryGradient[game.category]
          )}
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-black/65" />
          <div className="absolute inset-0 flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
              {/* Game logo/icon - aligned with title */}
              <div className="w-10 h-10 text-white/40 group-hover:text-white/60 transition-all duration-300 group-hover:scale-110 flex-shrink-0">
                <GameIcon gameId={game.id} />
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/70">
                  Featured game
                </p>
                <h3 className="text-base font-semibold text-white">
                  {game.name}
                </h3>
              </div>
            </div>
            <Badge variant="gaming" className="text-[10px]">
              {game.category.toUpperCase()}
            </Badge>
          </div>
        </div>
        {/* Body */}
        <div className="flex-1 px-5 pb-4 pt-2">
          <p className="text-xs text-ink-muted dark:text-[#B8B8C8]">{game.tagline}</p>
          <div className="flex items-center justify-between text-[11px] text-ink-muted dark:text-[#B8B8C8] mt-3">
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
          <div className="flex items-center justify-between text-[11px] mt-3">
            <span className={difficultyColor[game.difficulty]}>
              {game.difficulty} mode
            </span>
            <span className="text-brand-pink-500 dark:text-brand-pink-400 group-hover:translate-x-0.5 transition-transform">
              View details →
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

