"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { GameCard } from "@/components/GameCard";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { ALL_GAMES, GLOBAL_LEADERBOARD } from "@/lib/games";
import { useArcadeRating } from "@/lib/arcade-rating";

function getDailyIndex(length: number): number {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  const d = now.getDate();
  const seed = y * 10000 + m * 100 + d;
  return seed % length;
}

export default function PreviewPage() {
  const rating = useArcadeRating();
  const [featuredId, setFeaturedId] = useState<string | null>(null);

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

  const topEntries = GLOBAL_LEADERBOARD.slice(0, 4);

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
              <Link href="/games">
                <Button>Browse games</Button>
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
                    <span>
                      Players online:{" "}
                      <span className="font-medium text-success">
                        {featuredGame.playersOnline.toLocaleString()}
                      </span>
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 text-right">
                  <Link href={`/game/${featuredGame.id}`}>
                    <Button className="px-4 py-2 text-xs">
                      Play now
                    </Button>
                  </Link>
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
                {otherGames.slice(0, 3).map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    onClick={() =>
                      (window.location.href = `/game/${game.id}`)
                    }
                  />
                ))}
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
            <LeaderboardTable entries={topEntries} />
          </div>
        </div>
      </section>
    </div>
  );
}

