"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/lib/toast";
import {
  getDropBestStreak,
  setDropBestStreak,
  recordGamePlayed,
} from "@/lib/client-stats";
import { useSessionSummary } from "@/lib/session-summary";
import { usePlaylist } from "@/lib/playlist";
import { getOrCreatePlayerId, getPlayerName } from "@/lib/player";

type Status = "idle" | "choosing" | "revealed";

type Zone = {
  id: string;
  heat: number;
  loot: number;
  safety: number;
};

async function recordDropRun(bestStreak: number) {
  const playerId = getOrCreatePlayerId();
  const playerName = getPlayerName();
  if (!playerId) return;

  const streak = Math.max(0, bestStreak);
  const normalizedScore = Math.round(streak * 1200); // 0, 1200, 2400, ... ~ good values 6k–10k

  try {
    await fetch("/api/runs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        playerId,
        playerName,
        gameId: "drop-royale",
        normalizedScore,
        rawValue: streak,
        rawUnit: "streak",
      }),
    });
  } catch (e) {
    console.error("Failed to record drop run", e);
  }
}

function generateZones(): Zone[] {
  const names = ["High-rise", "Harbor", "Outpost"];
  return names.map((name) => ({
    id: name,
    heat: Math.floor(Math.random() * 101),
    loot: Math.floor(Math.random() * 101),
    safety: Math.floor(Math.random() * 101),
  }));
}

function zoneScore(zone: Zone): number {
  return zone.loot * 0.5 + zone.safety * 0.3 + (100 - Math.abs(zone.heat - 60)) * 0.2;
}

