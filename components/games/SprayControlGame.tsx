"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/lib/toast";
import {
  getSprayBestHits,
  setSprayBestHits,
  recordGamePlayed,
} from "@/lib/client-stats";
import { useSessionSummary } from "@/lib/session-summary";
import { usePlaylist } from "@/lib/playlist";
import { getOrCreatePlayerId, getPlayerName } from "@/lib/player";

type Status = "idle" | "running" | "finished";

const TRACK_LENGTH = 5;
const GAME_DURATION_MS = 12000;
const MOVE_INTERVAL_MS = 350;

async function recordSprayRun(hits: number, shots: number) {
  const playerId = getOrCreatePlayerId();
  const playerName = getPlayerName();
  if (!playerId) return;

  const acc = shots === 0 ? 0 : (hits / shots) * 100;
  const accuracyPct = Math.max(0, Math.min(100, Math.round(acc)));

  // Weight hits more, but keep score in the same ballpark as other games
  const normalizedScore = Math.round(hits * 200 + accuracyPct * 40); // typical: 7k–11k

  try {
    await fetch("/api/runs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        playerId,
        playerName,
        gameId: "spray-control",
        normalizedScore,
        rawValue: hits,
        rawUnit: "hits",
      }),
    });
  } catch (e) {
    console.error("Failed to record spray run", e);
  }
}

