export default function GameDetailLoading() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header skeleton */}
      <div className="mb-2 space-y-2">
        <div className="h-3 w-24 rounded-pill bg-surface-subtle animate-pulse" />
        <div className="h-6 w-48 rounded-pill bg-surface-subtle animate-pulse" />
        <div className="h-3 w-80 max-w-full rounded-pill bg-surface-subtle animate-pulse" />
      </div>
      <div className="grid gap-4 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1.2fr)]">
        {/* Left: content */}
        <div className="space-y-4">
          {/* How it works card */}
          <div className="rounded-card border border-surface-borderSoft bg-surface-card px-6 py-5 shadow-card">
            <div className="mb-3 h-4 w-32 rounded-pill bg-surface-subtle animate-pulse" />
            <div className="space-y-2">
              <div className="h-3 w-full rounded-pill bg-surface-subtle animate-pulse" />
              <div className="h-3 w-4/5 rounded-pill bg-surface-subtle animate-pulse" />
              <div className="h-3 w-3/5 rounded-pill bg-surface-subtle animate-pulse" />
            </div>
          </div>
          {/* Canvas card */}
          <div className="rounded-card border border-dashed border-surface-border bg-surface-card px-6 py-5 shadow-card">
            <div className="mb-3 h-3 w-32 rounded-pill bg-surface-subtle animate-pulse" />
            <div className="h-3 w-3/5 rounded-pill bg-surface-subtle animate-pulse mb-3" />
            <div className="mt-2 flex h-56 items-center justify-center rounded-2xl border border-surface-border bg-surface-subtle/60">
              <div className="h-8 w-32 rounded-pill bg-surface-card/60 animate-pulse" />
            </div>
          </div>
        </div>
        {/* Right: stats + runs */}
        <div className="space-y-4">
          {/* Stats card */}
          <div className="rounded-card border border-surface-borderSoft bg-surface-card px-6 py-5 shadow-card">
            <div className="mb-3 h-3 w-24 rounded-pill bg-surface-subtle animate-pulse" />
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-1">
                  <div className="h-3 w-16 rounded-pill bg-surface-subtle animate-pulse" />
                  <div className="h-4 w-20 rounded-pill bg-surface-subtle animate-pulse" />
                </div>
              ))}
            </div>
          </div>
          {/* Runs card */}
          <div className="rounded-card border border-surface-borderSoft bg-surface-card px-6 py-5 shadow-card">
            <div className="mb-3 h-3 w-32 rounded-pill bg-surface-subtle animate-pulse" />
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-card bg-surface-subtle px-3 py-2"
                >
                  <div className="space-y-1">
                    <div className="h-3 w-24 rounded-pill bg-surface-card/60 animate-pulse" />
                    <div className="h-3 w-16 rounded-pill bg-surface-card/60 animate-pulse" />
                  </div>
                  <div className="h-4 w-12 rounded-pill bg-surface-card/60 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

