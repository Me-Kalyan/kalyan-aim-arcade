"use client";

import { useEffect, useState } from "react";
import {
  getReactionBestMs,
  getMemoryBestAccuracy,
  getSprayBestHits,
  getDropBestStreak,
} from "@/lib/client-stats";

export type ArcadeRating = {
  reactionBestMs: number | null;
  memoryBestAccuracy: number | null;
  sprayBestHits: number | null;
  dropBestStreak: number | null;
  reactionScore: number | null; // 0–100
  memoryScore: number | null;   // 0–100
  sprayScore: number | null;    // 0–100
  dropScore: number | null;     // 0–100
  combinedScore: number | null; // 0–100
};

function calcReactionScore(bestMs: number | null): number | null {
  if (bestMs == null) return null;
  const minMs = 150;
  const maxMs = 500;
  const clamped = Math.min(Math.max(bestMs, minMs), maxMs);
  const ratio = (maxMs - clamped) / (maxMs - minMs); // 0–1
  return Math.round(ratio * 100);
}

function calcMemoryScore(bestAcc: number | null): number | null {
  if (bestAcc == null) return null;
  const clamped = Math.min(Math.max(bestAcc, 0), 100);
  return Math.round(clamped);
}

function calcSprayScore(bestHits: number | null): number | null {
  // Assume 40+ hits in 12s is "aim god"
  if (bestHits == null) return null;
  const cap = 40;
  const ratio = Math.min(bestHits, cap) / cap;
  return Math.round(ratio * 100);
}

function calcDropScore(bestStreak: number | null): number | null {
  // 10-round perfect streak = 100
  if (bestStreak == null) return null;
  const cap = 10;
  const ratio = Math.min(bestStreak, cap) / cap;
  return Math.round(ratio * 100);
}

export function useArcadeRating(): ArcadeRating {
  const [reactionBestMs, setReactionBestMsState] = useState<number | null>(null);
  const [memoryBestAccuracy, setMemoryBestAccuracyState] =
    useState<number | null>(null);
  const [sprayBestHits, setSprayBestHitsState] =
    useState<number | null>(null);
  const [dropBestStreak, setDropBestStreakState] =
    useState<number | null>(null);

  useEffect(() => {
    setReactionBestMsState(getReactionBestMs());
    setMemoryBestAccuracyState(getMemoryBestAccuracy());
    setSprayBestHitsState(getSprayBestHits());
    setDropBestStreakState(getDropBestStreak());
  }, []);

  const reactionScore = calcReactionScore(reactionBestMs);
  const memoryScore = calcMemoryScore(memoryBestAccuracy);
  const sprayScore = calcSprayScore(sprayBestHits);
  const dropScore = calcDropScore(dropBestStreak);

  const scores = [reactionScore, memoryScore, sprayScore, dropScore].filter(
    (s): s is number => s != null
  );

  const combinedScore =
    scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : null;

  return {
    reactionBestMs,
    memoryBestAccuracy,
    sprayBestHits,
    dropBestStreak,
    reactionScore,
    memoryScore,
    sprayScore,
    dropScore,
    combinedScore,
  };
}

