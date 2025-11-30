"use client";

import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ALL_GAMES } from "@/lib/games";
import { useToast } from "@/lib/toast";
import { useArcadeRating } from "@/lib/arcade-rating";
import { useAchievements } from "@/lib/achievements";
import { loadClientStats } from "@/lib/client-stats";
import { useEffect, useState } from "react";
import { getOrCreatePlayerId, getPlayerName, setPlayerName } from "@/lib/player";

function gameLabelFromId(id: string): string {
  switch (id) {
    case "reaction-rush":
      return "Reaction Rush";
    case "memory-grid":
      return "Memory Grid";
    case "spray-control":
      return "Spray Control";
    case "drop-royale":
      return "Drop Royale";
    default:
      return id;
  }
}

function timeAgoLabel(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const diffMs = Date.now() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffDays <= 0) {
    if (diffHours <= 1) return "Just now";
    return `${diffHours}h ago`;
  }
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
}

type GameStat = {
  gameId: string;
  bestScore: number;
  runs: number;
  lastPlayed: string;
  rating: number;
};

type RecentRun = {
  game: string;
  score: number;
  label: string; // "Yesterday", "3 days ago", etc.
};

type ProfileStats = {
  totalGames: number;
  arcadeRating: number;
  perGame: GameStat[];
  recentRuns: RecentRun[];
};

function useProfileStats(): ProfileStats | null {
  const [data, setData] = useState<ProfileStats | null>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const playerId = getOrCreatePlayerId();
    async function load() {
      try {
        const res = await fetch(`/api/profile/${playerId}`);
        if (!res.ok) return;
        const json = await res.json();
        const recent: RecentRun[] = (json.recentRuns ?? []).map(
          (r: { game_id: string; normalized_score: number | null; created_at: string }) => ({
            game: gameLabelFromId(r.game_id),
            score: Number(r.normalized_score ?? 0),
            label: timeAgoLabel(r.created_at),
          })
        );
        setData({
          totalGames: json.totalGames,
          arcadeRating: json.arcadeRating,
          perGame: json.perGame,
          recentRuns: recent,
        });
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, []);
  return data;
}

function useEditableName() {
  const [name, setName] = useState<string>("");

  useEffect(() => {
    const existing = getPlayerName();
    if (existing) setName(existing);
  }, []);

  function save(newName: string) {
    setPlayerName(newName);
    setName(newName.trim());
    // Trigger a custom event to update nav
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("playerNameUpdated"));
    }
  }

  return { name, save, setName };
}

