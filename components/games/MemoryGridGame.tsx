"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/lib/toast";
import {
  getMemoryBestAccuracy,
  setMemoryBestAccuracy,
  recordGamePlayed,
} from "@/lib/client-stats";
import { useSessionSummary } from "@/lib/session-summary";
import { usePlaylist } from "@/lib/playlist";
import { getOrCreatePlayerId, getPlayerName } from "@/lib/player";

type Status = "idle" | "showing" | "input" | "result";

const GRID_SIZE = 9;

async function recordMemoryRun(accuracyPct: number) {
  const playerId = getOrCreatePlayerId();
  const playerName = getPlayerName();
  if (!playerId) return;

  const clamped = Math.max(0, Math.min(100, accuracyPct));
  const normalizedScore = Math.round(clamped * 100); // 0–10000

  try {
    await fetch("/api/runs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        playerId,
        playerName,
        gameId: "memory-grid",
        normalizedScore,
        rawValue: clamped,
        rawUnit: "%",
      }),
    });
  } catch (e) {
    console.error("Failed to record memory run", e);
  }
}

function makePattern(length: number): number[] {
  const indices = new Set<number>();
  while (indices.size < length) {
    indices.add(Math.floor(Math.random() * GRID_SIZE));
  }
  return Array.from(indices);
}

