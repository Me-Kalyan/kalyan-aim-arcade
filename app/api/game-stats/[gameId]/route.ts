import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import type { GameDifficulty } from "@/lib/games";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { gameId: string } }
) {
  const { searchParams } = new URL(req.url);
  const difficulty = searchParams.get("difficulty") as GameDifficulty | null;

  const difficultyFilter = difficulty
    ? sql`AND difficulty = ${difficulty}`
    : sql``;

  try {
    const rows = await sql`
      SELECT
        MAX(normalized_score)      AS best_score,
        AVG(normalized_score)      AS avg_score,
        COUNT(*)::int              AS players_online
      FROM runs
      WHERE game_id = ${params.gameId}
      ${difficultyFilter};
    ` as Array<{
      best_score: number | null;
      avg_score: number | null;
      players_online: number;
    }>;

    const row = rows[0] ?? { best_score: 0, avg_score: 0, players_online: 0 };

    return NextResponse.json({
      gameId: params.gameId,
      difficulty: difficulty ?? "All",
      bestScore: Number(row.best_score ?? 0),
      avgScore: Number(row.avg_score ?? 0),
      playersOnline: Number(row.players_online ?? 0),
    });
  } catch (e) {
    console.error("GET /api/game-stats", e);
    return NextResponse.json(
      { error: "Failed to load stats" },
      { status: 500 }
    );
  }
}