export default function ProfilePage() {
  const { toast } = useToast();
  const rating = useArcadeRating();
  const { unlockedList } = useAchievements();
  const favouriteGames = ALL_GAMES.slice(0, 3);
  const [clientStats, setClientStats] = useState<ReturnType<typeof loadClientStats> | null>(null);
  const stats = useProfileStats();
  const { name, save, setName } = useEditableName();
  const [playerId, setPlayerId] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setMounted(true);
    setPlayerId(getOrCreatePlayerId());
    setClientStats(loadClientStats());
  }, []);

  const totalGames = stats?.totalGames ?? 0;
  const arcadeRating = stats?.arcadeRating ?? 0;
  const recentRuns = stats?.recentRuns ?? [];
  const reaction = stats?.perGame.find((g) => g.gameId === "reaction-rush");
  const memory = stats?.perGame.find((g) => g.gameId === "memory-grid");
  const spray = stats?.perGame.find((g) => g.gameId === "spray-control");
  const drop = stats?.perGame.find((g) => g.gameId === "drop-royale");

  const [hasName, setHasName] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setHasName(!!getPlayerName());
  }, [name]);

  const hasRating = arcadeRating > 0 || rating.combinedScore != null;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Profile"
        title="Your arcade profile."
        description="Manage your identity, see your best scores and favourite games."
      />
      {/* Name input section */}
      <section className="max-w-xl">
        <Card>
          <h2 className="text-lg font-semibold text-ink-primary dark:text-[#F5F5F5] mb-2">
            Your profile
          </h2>
          <p className="text-sm text-ink-muted dark:text-[#B8B8C8]">
            Choose a display name. This will appear on the leaderboard and your recent runs.
          </p>
          <form
            className="mt-4 flex gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (!name.trim()) return;
              save(name);
              toast({
                title: "Name saved",
                description: "Your display name has been updated.",
                variant: "success",
              });
            }}
          >
            <input
              className="flex-1 rounded-full bg-surface-subtle dark:bg-[#1A1A24] px-4 py-2 text-sm outline-none border border-surface-border dark:border-[#252530] focus:border-brand-pink-500/80 dark:focus:border-brand-pink-400/80 text-ink-primary dark:text-[#F5F5F5] transition-colors"
              placeholder="Enter a name or a nickname"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Button
              type="submit"
              className="px-4 py-2 text-sm font-semibold"
            >
              Save
            </Button>
          </form>
          {mounted && playerId && (
            <p className="mt-2 text-xs text-ink-soft dark:text-[#8E8E9E]">
              Player ID: <span className="font-mono opacity-70">{playerId.slice(0, 8)}…</span>
            </p>
          )}
        </Card>
      </section>
      {hasName ? (
        <>
          <section className="grid gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1.6fr)]">
            {/* Left column – user summary */}
            <Card variant="elevated" className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-pink-500 to-brand-pink-400 text-sm font-semibold text-surface-card dark:text-white shadow-brand">
                  {name.charAt(0).toUpperCase() || "?"}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-ink-primary dark:text-[#F5F5F5]">
                    {name || "Unnamed Player"}
                  </span>
                  {mounted && playerId && (
                    <span className="text-[11px] text-ink-soft dark:text-[#8E8E9E]">
                      Player ID: {playerId.slice(0, 8)}…
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-card bg-surface-subtle dark:bg-[#1A1A24] px-3 py-2 text-xs transition-colors duration-200">
                <div>
                  <p className="text-[11px] text-ink-soft dark:text-[#8E8E9E]">
                    Total games played
                  </p>
                  <p className="text-sm font-semibold text-ink-primary dark:text-[#F5F5F5]">
                    {totalGames || (clientStats
                      ? clientStats.totalReactionRuns +
                        clientStats.totalMemoryRounds +
                        clientStats.totalSprayDrills +
                        clientStats.totalDropRounds
                      : 0)}
                  </p>
                  {clientStats?.lastPlayedGameId && (
                    <p className="text-[11px] text-ink-soft dark:text-[#8E8E9E] mt-1">
                      Last played: {clientStats.lastPlayedGameId.replace("-", " ")}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-[11px] text-ink-soft dark:text-[#8E8E9E]">
                    Arcade rating
                  </p>
                  {hasRating ? (
                    <p className="text-sm font-semibold text-brand-pink-500 dark:text-brand-pink-400">
                      {arcadeRating || rating.combinedScore || 0} / 100
                    </p>
                  ) : (
                    <p className="text-sm text-ink-subtle dark:text-[#5A5A6A]">
                      Play any game to unlock
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  className="px-3 py-1.5 text-[11px]"
                >
                  View full history
                </Button>
              </div>
              {hasRating && (
                <div className="grid grid-cols-2 gap-3 text-[11px] text-ink-soft dark:text-[#8E8E9E]">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-ink-primary dark:text-[#F5F5F5]">
                      Reaction Rush
                    </p>
                    <p className="mt-1">
                      Best:{" "}
                      {reaction?.bestScore != null
                        ? reaction.bestScore.toLocaleString()
                        : rating.reactionBestMs != null
                        ? `${rating.reactionBestMs} ms`
                        : "—"}
                    </p>
                    <p>
                      Score:{" "}
                      {reaction?.rating != null
                        ? `${reaction.rating}/100`
                        : rating.reactionScore != null
                        ? `${rating.reactionScore}/100`
                        : "—"}
                    </p>
                    <p className="mt-1 text-ink-subtle dark:text-[#5A5A6A]">
                      Skill: Aim / Reaction
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-ink-primary dark:text-[#F5F5F5]">
                      Memory Grid
                    </p>
                    <p className="mt-1">
                      Best:{" "}
                      {memory?.bestScore != null
                        ? memory.bestScore.toLocaleString()
                        : rating.memoryBestAccuracy != null
                        ? `${rating.memoryBestAccuracy}%`
                        : "—"}
                    </p>
                    <p>
                      Score:{" "}
                      {memory?.rating != null
                        ? `${memory.rating}/100`
                        : rating.memoryScore != null
                        ? `${rating.memoryScore}/100`
                        : "—"}
                    </p>
                    <p className="mt-1 text-ink-subtle dark:text-[#5A5A6A]">
                      Skill: Memory / Focus
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-ink-primary dark:text-[#F5F5F5]">
                      Spray Control
                    </p>
                    <p className="mt-1">
                      Best:{" "}
                      {spray?.bestScore != null
                        ? spray.bestScore.toLocaleString()
                        : rating.sprayBestHits != null
                        ? `${rating.sprayBestHits} hits`
                        : "—"}
                    </p>
                    <p>
                      Score:{" "}
                      {spray?.rating != null
                        ? `${spray.rating}/100`
                        : rating.sprayScore != null
                        ? `${rating.sprayScore}/100`
                        : "—"}
                    </p>
                    <p className="mt-1 text-ink-subtle dark:text-[#5A5A6A]">
                      Skill: Aim / Tracking
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-ink-primary dark:text-[#F5F5F5]">
                      Drop Royale
                    </p>
                    <p className="mt-1">
                      Best:{" "}
                      {drop?.bestScore != null
                        ? drop.bestScore.toLocaleString()
                        : rating.dropBestStreak != null
                        ? `${rating.dropBestStreak} streak`
                        : "—"}
                    </p>
                    <p>
                      Score:{" "}
                      {drop?.rating != null
                        ? `${drop.rating}/100`
                        : rating.dropScore != null
                        ? `${rating.dropScore}/100`
                        : "—"}
                    </p>
                    <p className="mt-1 text-ink-subtle dark:text-[#5A5A6A]">
                      Skill: Decision / Macro
                    </p>
                  </div>
                </div>
              )}
            </Card>
            {/* Right column – recent runs */}
            <div className="space-y-4">
              <Card>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-subtle dark:text-[#5A5A6A]">
                Recent runs
              </p>
              <ul className="mt-3 space-y-2 text-xs text-ink-muted dark:text-[#B8B8C8]">
                {recentRuns.length === 0 ? (
                  <li className="text-[11px] text-ink-soft dark:text-[#8E8E9E]">
                    No runs yet. Play a game to see your recent scores here.
                  </li>
                ) : (
                  recentRuns.map((run) => (
                    <li
                      key={`${run.game}-${run.score}-${run.label}`}
                      className="flex items-center justify-between rounded-card bg-surface-subtle dark:bg-[#1A1A24] px-3 py-2 transition-colors duration-200"
                    >
                      <span className="text-[11px] font-medium text-ink-primary dark:text-[#F5F5F5]">
                        {run.game}
                      </span>
                      <span className="text-[11px] text-ink-soft dark:text-[#8E8E9E]">
                        {run.score.toLocaleString()} – {run.label}
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </Card>
            {/* Achievements */}
            <Card>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-subtle dark:text-[#5A5A6A]">
                Achievements
              </p>
              {unlockedList.length === 0 ? (
                <p className="mt-2 text-xs text-ink-soft dark:text-[#8E8E9E]">
                  Play a few games to unlock your first achievements.
                </p>
              ) : (
                <ul className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
                  {unlockedList.map((ach) => (
                    <li
                      key={ach.id}
                      className="flex items-start gap-2 rounded-card bg-surface-subtle dark:bg-[#1A1A24] px-3 py-2 transition-colors duration-200"
                    >
                      <span className="mt-[1px] text-base">
                        {ach.icon ?? "🏅"}
                      </span>
                      <div>
                        <p className="text-xs font-semibold text-ink-primary dark:text-[#F5F5F5]">
                          {ach.title}
                        </p>
                        <p className="text-[11px] text-ink-soft dark:text-[#8E8E9E]">
                          {ach.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
            </div>
          </section>
          {/* Favourite games */}
          <section className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-subtle dark:text-[#5A5A6A]">
              Favourite games
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {favouriteGames.map((game) => (
                <Card key={game.id} className="p-0 overflow-hidden cursor-pointer">
                  <button
                    type="button"
                    onClick={() =>
                      (window.location.href = `/game/${game.id}`)
                    }
                    className="flex w-full flex-col items-stretch text-left transition-transform duration-150 active:scale-[0.98]"
                  >
                    <div className="h-16 rounded-card bg-gradient-to-tr from-game-valorant-from/60 to-game-valorant-to/40" />
                    <div className="space-y-1 px-4 py-3">
                      <p className="text-sm font-semibold text-ink-primary dark:text-[#F5F5F5]">
                        {game.name}
                      </p>
                      <p className="text-[11px] text-ink-soft dark:text-[#8E8E9E]">
                        {game.tagline}
                      </p>
                    </div>
                  </button>
                </Card>
              ))}
            </div>
          </section>
        </>
      ) : (
        <section className="max-w-md">
          <Card>
            <p className="text-sm font-semibold text-ink-primary dark:text-[#F5F5F5]">
              Set your name to see your profile
            </p>
            <p className="mt-1 text-sm text-ink-soft dark:text-[#8E8E9E]">
              Enter a display name above to see your stats, leaderboard rankings, and recent runs.
            </p>
          </Card>
        </section>
      )}
    </div>
  );
}