export function DropRoyaleGame() {
  const [status, setStatus] = useState<Status>("idle");
  const [zones, setZones] = useState<Zone[]>(() => generateZones());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [bestZoneId, setBestZoneId] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreakState] = useState<number | null>(null);
  const { toast } = useToast();
  const { openSummary } = useSessionSummary();
  const { onGameCompleted } = usePlaylist();

  useEffect(() => {
    setBestStreakState(getDropBestStreak());
  }, []);

  useEffect(() => {
    if (bestStreak != null) {
      setDropBestStreak(bestStreak);
    }
  }, [bestStreak]);

  // Compute best zone whenever zones change
  useEffect(() => {
    if (!zones.length) return;
    let best = zones[0];
    for (const z of zones.slice(1)) {
      if (zoneScore(z) > zoneScore(best)) {
        best = z;
      }
    }
    setBestZoneId(best.id);
  }, [zones]);

  function startRound() {
    setZones(generateZones());
    setSelectedId(null);
    setStatus("choosing");
  }

  function handleSelect(zone: Zone) {
    if (status !== "choosing") return;

    setSelectedId(zone.id);
    setStatus("revealed");

    const pickedGood = bestZoneId === zone.id;

    setStreak((prev) => {
      const next = pickedGood ? prev + 1 : 0;
      if (pickedGood) {
        toast({
          title: "Perfect drop 💎",
          description: `Best drop selected. Streak: ${next}.`,
          variant: "success",
        });
      } else {
        toast({
          title: "Spicy drop 🔥",
          description: `You missed the optimal zone. Streak reset.`,
          variant: "default",
        });
      }

      return next;
    });

    setBestStreakState((prev) => {
      const candidate = pickedGood ? streak + 1 : streak;
      const nextBest =
        prev == null ? candidate : Math.max(prev, candidate);
      openSummary({
        gameId: "drop-royale",
        title: "Drop Royale round",
        lines: [
          pickedGood
            ? "You picked the optimal zone this round."
            : "You missed the optimal zone – good learning moment.",
          `Current streak: ${pickedGood ? streak + 1 : 0}`,
          prev != null
            ? `Best streak so far: ${Math.max(prev, pickedGood ? streak + 1 : prev)}`
            : "First few drops just logged.",
        ],
        ctaLabel: "Play again",
        ctaHref: "/game/drop-royale",
      });
      onGameCompleted("drop-royale");
      recordGamePlayed("drop-royale");
      // Record run to database (use the updated best streak)
      void recordDropRun(nextBest);
      return nextBest;
    });
  }

  function nextRound() {
    setZones(generateZones());
    setSelectedId(null);
    setStatus("choosing");
  }

  const isRevealed = status === "revealed";

  return (
    <div className="flex flex-col gap-3">
      <Card>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-subtle dark:text-[#5A5A6A]">
          Drop royale
        </p>
        <p className="mt-1 text-xs text-ink-soft dark:text-[#8E8E9E]">
          Choose your landing zone based on heat, loot and safety. Pick the
          best overall zone to build your streak. Hot drops can be worth it –
          but greedy picks break your streak.
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {zones.map((zone) => {
            const score = zoneScore(zone);
            const isSelected = selectedId === zone.id;
            const isBest = bestZoneId === zone.id;

            const base =
              "flex flex-col gap-2 rounded-card border px-3 py-2 text-xs transition-colors duration-150";

            let stateClasses =
              "border-surface-border dark:border-[#252530] bg-surface-card dark:bg-[#13131A] text-ink-muted dark:text-[#B8B8C8] hover:border-brand-pink-500/40 dark:hover:border-brand-pink-400/40 hover:bg-brand-pink-500/5 dark:hover:bg-brand-pink-500/10";

            if (isSelected) {
              stateClasses =
                "border-brand-pink-500 dark:border-brand-pink-400 bg-brand-pink-500/10 dark:bg-brand-pink-500/20 text-ink-primary dark:text-[#F5F5F5] shadow-card dark:shadow-[0_4px_16px_rgba(230,37,126,0.3)]";
            }

            if (isRevealed && isBest) {
              stateClasses =
                "border-success bg-success/10 dark:bg-success/20 text-ink-primary dark:text-[#F5F5F5] shadow-card dark:shadow-[0_4px_16px_rgba(16,185,129,0.3)]";
            }

            return (
              <button
                key={zone.id}
                type="button"
                onClick={() => handleSelect(zone)}
                className={`${base} ${stateClasses}`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-semibold text-ink-primary dark:text-[#F5F5F5]">
                    {zone.id}
                  </p>
                  {isRevealed && (
                    <span className="text-[11px] text-ink-soft dark:text-[#8E8E9E]">
                      Score: {Math.round(score)}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1 text-[11px] text-ink-muted dark:text-[#B8B8C8]">
                  <span>
                    Heat:{" "}
                    <span className="font-medium text-ink-primary dark:text-[#F5F5F5]">
                      {zone.heat}/100
                    </span>
                  </span>
                  <span>
                    Loot:{" "}
                    <span className="font-medium text-ink-primary dark:text-[#F5F5F5]">
                      {zone.loot}/100
                    </span>
                  </span>
                  <span>
                    Safety:{" "}
                    <span className="font-medium text-ink-primary dark:text-[#F5F5F5]">
                      {zone.safety}/100
                    </span>
                  </span>
                </div>

                {isRevealed && isBest && (
                  <p className="mt-1 text-[11px] text-success">
                    Optimal zone
                  </p>
                )}

                {isRevealed && isSelected && !isBest && (
                  <p className="mt-1 text-[11px] text-danger">
                    Greedy drop – not optimal
                  </p>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] text-ink-soft dark:text-[#8E8E9E]">
          <span>
            Current streak:{" "}
            <span className="font-semibold text-ink-primary dark:text-[#F5F5F5]">
              {streak}
            </span>
          </span>
          <span>
            Best streak:{" "}
            <span className="font-semibold text-success">
              {bestStreak != null ? bestStreak : "—"}
            </span>
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          {status === "idle" ? (
            <Button
              variant="primary"
              className="px-4 py-2 text-xs"
              onClick={startRound}
            >
              Start drop
            </Button>
          ) : (
            <Button
              variant="primary"
              className="px-4 py-2 text-xs"
              onClick={nextRound}
            >
              Next drop
            </Button>
          )}

          <Button
            variant="ghost"
            className="px-3 py-2 text-[11px]"
            onClick={() => {
              setStreak(0);
              setBestStreakState(0);
              setDropBestStreak(0);
              toast({
                title: "Streak reset",
                description: "Your drop streak has been reset locally.",
                variant: "default",
              });
            }}
          >
            Reset streak
          </Button>
        </div>
      </Card>
    </div>
  );
}

