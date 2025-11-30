export default function LeaderboardLoading() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header skeleton */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="h-3 w-20 rounded-pill bg-surface-subtle animate-pulse" />
          <div className="h-6 w-56 rounded-pill bg-surface-subtle animate-pulse" />
          <div className="h-3 w-72 max-w-full rounded-pill bg-surface-subtle animate-pulse" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-28 rounded-pill border border-surface-border bg-surface-card animate-pulse" />
          <div className="h-9 w-28 rounded-pill border border-surface-border bg-surface-card animate-pulse" />
        </div>
      </div>
      {/* Table skeleton */}
      <div className="overflow-hidden rounded-card border border-surface-borderSoft bg-surface-card shadow-card">
        {/* Header row */}
        <div className="grid grid-cols-[60px_minmax(0,1.5fr)_minmax(0,1.5fr)_minmax(0,1fr)_60px] border-b border-surface-border bg-surface-subtle px-4 py-3 text-[11px]">
          {["Rank", "Player", "Game", "Score", "Δ"].map((col) => (
            <div
              key={col}
              className="h-3 w-10 rounded-pill bg-surface-card/80 animate-pulse"
            />
          ))}
        </div>
        {/* Rows */}
        <div className="divide-y divide-surface-borderSoft">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-[60px_minmax(0,1.5fr)_minmax(0,1.5fr)_minmax(0,1fr)_60px] px-4 py-3"
            >
              {/* Rank */}
              <div className="flex items-center">
                <div className="h-3 w-8 rounded-pill bg-surface-subtle animate-pulse" />
              </div>
              {/* Player */}
              <div className="flex items-center">
                <div className="h-3 w-24 rounded-pill bg-surface-subtle animate-pulse" />
              </div>
              {/* Game */}
              <div className="flex items-center">
                <div className="h-3 w-24 rounded-pill bg-surface-subtle animate-pulse" />
              </div>
              {/* Score */}
              <div className="flex items-center justify-end">
                <div className="h-3 w-16 rounded-pill bg-surface-subtle animate-pulse" />
              </div>
              {/* Δ */}
              <div className="flex items-center justify-end">
                <div className="h-3 w-8 rounded-pill bg-surface-subtle animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

