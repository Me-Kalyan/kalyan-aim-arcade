"use client";

export type ClientStats = {
  reactionBestMs: number | null;
  memoryBestAccuracy: number | null;
  sprayBestHits: number | null;
  dropBestStreak: number | null;
  totalReactionRuns: number;
  totalMemoryRounds: number;
  totalSprayDrills: number;
  totalDropRounds: number;
  lastPlayedGameId: string | null;
  lastPlayedAt: string | null; // ISO string
};

const KEYS = {
  reactionBestMs: "stats-reaction-best-ms",
  memoryBestAccuracy: "stats-memory-best-accuracy",
  sprayBestHits: "stats-spray-best-hits",
  dropBestStreak: "stats-drop-best-streak",
  meta: "stats-meta-v1",
} as const;

type StatsMeta = {
  totalReactionRuns: number;
  totalMemoryRounds: number;
  totalSprayDrills: number;
  totalDropRounds: number;
  lastPlayedGameId: string | null;
  lastPlayedAt: string | null;
};

function safeGetNumber(key: string): number | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const v = Number(raw);
    return Number.isNaN(v) ? null : v;
  } catch {
    return null;
  }
}

function safeSetNumber(key: string, value: number | null) {
  if (typeof window === "undefined") return;
  try {
    if (value == null) {
      window.localStorage.removeItem(key);
    } else {
      window.localStorage.setItem(key, String(value));
    }
  } catch {
    // ignore storage errors
  }
}

export function getReactionBestMs(): number | null {
  return safeGetNumber(KEYS.reactionBestMs);
}

export function setReactionBestMs(value: number | null) {
  safeSetNumber(KEYS.reactionBestMs, value);
}

export function getMemoryBestAccuracy(): number | null {
  return safeGetNumber(KEYS.memoryBestAccuracy);
}

export function setMemoryBestAccuracy(value: number | null) {
  safeSetNumber(KEYS.memoryBestAccuracy, value);
}

export function getSprayBestHits(): number | null {
  return safeGetNumber(KEYS.sprayBestHits);
}

export function setSprayBestHits(value: number | null) {
  safeSetNumber(KEYS.sprayBestHits, value);
}

export function getDropBestStreak(): number | null {
  return safeGetNumber(KEYS.dropBestStreak);
}

export function setDropBestStreak(value: number | null) {
  safeSetNumber(KEYS.dropBestStreak, value);
}

function loadMeta(): StatsMeta {
  if (typeof window === "undefined") {
    return {
      totalReactionRuns: 0,
      totalMemoryRounds: 0,
      totalSprayDrills: 0,
      totalDropRounds: 0,
      lastPlayedGameId: null,
      lastPlayedAt: null,
    };
  }
  try {
    const raw = window.localStorage.getItem(KEYS.meta);
    if (!raw) {
      return {
        totalReactionRuns: 0,
        totalMemoryRounds: 0,
        totalSprayDrills: 0,
        totalDropRounds: 0,
        lastPlayedGameId: null,
        lastPlayedAt: null,
      };
    }
    const parsed = JSON.parse(raw);
    return {
      totalReactionRuns: parsed.totalReactionRuns ?? 0,
      totalMemoryRounds: parsed.totalMemoryRounds ?? 0,
      totalSprayDrills: parsed.totalSprayDrills ?? 0,
      totalDropRounds: parsed.totalDropRounds ?? 0,
      lastPlayedGameId: parsed.lastPlayedGameId ?? null,
      lastPlayedAt: parsed.lastPlayedAt ?? null,
    };
  } catch {
    return {
      totalReactionRuns: 0,
      totalMemoryRounds: 0,
      totalSprayDrills: 0,
      totalDropRounds: 0,
      lastPlayedGameId: null,
      lastPlayedAt: null,
    };
  }
}

function saveMeta(meta: StatsMeta) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEYS.meta, JSON.stringify(meta));
  } catch {
    // ignore
  }
}

export function loadClientStats(): ClientStats {
  const meta = loadMeta();
  return {
    reactionBestMs: getReactionBestMs(),
    memoryBestAccuracy: getMemoryBestAccuracy(),
    sprayBestHits: getSprayBestHits(),
    dropBestStreak: getDropBestStreak(),
    totalReactionRuns: meta.totalReactionRuns,
    totalMemoryRounds: meta.totalMemoryRounds,
    totalSprayDrills: meta.totalSprayDrills,
    totalDropRounds: meta.totalDropRounds,
    lastPlayedGameId: meta.lastPlayedGameId,
    lastPlayedAt: meta.lastPlayedAt,
  };
}

// Helper: record that a game was played once
export function recordGamePlayed(gameId: string) {
  const meta = loadMeta();
  const now = new Date().toISOString();

  switch (gameId) {
    case "reaction-rush":
      meta.totalReactionRuns += 1;
      break;
    case "memory-grid":
      meta.totalMemoryRounds += 1;
      break;
    case "spray-control":
      meta.totalSprayDrills += 1;
      break;
    case "drop-royale":
      meta.totalDropRounds += 1;
      break;
    default:
      break;
  }

  meta.lastPlayedGameId = gameId;
  meta.lastPlayedAt = now;

  saveMeta(meta);
}