export function MemoryGridGame() {
  const [status, setStatus] = useState<Status>("idle");
  const [level, setLevel] = useState(1);
  const [pattern, setPattern] = useState<number[]>([]);
  const [showPattern, setShowPattern] = useState(false);
  const [selected, setSelected] = useState<boolean[]>(
    () => Array(GRID_SIZE).fill(false)
  );
  const [score, setScore] = useState<number | null>(null);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const { toast } = useToast();
  const { openSummary } = useSessionSummary();
  const { onGameCompleted } = usePlaylist();

  useEffect(() => {
    setBestScore(getMemoryBestAccuracy());
  }, []);

  useEffect(() => {
    if (bestScore != null) {
      setMemoryBestAccuracy(bestScore);
    }
  }, [bestScore]);

  // Generate + show pattern for current level
  function startRound(nextLevel?: number) {
    const lvl = nextLevel ?? level;
    const patternLength = Math.min(3 + lvl, 6); // between 3 and 6 tiles
    const p = makePattern(patternLength);
    setPattern(p);
    setSelected(Array(GRID_SIZE).fill(false));
    setStatus("showing");
    setShowPattern(true);
  }

  // Hide pattern after a short delay
  useEffect(() => {
    if (!showPattern || status !== "showing") return;
    const timer = setTimeout(() => {
      setShowPattern(false);
      setStatus("input");
    }, 1200);
    return () => clearTimeout(timer);
  }, [showPattern, status]);

  function handleTileClick(index: number) {
    if (status !== "input") return;
    setSelected((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  }

  function evaluate() {
    if (status !== "input") return;
    const targetSet = new Set(pattern);
    let correct = 0;
    let extra = 0;
    let missed = 0;

    for (let i = 0; i < GRID_SIZE; i++) {
      const should = targetSet.has(i);
      const picked = selected[i];
      if (should && picked) correct++;
      else if (!should && picked) extra++;
      else if (should && !picked) missed++;
    }

    const raw =
      pattern.length === 0 ? 0 : correct - extra - missed * 0.5; // penalise misses a bit
    const pct = Math.max(
      0,
      Math.round((raw / pattern.length) * 100)
    );

    setScore(pct);
    setStatus("result");

    setBestScore((prev) => {
      const nextBest = prev == null ? pct : Math.max(prev, pct);
      if (nextBest > (prev ?? 0)) {
        toast({
          title: "New best pattern score 🎉",
          description: `${nextBest}% accuracy`,
          variant: "success",
        });
      } else {
        toast({
          title: "Pattern checked",
          description: `${pct}% accuracy – try the next round.`,
          variant: "default",
        });
      }
      finishRound(pct);
      recordGamePlayed("memory-grid");
      // Record run to database
      void recordMemoryRun(pct);
      return nextBest;
    });

    // Level up if good performance
    if (pct >= 70) {
      setLevel((prev) => prev + 1);
    }
  }

  function finishRound(pct: number) {
    openSummary({
      gameId: "memory-grid",
      title: "Memory Grid session",
      lines: [
        `Pattern accuracy: ${pct}%`,
        bestScore != null
          ? `Best so far: ${Math.max(bestScore, pct)}%`
          : "First recorded pattern.",
        pct >= 80
          ? "Solid pattern recall – clutch-ready."
          : "Keep going, your memory warms up over time.",
      ],
      ctaLabel: "Next: Drop Royale",
      ctaHref: "/game/drop-royale",
    });
    onGameCompleted("memory-grid");
  }

  // Keyboard: number keys 1-9 toggle tiles
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (status !== "input") return;
      const key = e.key;
      const n = Number(key);
      if (!Number.isNaN(n) && n >= 1 && n <= 9) {
        e.preventDefault();
        handleTileClick(n - 1);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, selected]);

  function resetForNext() {
    setSelected(Array(GRID_SIZE).fill(false));
    setScore(null);
    setStatus("idle");
  }

  const patternLength = pattern.length;

  return (
    <div className="flex flex-col gap-3">
      <Card>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-subtle dark:text-[#5A5A6A]">
          Memory grid
        </p>
        <p className="mt-1 text-xs text-ink-soft dark:text-[#8E8E9E]">
          Watch the tiles flash, remember the pattern, then rebuild it from
          memory. Higher levels show more tiles.
        </p>
        <div className="mt-4 grid grid-cols-3 gap-2 p-2 rounded-card border border-surface-border dark:border-[#252530] bg-surface-subtle dark:bg-[#1A1A24]">
          {Array.from({ length: GRID_SIZE }).map((_, i) => {
            const isInPattern = pattern.includes(i);
            const isSelected = selected[i];
            const visibleAsPattern = showPattern && isInPattern;

            const active =
              visibleAsPattern || (!showPattern && isSelected);

            const baseClasses =
              "flex h-16 items-center justify-center rounded-card border-2 text-xs font-medium transition-colors duration-150";

            const stateClasses =
              status === "showing" && visibleAsPattern
                ? "border-brand-pink-500 dark:border-brand-pink-400 bg-gradient-to-tr from-brand-pink-500 to-brand-pink-400 text-surface-card dark:text-white shadow-card dark:shadow-[0_4px_16px_rgba(230,37,126,0.3)]"
                : active
                ? "border-brand-pink-500/70 dark:border-brand-pink-400/70 bg-brand-pink-500/10 dark:bg-brand-pink-500/20 text-ink-primary dark:text-[#F5F5F5]"
                : "border-surface-border dark:border-[#2A2A35] bg-surface-card dark:bg-[#13131A] text-ink-muted dark:text-[#B8B8C8]";

            return (
              <button
                key={i}
                type="button"
                onClick={() => handleTileClick(i)}
                className={`${baseClasses} ${stateClasses}`}
              >
                {active ? "●" : ""}
              </button>
            );
          })}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] text-ink-soft dark:text-[#8E8E9E]">
          <span>Level {level}</span>
          <span>Pattern length: {patternLength || "—"}</span>
          <span>
            Last score:{" "}
            {score != null ? (
              <span className="font-semibold text-ink-primary dark:text-[#F5F5F5]">
                {score}%
              </span>
            ) : (
              "—"
            )}
          </span>
          <span>
            Best:{" "}
            {bestScore != null ? (
              <span className="font-semibold text-success">
                {bestScore}%
              </span>
            ) : (
              "—"
            )}
          </span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          {status === "idle" || status === "result" ? (
            <Button
              variant="primary"
              className="px-4 py-2 text-xs"
              onClick={() => {
                resetForNext();
                startRound();
              }}
            >
              {status === "result" ? "Play next round" : "Start round"}
            </Button>
          ) : (
            <Button
              variant="secondary"
              className="px-4 py-2 text-xs"
              onClick={resetForNext}
            >
              Cancel round
            </Button>
          )}
          <Button
            variant="ghost"
            className="px-3 py-2 text-[11px]"
            onClick={evaluate}
            disabled={status !== "input"}
          >
            Check pattern
          </Button>
        </div>
      </Card>
    </div>
  );
}

