import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    const rows = await sql`
      SELECT
        player_id,
        COALESCE(
          (SELECT handle FROM players p WHERE p.id = r.player_id),
          'Player ' || SUBSTRING(player_id::text, 1, 4)
        ) AS handle,
        MAX(normalized_score) AS best_score,
        MIN(game_id)          AS game_id,
        DENSE_RANK() OVER (ORDER BY MAX(normalized_score) DESC) AS rank
      FROM runs r
      GROUP BY player_id
      ORDER BY best_score DESC
      LIMIT 100;
    ` as Array<{
      player_id: string;
      handle: string | null;
      best_score: number;
      game_id: string;
      rank: number;
    }>;
    return NextResponse.json({ entries: rows });
  } catch (err) {
    console.error("GET /api/leaderboard failed", err);
    return NextResponse.json(
      { error: "Failed to load leaderboard" },
      { status: 500 }
    );
  }
}

