"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { GameCard } from "@/components/GameCard";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { ALL_GAMES } from "@/lib/games";
import { useArcadeRating } from "@/lib/arcade-rating";
import { usePlaylist } from "@/lib/playlist";
import { loadClientStats } from "@/lib/client-stats";
import { useGameStats } from "@/hooks/useGameStats";
import { hasProfile } from "@/lib/player";
import { useLeaderboard } from "@/hooks/useLeaderboard";

function getDailyIndex(length: number): number {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  const d = now.getDate();
  const seed = y * 10000 + m * 100 + d;
  return seed % length;
}

export default function HomePage() {
  const rating = useArcadeRating();
  const { startWarmup } = usePlaylist();
  const [featuredId, setFeaturedId] = useState<string | null>(null);
  const [clientStats, setClientStats] = useState<ReturnType<typeof loadClientStats> | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setClientStats(loadClientStats());
  }, []);

  useEffect(() => {
    // If user has personal ratings, prefer reaction/memory
    if (rating.reactionScore != null || rating.memoryScore != null) {
      let bestGameId: string | null = null;
      let bestScore = -1;

      if (rating.reactionScore != null) {
        bestGameId = "reaction-rush";
        bestScore = rating.reactionScore;
      }

      if (
        rating.memoryScore != null &&
        rating.memoryScore > bestScore
      ) {
        bestGameId = "memory-grid";
        bestScore = rating.memoryScore;
      }

      if (bestGameId) {
        setFeaturedId(bestGameId);
        return;
      }
    }

    // Fallback: deterministic game-of-the-day
    const idx = getDailyIndex(ALL_GAMES.length);
    setFeaturedId(ALL_GAMES[idx].id);
  }, [rating.reactionScore, rating.memoryScore]);

  const featuredGame = useMemo(
    () =>
      ALL_GAMES.find((g) => g.id === featuredId) ??
      ALL_GAMES[0],
    [featuredId]
  );

  const otherGames = useMemo(
    () => ALL_GAMES.filter((g) => g.id !== featuredGame.id),
    [featuredGame.id]
  );

  const statsRR = useGameStats("reaction-rush");
  const statsMG = useGameStats("memory-grid");
  const statsSC = useGameStats("spray-control");
  const statsDR = useGameStats("drop-royale");

  const topPlayers = useLeaderboard(4, 8000, "All");
  const router = useRouter();

  function handleStartWarmup() {
    if (!hasProfile()) {
      router.push("/profile");
    } else {
      startWarmup();
    }
  }

  function handlePlayNow(gameId: string) {
    if (!hasProfile()) {
      router.push("/profile");
    } else {
      router.push(`/game/${gameId}`);
    }
  }

  const skills = [
    { id: "reaction", label: "Aim · Reaction", score: rating.reactionScore },
    { id: "memory", label: "Memory · Focus", score: rating.memoryScore },
    { id: "spray", label: "Aim · Tracking", score: rating.sprayScore },
    { id: "decision", label: "Decision · Macro", score: rating.dropScore },
  ];
  const knownSkills = skills.filter((s) => s.score != null);
  const weakest =
    knownSkills.length > 0
      ? knownSkills.reduce((min, s) => (s.score! < (min.score ?? 999) ? s : min))
      : null;

  return (
    <div className="flex flex-col gap-6">
      {/* Hero */}
      <section>
        <PageHeader
          eyebrow="Dashboard"
          title="Jump back into the stream-ready arcade."
          description="Tiny games inspired by real esports titles. Warm up between matches and climb the global leaderboard."
          rightSlot={
            <>
              <Button onClick={handleStartWarmup}>Start warmup</Button>
              <Link href="/games" className="hidden sm:inline-flex">
                <Button variant="secondary">Browse games</Button>
              </Link>
              <Link href="/leaderboard" className="hidden sm:inline-flex">
                <Button variant="secondary">View leaderboard</Button>
              </Link>
            </>
          }
        />
        {/* Featured game of the day */}
        <div className="grid gap-4 md:grid-cols-[minmax(0,1.7fr)_minmax(0,1.3fr)]">
          <div className="space-y-3">
            <Card variant="elevated">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-subtle">
                    Featured game of the day
                  </p>
                  <h2 className="text-sm font-semibold text-ink-primary">
                    {featuredGame.name}
                  </h2>
                  <p className="text-xs text-ink-soft max-w-sm">
                    {featuredGame.tagline}
                  </p>
                  <div className="mt-1 text-[11px] text-ink-soft">
                    <span className="mr-3">
                      Difficulty:{" "}
                      <span className="font-medium text-ink-primary">
                        {featuredGame.difficulty}
                      </span>
                    </span>
                    <span className="mr-3">
                      Players online:{" "}
                      <span className="font-medium text-success">
                        {(() => {
                          const stats = featuredGame.id === "reaction-rush" ? statsRR :
                                       featuredGame.id === "memory-grid" ? statsMG :
                                       featuredGame.id === "spray-control" ? statsSC :
                                       featuredGame.id === "drop-royale" ? statsDR : null;
                          return stats?.playersOnline ?? 0;
                        })().toLocaleString()}
                      </span>
                    </span>
                    <span>
                      Best score{" "}
                      <span className="font-semibold">
                        {(() => {
                          const stats = featuredGame.id === "reaction-rush" ? statsRR :
                                       featuredGame.id === "memory-grid" ? statsMG :
                                       featuredGame.id === "spray-control" ? statsSC :
                                       featuredGame.id === "drop-royale" ? statsDR : null;
                          return stats?.bestScore != null
                            ? stats.bestScore.toLocaleString()
                            : "—";
                        })()}
                      </span>
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 text-right">
                  <Button 
                    className="px-4 py-2 text-xs"
                    onClick={() => handlePlayNow(featuredGame.id)}
                  >
                    Play now
                  </Button>
                  <Link
                    href="/games"
                    className="text-[11px] text-ink-soft hover:text-ink-primary"
                  >
                    View all games →
                  </Link>
                </div>
              </div>
            </Card>
            {/* Continue playing (other games) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[11px] text-ink-soft">
                <span>Continue playing</span>
                <Link
                  href="/games"
                  className="text-xs font-medium text-brand-pink-500 hover:text-brand-pink-400"
                >
                  View all games →
                </Link>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {otherGames.slice(0, 3).map((game) => {
                  const stats = game.id === "reaction-rush" ? statsRR :
                               game.id === "memory-grid" ? statsMG :
                               game.id === "spray-control" ? statsSC :
                               game.id === "drop-royale" ? statsDR : null;
                  return (
                    <GameCard
                      key={game.id}
                      game={{
                        ...game,
                        playersOnline: stats?.playersOnline ?? game.playersOnline,
                        bestScore: stats?.bestScore ?? game.bestScore,
                      }}
                      onClick={() => handlePlayNow(game.id)}
                    />
                  );
                })}
              </div>
            </div>
          </div>
          {/* Leaderboard preview */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[11px] text-ink-soft">
              <span>Top players (global)</span>
              <Link
                href="/leaderboard"
                className="text-xs font-medium text-brand-pink-500 hover:text-brand-pink-400"
              >
                Full leaderboard →
              </Link>
            </div>
            <LeaderboardTable entries={topPlayers.map((row) => ({
              rank: row.rank,
              player: row.handle || "Player",
              game: row.game_id.replace(/-/g, " "),
              score: row.best_score,
              delta: undefined,
            }))} />
          </div>
        </div>
      </section>
      {/* Weakest skill coach */}
      {knownSkills.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between text-[11px] text-ink-soft dark:text-[#8E8E9E]">
            <span>Skill overview</span>
          </div>
          <Card>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-subtle dark:text-[#5A5A6A]">
                  Your skill profile
                </p>
                {weakest ? (
                  <p className="mt-1 text-xs text-ink-soft dark:text-[#8E8E9E]">
                    Strongest in{" "}
                    <span className="font-medium text-ink-primary dark:text-[#F5F5F5]">
                      {
                        skills.reduce((max, s) =>
                          (s.score ?? 0) > (max.score ?? -1) ? s : max
                        ).label
                      }
                    </span>
                    . Weakest in{" "}
                    <span className="font-medium text-brand-pink-500 dark:text-brand-pink-400">
                      {weakest.label}
                    </span>
                    . Recommended next game is tuned for that.
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-ink-soft dark:text-[#8E8E9E]">
                    Play a few games to see your skill breakdown.
                  </p>
                )}
              </div>
              {weakest && (
                <a
                  href={
                    weakest.id === "reaction"
                      ? "/game/reaction-rush"
                      : weakest.id === "memory"
                      ? "/game/memory-grid"
                      : weakest.id === "spray"
                      ? "/game/spray-control"
                      : "/game/drop-royale"
                  }
                >
                  <Button className="px-3 py-1.5 text-xs">
                    Play recommended game
                  </Button>
                </a>
              )}
            </div>
            <div className="mt-3 grid gap-2 text-[11px] sm:grid-cols-4">
              {skills.map((s) => (
                <div key={s.id}>
                  <p className="text-[11px] text-ink-soft dark:text-[#8E8E9E]">{s.label}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="h-1.5 flex-1 rounded-full bg-surface-subtle dark:bg-[#1A1A24]">
                      <div
                        className="h-1.5 rounded-full bg-brand-pink-500 dark:bg-brand-pink-400"
                        style={{ width: `${s.score ?? 0}%` }}
                      />
                    </div>
                    <span className="w-10 text-right text-[11px] text-ink-primary dark:text-[#F5F5F5]">
                      {s.score != null ? `${s.score}` : "—"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {clientStats && (
              <p className="mt-2 text-[11px] text-ink-subtle dark:text-[#5A5A6A]">
                Played: RR {clientStats.totalReactionRuns} · MG{" "}
                {clientStats.totalMemoryRounds} · SC{" "}
                {clientStats.totalSprayDrills} · DR{" "}
                {clientStats.totalDropRounds}
              </p>
            )}
          </Card>
        </section>
      )}
    </div>
  );
}
