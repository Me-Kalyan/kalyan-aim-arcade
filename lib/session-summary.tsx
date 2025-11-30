"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export type SessionSummaryPayload = {
  gameId: string;
  title: string;
  lines: string[];
  ctaLabel?: string;
  ctaHref?: string;
};

type SessionSummaryContextValue = {
  summary: SessionSummaryPayload | null;
  openSummary: (payload: SessionSummaryPayload) => void;
  closeSummary: () => void;
};

const SessionSummaryContext = createContext<
  SessionSummaryContextValue | undefined
>(undefined);

export function SessionSummaryProvider({ children }: { children: ReactNode }) {
  const [summary, setSummary] = useState<SessionSummaryPayload | null>(null);

  const openSummary = useCallback((payload: SessionSummaryPayload) => {
    setSummary(payload);
  }, []);

  const closeSummary = useCallback(() => {
    setSummary(null);
  }, []);

  return (
    <SessionSummaryContext.Provider
      value={{ summary, openSummary, closeSummary }}
    >
      {children}
      <SessionSummaryPortal />
    </SessionSummaryContext.Provider>
  );
}

export function useSessionSummary() {
  const ctx = useContext(SessionSummaryContext);
  if (!ctx) {
    throw new Error("useSessionSummary must be used within SessionSummaryProvider");
  }
  return ctx;
}

function SessionSummaryPortal() {
  const ctx = useContext(SessionSummaryContext);
  if (!ctx || !ctx.summary) return null;
  const { summary, closeSummary } = ctx;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
        {/* Backdrop */}
        <motion.button
          type="button"
          className="absolute inset-0 bg-black/40"
          onClick={closeSummary}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Sheet / Modal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={cn(
            "relative z-50 w-full px-4 pb-4 md:max-w-md md:px-0 md:pb-0"
          )}
        >
          <Card className="rounded-2xl border-surface-border dark:border-[#252530] bg-surface-card dark:bg-[#13131A] shadow-elevated dark:shadow-[0_18px_40px_rgba(0,0,0,0.4)]">
            <div className="flex items-start justify-between gap-2 px-4 pt-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-subtle dark:text-[#5A5A6A]">
                  Session summary
                </p>
                <h2 className="mt-1 text-sm font-semibold text-ink-primary dark:text-[#F5F5F5]">
                  {summary.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeSummary}
                className="text-[11px] text-ink-soft dark:text-[#8E8E9E] hover:text-ink-primary dark:hover:text-[#F5F5F5] transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="space-y-1 px-4 pt-2 pb-3 text-xs text-ink-soft dark:text-[#8E8E9E]">
              {summary.lines.map((line, i) => (
                <p key={i}>• {line}</p>
              ))}
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-surface-borderSoft dark:border-[#252530] px-4 py-2 text-xs">
              <Button variant="ghost" className="px-3 py-1.5" onClick={closeSummary}>
                Close
              </Button>
              {summary.ctaHref && summary.ctaLabel && (
                <a href={summary.ctaHref}>
                  <Button className="px-3 py-1.5">
                    {summary.ctaLabel}
                  </Button>
                </a>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

