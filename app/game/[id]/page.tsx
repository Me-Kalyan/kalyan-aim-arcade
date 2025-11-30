import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { GAME_DETAILS } from "@/lib/games";
import { ReactionRushGame } from "@/components/games/ReactionRushGame";
import { MemoryGridGame } from "@/components/games/MemoryGridGame";
import { SprayControlGame } from "@/components/games/SprayControlGame";
import { DropRoyaleGame } from "@/components/games/DropRoyaleGame";
import { GameStatsCard } from "@/components/GameStatsCard";

export default function GameDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const game = GAME_DETAILS[params.id];

  if (!game) {
    return notFound();
  }

  const isReactionRush = params.id === "reaction-rush";
  const isMemoryGrid = params.id === "memory-grid";
  const isSprayControl = params.id === "spray-control";
  const isDropRoyale = params.id === "drop-royale";

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Game"
        title={game.name}
        description={game.tagline}
        rightSlot={<Button>Play now</Button>}
      />
      <div className="grid gap-4 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1.2fr)]">
        <section className="space-y-4">
          <Card>
            <h2 className="mb-1 text-sm font-semibold text-ink-primary dark:text-[#F5F5F5]">
              How it works
            </h2>
            <p className="text-sm text-ink-muted dark:text-[#B8B8C8]">{game.description}</p>
          </Card>
          <Card className="border-dashed dark:border-[#252530]">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-subtle dark:text-[#5A5A6A]">
              Game canvas
            </p>
            <p className="text-xs text-ink-soft dark:text-[#8E8E9E]">
              {isReactionRush
                ? "Wait for the tile to glow, then tap as fast as you can. Your best reaction time is saved locally."
                : isMemoryGrid
                ? "Watch the tiles flash in a pattern, then recreate it from memory. Higher levels show more tiles."
                : isSprayControl
                ? "Track the moving target across the lane and click to register hits. Keep your accuracy high over time."
                : isDropRoyale
                ? "Choose the best landing zone using heat, loot and safety. Keep picking the optimal drop to build your streak."
                : "Mount your actual React game component or an iframe here. The box below is sized to feel like a mini-game viewport."}
            </p>
            <div className="mt-3">
              {isReactionRush ? (
                <ReactionRushGame />
              ) : isMemoryGrid ? (
                <MemoryGridGame />
              ) : isSprayControl ? (
                <SprayControlGame />
              ) : isDropRoyale ? (
                <DropRoyaleGame />
              ) : (
                <div className="mt-3 flex h-56 items-center justify-center rounded-2xl border border-surface-border dark:border-[#252530] bg-surface-subtle dark:bg-[#1A1A24] text-[11px] text-ink-subtle dark:text-[#5A5A6A]">
                  Game canvas placeholder
                </div>
              )}
            </div>
          </Card>
        </section>
        <aside className="space-y-4">
          <GameStatsCard gameId={params.id} difficultyLabel={game.difficulty} />
          <Card>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-subtle dark:text-[#5A5A6A]">
              Your best runs
            </p>
            <ul className="space-y-1 text-xs text-ink-muted dark:text-[#B8B8C8]">
              <li>• 9,240 – yesterday</li>
              <li>• 8,730 – 3 days ago</li>
              <li>• 6,010 – last week</li>
            </ul>
          </Card>
        </aside>
      </div>
    </div>
  );
}

