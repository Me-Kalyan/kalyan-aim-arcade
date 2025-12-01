"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { GameDifficulty } from "@/lib/games";

const options: GameDifficulty[] = ["Easy", "Medium", "Hard"];

export function GameDifficultySelector({
  value,
  onChange,
  className,
}: {
  value: GameDifficulty;
  onChange: (value: GameDifficulty) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-surface-subtle px-1 py-1",
        "border border-white/10 dark:border-white/5",
        className
      )}
    >
      {options.map((opt) => {
        const active = opt === value;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={cn(
              "px-3 py-1 rounded-full text-xs font-medium transition-all",
              "hover:bg-white/10 dark:hover:bg-white/10",
              active
                ? "bg-brand-pink-500 text-white shadow-[0_0_14px_rgba(255,77,219,0.7)]"
                : "text-ink-muted"
            )}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

