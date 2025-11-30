import * as React from "react";
import type { LeaderboardEntry } from "@/lib/games";
import { Avatar } from "@/components/ui/Avatar";

export function LeaderboardTable({ entries }: { entries: LeaderboardEntry[] }) {
  return (
    <div className="overflow-hidden rounded-card border border-surface-border dark:border-[#252530] bg-surface-card dark:bg-[#13131A] shadow-md dark:shadow-[0_4px_16px_rgba(0,0,0,0.3)] transition-colors duration-200">
      <table className="min-w-full border-separate border-spacing-0 text-xs">
        <thead>
          <tr className="bg-surface-subtle dark:bg-[#1A1A24] text-[11px] uppercase tracking-[0.18em] text-ink-subtle dark:text-[#5A5A6A]">
            {["Rank", "Player", "Game", "Score", "Δ"].map((col) => (
              <th
                key={col}
                className="border-b border-surface-border dark:border-[#252530] px-4 py-3 text-left first:w-[60px] last:text-right"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {entries.map((row, idx) => (
            <tr
              key={row.rank}
              className={
                idx % 2 === 0 
                  ? "bg-surface-card dark:bg-[#13131A]" 
                  : "bg-surface-subtle/90 dark:bg-[#1A1A24]/50"
              }
            >
              <td className="border-b border-surface-borderSoft dark:border-[#1F1F2E] px-4 py-2 text-[11px] text-ink-soft dark:text-[#8E8E9E]">
                #{row.rank}
              </td>
              <td className="border-b border-surface-borderSoft dark:border-[#1F1F2E] px-4 py-2">
                <div className="flex items-center gap-2">
                  <Avatar name={row.player || "Player"} className="h-7 w-7 text-[10px]" />
                  <span className="text-xs font-medium text-ink-primary dark:text-[#F5F5F5]">
                    {row.player || "Player"}
                  </span>
                </div>
              </td>
              <td className="border-b border-surface-borderSoft dark:border-[#1F1F2E] px-4 py-2 text-[11px] text-ink-muted dark:text-[#B8B8C8]">
                {row.game}
              </td>
              <td className="border-b border-surface-borderSoft dark:border-[#1F1F2E] px-4 py-2 text-right text-xs text-ink-primary dark:text-[#F5F5F5]">
                {row.score.toLocaleString()}
              </td>
              <td className="border-b border-surface-borderSoft dark:border-[#1F1F2E] px-4 py-2 text-right text-[11px]">
                {row.delta == null ? (
                  <span className="text-ink-subtle dark:text-[#5A5A6A]">–</span>
                ) : row.delta > 0 ? (
                  <span className="text-success">+{row.delta}</span>
                ) : row.delta < 0 ? (
                  <span className="text-danger">{row.delta}</span>
                ) : (
                  <span className="text-ink-subtle dark:text-[#5A5A6A]">0</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

