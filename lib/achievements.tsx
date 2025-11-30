"use client";

import { useEffect, useState } from "react";
import { loadClientStats, ClientStats } from "@/lib/client-stats";
import { useToast } from "@/lib/toast";

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon?: string;
  rarity?: "common" | "rare" | "epic";
  check: (stats: ClientStats) => boolean;
};

const STORAGE_KEY = "arcade-achievements";

const ALL_ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-blood",
    title: "First blood",
    description: "Play any game once.",
    icon: "🎮",
    rarity: "common",
    check: (stats) =>
      !!(
        stats.reactionBestMs ||
        stats.memoryBestAccuracy ||
        stats.sprayBestHits ||
        stats.dropBestStreak
      ),
  },
  {
    id: "reaction-demon",
    title: "Reaction demon",
    description: "Hit under 220ms in Reaction Rush.",
    icon: "⚡",
    rarity: "rare",
    check: (stats) => stats.reactionBestMs != null && stats.reactionBestMs < 220,
  },
  {
    id: "memory-machine",
    title: "Memory machine",
    description: "Hit 90%+ in Memory Grid.",
    icon: "🧠",
    rarity: "rare",
    check: (stats) =>
      stats.memoryBestAccuracy != null && stats.memoryBestAccuracy >= 90,
  },
  {
    id: "spray-god",
    title: "Spray god",
    description: "Hit 35+ targets in Spray Control.",
    icon: "🎯",
    rarity: "epic",
    check: (stats) =>
      stats.sprayBestHits != null && stats.sprayBestHits >= 35,
  },
  {
    id: "zone-lord",
    title: "Zone lord",
    description: "Reach a streak of 5+ in Drop Royale.",
    icon: "📍",
    rarity: "epic",
    check: (stats) =>
      stats.dropBestStreak != null && stats.dropBestStreak >= 5,
  },
];

function loadUnlockedIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x) => typeof x === "string");
  } catch {
    return [];
  }
}

function saveUnlockedIds(ids: string[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // ignore
  }
}

export function useAchievements() {
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setUnlockedIds(loadUnlockedIds());
  }, []);

  // Re-check when stats might have changed
  useEffect(() => {
    const currentStats = loadClientStats();

    const already = new Set(unlockedIds);
    const newlyUnlocked: Achievement[] = [];

    for (const ach of ALL_ACHIEVEMENTS) {
      if (already.has(ach.id)) continue;
      if (ach.check(currentStats)) {
        newlyUnlocked.push(ach);
        already.add(ach.id);
      }
    }

    if (newlyUnlocked.length > 0) {
      const nextIds = Array.from(already);
      setUnlockedIds(nextIds);
      saveUnlockedIds(nextIds);

      // Fire toasts
      newlyUnlocked.forEach((ach) => {
        toast({
          title: `Achievement unlocked ${ach.icon ?? "🏅"}`,
          description: ach.title,
          variant: "success",
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(loadClientStats())]); // cheap hack: re-run when stats change

  const unlockedList = ALL_ACHIEVEMENTS.filter((a) =>
    unlockedIds.includes(a.id)
  );

  return {
    all: ALL_ACHIEVEMENTS,
    unlockedIds,
    unlockedList,
  };
}

