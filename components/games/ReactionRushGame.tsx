"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/lib/toast";
import {
  getReactionBestMs,
  setReactionBestMs,
  recordGamePlayed,
} from "@/lib/client-stats";
import { useSessionSummary } from "@/lib/session-summary";
import { usePlaylist } from "@/lib/playlist";
import { GlareHover } from "@/components/GlareHover";
import { getOrCreatePlayerId } from "@/lib/player";

type Status = "idle" | "waiting" | "ready" | "clicked";

async function recordReactionRun(reactionMs: number) {
  const playerId = getOrCreatePlayerId();
  if (!playerId) return;
  // Example mapping: lower ms → higher score (around 0–12000)
  const normalizedScore = Math.max(0, 12000 - reactionMs * 20);
  try {
    await fetch("/api/runs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        playerId,
        gameId: "reaction-rush",
        normalizedScore,
        rawValue: reactionMs,
        rawUnit: "ms",
      }),
    });
  } catch (e) {
    console.error("Failed to record reaction run", e);
  }
}

export function ReactionRushGame() {
  const [status, setStatus] = useState<Status>("idle");
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [history, setHistory] = useState<number[]>([]);
  const [message, setMessage] = useState<string>("Press start to begin.");
  const startTimeRef = useRef<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { toast } = useToast();
  const { openSummary } = useSessionSummary();
  const { onGameCompleted } = usePlaylist();

  useEffect(() => {
    setBestTime(getReactionBestMs());
  }, []);

  useEffect(() => {
    if (bestTime != null) {
      setReactionBestMs(bestTime);
    }
  }, [bestTime]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  function startRun() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setReactionTime(null);
    setMessage("Wait for the tile to glow…");
    setStatus("waiting");

    const delay = 800 + Math.random() * 1700; // 0.8–2.5s
    timeoutRef.current = setTimeout(() => {
      startTimeRef.current = performance.now();
      setStatus("ready");
      setMessage("TAP NOW!");
    }, delay);
  }

  function finishRun(rounded: number, isNewBest: boolean) {
    const prevBest = bestTime;
    const beforeScore =
      prevBest != null ? Math.max(0, 100 - (prevBest - 150)) : null;
    const afterScore = Math.max(0, 100 - (rounded - 150));
    const delta =
      beforeScore != null ? Math.max(0, Math.round(afterScore - beforeScore)) : null;

    openSummary({
      gameId: "reaction-rush",
      title: "Reaction Rush session",
      lines: [
        `Current run: ${rounded} ms`,
        prevBest != null
          ? `Previous best: ${prevBest} ms`
          : "This is your first recorded time.",
        isNewBest
          ? "New best time! ⚡"
          : "Keep grinding to beat your best.",
        delta != null && delta > 0
          ? `Estimated +${delta} rating in reaction.`
          : "No rating change this run.",
      ],
      ctaLabel: "Next: Spray Control",
      ctaHref: "/game/spray-control",
    });

    onGameCompleted("reaction-rush");
  }

  function handleTap() {
    const now = performance.now();
    if (status === "waiting") {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setStatus("clicked");
      setMessage("Too early! Try again.");
      setReactionTime(null);
      toast({
        title: "Too early ⚠️",
        description: "Wait for the tile to glow pink before tapping.",
        variant: "error",
      });
      return;
    }

    if (status === "ready" && startTimeRef.current != null) {
      const diff = now - startTimeRef.current;
      const rounded = Math.round(diff);
      setStatus("clicked");
      setReactionTime(rounded);
      setHistory((prev) => [rounded, ...prev].slice(0, 5));

      setBestTime((prevBest) => {
        const nextBest =
          prevBest == null ? rounded : Math.min(prevBest, rounded);
        const isNewBest = prevBest == null || nextBest < prevBest;
        if (isNewBest) {
          toast({
            title: "New personal best 🎉",
            description: `${nextBest} ms`,
            variant: "success",
          });
        } else {
          toast({
            title: "Nice!",
            description: `${rounded} ms – try to beat your best.`,
            variant: "default",
          });
        }
        finishRun(rounded, isNewBest);
        recordGamePlayed("reaction-rush");
        // NEW: fire-and-forget DB write
        void recordReactionRun(rounded);
        return nextBest;
      });
      setMessage("Nice! Tap start to try again.");
      return;
    }
  }

  // Keyboard: SPACE to tap, ENTER to start
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.code === "Space") {
        e.preventDefault();
        handleTap();
      } else if (e.code === "Enter" && status === "idle") {
        e.preventDefault();
        startRun();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const isRunning = status === "waiting" || status === "ready";

  return (
    <div className="flex flex-col gap-3">
      {/* Main pad */}
      <Card className="flex h-56 flex-col items-center justify-center gap-4">
        {status === "idle" ? (
          <GlareHover
            width="96px"
            height="96px"
            borderRadius="1.75rem"
            glareColor="#ffffff"
            glareOpacity={0.3}
            glareAngle={-30}
            glareSize={300}
            transitionDuration={800}
            playOnce={false}
            className="flex items-center justify-center"
            style={{
              border: "none",
              background: "transparent",
            }}
          >
            <button
              type="button"
              onClick={handleTap}
              className="relative flex h-24 w-24 items-center justify-center rounded-card border border-surface-border dark:border-[#252530] bg-surface-card dark:bg-[#13131A] text-ink-muted dark:text-[#B8B8C8] hover:border-brand-pink-500/60 dark:hover:border-brand-pink-400/60 text-sm font-semibold transition-all duration-150 hover:shadow-lg hover:shadow-brand-pink-500/30 dark:hover:shadow-brand-pink-400/40 active:scale-95 active:shadow-md active:brightness-95"
            >
              <span className="relative z-10">Tap here</span>
            </button>
          </GlareHover>
        ) : (
          <button
            type="button"
            onClick={handleTap}
            className={`
              shine-effect relative flex h-24 w-24 items-center justify-center rounded-card border text-sm font-semibold
              transition-all duration-150 overflow-hidden
              hover:shadow-lg hover:shadow-brand-pink-500/30 dark:hover:shadow-brand-pink-400/40
              active:scale-95 active:shadow-md active:brightness-95
              ${
                status === "ready"
                  ? "border-brand-pink-500 dark:border-brand-pink-400 bg-gradient-to-tr from-brand-pink-500 to-brand-pink-400 text-surface-card dark:text-white shadow-elevated dark:shadow-[0_18px_40px_rgba(230,37,126,0.4)]"
                  : status === "waiting"
                  ? "border-surface-border dark:border-[#252530] bg-surface-subtle dark:bg-[#1A1A24] text-ink-subtle dark:text-[#5A5A6A]"
                  : "border-surface-border dark:border-[#252530] bg-surface-card dark:bg-[#13131A] text-ink-muted dark:text-[#B8B8C8] hover:border-brand-pink-500/60 dark:hover:border-brand-pink-400/60"
              }
            `}
          >
            <span className="relative z-10">
              {status === "ready"
                ? "TAP!"
                : status === "waiting"
                ? "…"
                : "Tap here"}
            </span>
          </button>
        )}
        <p className="max-w-xs text-center text-xs text-ink-soft dark:text-[#8E8E9E]">
          {message}
        </p>
        <Button
          variant={isRunning ? "secondary" : "primary"}
          className="px-4 py-2 text-xs"
          onClick={startRun}
        >
          {isRunning ? "Restart" : "Start run"}
        </Button>
      </Card>

      {/* Stats */}
      <div className="grid gap-3 text-xs md:grid-cols-[minmax(0,1.2fr)_minmax(0,1.3fr)]">
        <Card>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-subtle dark:text-[#5A5A6A]">
            Current run
          </p>
          <div className="mt-3 flex items-baseline gap-4">
            <div>
              <p className="text-[11px] text-ink-soft dark:text-[#8E8E9E]">Reaction time</p>
              <p className="text-lg font-semibold text-ink-primary dark:text-[#F5F5F5]">
                {reactionTime != null ? `${reactionTime} ms` : "—"}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-ink-soft dark:text-[#8E8E9E]">Best time</p>
              <p className="text-sm font-semibold text-success">
                {bestTime != null ? `${bestTime} ms` : "—"}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-subtle dark:text-[#5A5A6A]">
            Last 5 runs
          </p>
          {history.length === 0 ? (
            <p className="mt-3 text-[11px] text-ink-soft dark:text-[#8E8E9E]">
              No runs yet. Start a run and your last 5 reaction times will show
              here.
            </p>
          ) : (
            <ul className="mt-3 space-y-1 text-[11px] text-ink-muted dark:text-[#B8B8C8]">
              {history.map((t, i) => (
                <li key={`${t}-${i}`} className="flex justify-between">
                  <span>Run #{history.length - i}</span>
                  <span className="font-medium text-ink-primary dark:text-[#F5F5F5]">{t} ms</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
