import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: { gameId: string } }
) {
  const gameId = params.gameId;
  try {
    const agg = await sql`
      SELECT
        MAX(normalized_score) AS best_score,
        AVG(normalized_score) AS avg_score
      FROM runs
      WHERE game_id = ${gameId};
    ` as Array<{
      best_score: number | null;
      avg_score: number | null;
    }>;

    const online = await sql`
      SELECT COUNT(DISTINCT player_id) AS players_online
      FROM runs
      WHERE game_id = ${gameId}
        AND created_at > NOW() - INTERVAL '5 minutes';
    ` as Array<{ players_online: number }>;

    const best = agg[0]?.best_score;
    const avg = agg[0]?.avg_score;
    const playersOnline = Number(online[0]?.players_online ?? 0);

    return NextResponse.json({
      gameId,
      bestScore: best != null ? Math.round(best) : null,
      avgScore: avg != null ? Math.round(avg) : null,
      playersOnline,
    });
  } catch (err) {
    console.error("GET /api/game-stats failed", err);
    return NextResponse.json(
      { error: "Failed to load stats" },
      { status: 500 }
    );
  }
}