export function SprayControlGame() {
  const [status, setStatus] = useState<Status>("idle");
  const [targetIndex, setTargetIndex] = useState(0);
  const [hits, setHits] = useState(0);
  const [shots, setShots] = useState(0);
  const [bestHits, setBestHits] = useState<number | null>(null);
  const [remainingMs, setRemainingMs] = useState(GAME_DURATION_MS);
  const moveTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const gameTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { toast } = useToast();
  const { openSummary } = useSessionSummary();
  const { onGameCompleted } = usePlaylist();
  const [focusIndex, setFocusIndex] = useState(0);

  useEffect(() => {
    setBestHits(getSprayBestHits());
  }, []);

  useEffect(() => {
    if (bestHits != null) {
      setSprayBestHits(bestHits);
    }
  }, [bestHits]);

  // Cleanup intervals
  useEffect(() => {
    return () => {
      if (moveTimerRef.current) clearInterval(moveTimerRef.current);
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    };
  }, []);

  function resetState() {
    setHits(0);
    setShots(0);
    setRemainingMs(GAME_DURATION_MS);
    setTargetIndex(0);
  }

  function startGame() {
    resetState();
    setStatus("running");

    // Move target
    if (moveTimerRef.current) clearInterval(moveTimerRef.current);
    moveTimerRef.current = setInterval(() => {
      setTargetIndex((prev) => {
        let next = prev;
        while (next === prev) {
          next = Math.floor(Math.random() * TRACK_LENGTH);
        }
        return next;
      });
    }, MOVE_INTERVAL_MS);

    // Game timer
    const start = performance.now();
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    gameTimerRef.current = setInterval(() => {
      const now = performance.now();
      const elapsed = now - start;
      const remaining = Math.max(0, GAME_DURATION_MS - elapsed);
      setRemainingMs(remaining);

      if (remaining <= 0) {
        if (moveTimerRef.current) clearInterval(moveTimerRef.current);
        if (gameTimerRef.current) clearInterval(gameTimerRef.current);
        setStatus("finished");

        setBestHits((prev) => {
          const nextBest = prev == null ? hits : Math.max(prev, hits);
          if (nextBest > (prev ?? 0)) {
            toast({
              title: "New best spray! 🎯",
              description: `${nextBest} hits in ${GAME_DURATION_MS / 1000}s`,
              variant: "success",
            });
          } else {
            toast({
              title: "Round finished",
              description: `${hits} hits – keep grinding that recoil.`,
              variant: "default",
            });
          }
          const acc = shots === 0 ? 0 : Math.round((hits / shots) * 100);
          openSummary({
            gameId: "spray-control",
            title: "Spray Control session",
            lines: [
              `Hits: ${hits} · Shots: ${shots}`,
              `Accuracy: ${acc}%`,
              prev != null
                ? `Best hits so far: ${Math.max(prev, hits)}`
                : "First recorded drill.",
            ],
            ctaLabel: "Next: Memory Grid",
            ctaHref: "/game/memory-grid",
          });
          onGameCompleted("spray-control");
          recordGamePlayed("spray-control");
          // Record run to database
          void recordSprayRun(hits, shots);
          return nextBest;
        });
      }
    }, 80);
  }

  function handleClick(index: number) {
    if (status !== "running") return;
    setShots((prev) => prev + 1);
    if (index === targetIndex) {
      setHits((prev) => prev + 1);
    }
  }

  // Keyboard controls: Arrow keys to move focus, Space to shoot
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (status !== "running") return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setFocusIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setFocusIndex((prev) => Math.min(TRACK_LENGTH - 1, prev + 1));
      } else if (e.code === "Space") {
        e.preventDefault();
        handleClick(focusIndex);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, focusIndex]);

  const accuracy =
    shots === 0 ? null : Math.round((hits / shots) * 100);

  const secondsLeft = Math.ceil(remainingMs / 1000);

  return (
    <div className="flex flex-col gap-3">
      <Card>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-subtle dark:text-[#5A5A6A]">
          Spray control
        </p>
        <p className="mt-1 text-xs text-ink-soft dark:text-[#8E8E9E]">
          Keep your crosshair on the moving target and click as many times as
          you can before the timer ends. Each hit is one bullet that stayed on
          target.
        </p>

        {/* Track */}
        <div className="mt-4 flex flex-col gap-3">
          <div className="flex items-center justify-between text-[11px] text-ink-soft dark:text-[#8E8E9E]">
            <span>
              Time left:{" "}
              <span className="font-medium text-ink-primary dark:text-[#F5F5F5]">
                {status === "running" ? `${secondsLeft}s` : "—"}
              </span>
            </span>
            <span>
              Hits:{" "}
              <span className="font-medium text-success">
                {hits}
              </span>{" "}
              · Shots:{" "}
              <span className="font-medium text-ink-primary dark:text-[#F5F5F5]">
                {shots}
              </span>{" "}
              · Acc:{" "}
              <span className="font-medium text-ink-primary dark:text-[#F5F5F5]">
                {accuracy != null ? `${accuracy}%` : "—"}
              </span>
            </span>
          </div>

          <div className="flex gap-2 rounded-card bg-surface-subtle dark:bg-[#1A1A24] p-2">
            {Array.from({ length: TRACK_LENGTH }).map((_, i) => {
              const isTarget = i === targetIndex && status === "running";

              const base =
                "flex-1 h-16 rounded-card border transition-colors duration-150 flex items-center justify-center text-[11px]";

              const isFocused = i === focusIndex && status === "running";
              const stateClasses = isTarget
                ? "border-brand-pink-500 dark:border-brand-pink-400 bg-gradient-to-tr from-brand-pink-500 to-brand-pink-400 text-surface-card dark:text-white shadow-card dark:shadow-[0_4px_16px_rgba(230,37,126,0.3)]"
                : isFocused
                ? "border-brand-pink-500/50 dark:border-brand-pink-400/50 bg-surface-subtle dark:bg-[#1A1A24] text-ink-primary dark:text-[#F5F5F5]"
                : "border-surface-border dark:border-[#252530] bg-surface-card dark:bg-[#13131A] text-ink-subtle dark:text-[#5A5A6A]";

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleClick(i)}
                  className={`${base} ${stateClasses}`}
                >
                  {isTarget ? "●" : ""}
                </button>
              );
            })}
          </div>
        </div>

        {/* Controls */}
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          {(status === "idle" || status === "finished") ? (
            <Button
              variant="primary"
              className="px-4 py-2 text-xs"
              onClick={startGame}
            >
              {status === "finished" ? "Play again" : "Start drill"}
            </Button>
          ) : (
            <Button
              variant="secondary"
              className="px-4 py-2 text-xs"
              onClick={() => {
                if (moveTimerRef.current)
                  clearInterval(moveTimerRef.current);
                if (gameTimerRef.current)
                  clearInterval(gameTimerRef.current);
                setStatus("idle");
                resetState();
              }}
            >
              Cancel drill
            </Button>
          )}

          <Button
            variant="ghost"
            className="px-3 py-2 text-[11px]"
            onClick={resetState}
          >
            Reset stats (this session)
          </Button>
        </div>
      </Card>

      {/* Summary */}
      <Card>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-subtle dark:text-[#5A5A6A]">
          Session summary
        </p>
        <div className="mt-3 grid grid-cols-3 gap-3 text-xs">
          <div>
            <p className="text-[11px] text-ink-soft dark:text-[#8E8E9E]">Best hits</p>
            <p className="text-sm font-semibold text-ink-primary dark:text-[#F5F5F5]">
              {bestHits != null ? bestHits : "—"}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-ink-soft dark:text-[#8E8E9E]">Last hits</p>
            <p className="text-sm font-semibold text-success">
              {hits}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-ink-soft dark:text-[#8E8E9E]">Last accuracy</p>
            <p className="text-sm font-semibold text-ink-primary dark:text-[#F5F5F5]">
              {accuracy != null ? `${accuracy}%` : "—"}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

