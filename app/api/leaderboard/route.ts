import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import type { GameDifficulty } from "@/lib/games";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const difficultyParam = searchParams.get("difficulty");
    
    type DifficultyFilter = GameDifficulty | "All";
    const difficulty: DifficultyFilter = 
      difficultyParam === "Easy" || difficultyParam === "Hard" 
        ? difficultyParam 
        : difficultyParam === "All" 
        ? "All" 
        : "All";

    // Build difficulty filter
    const difficultyFilter = 
      difficulty === "All" 
        ? sql`` 
        : sql`AND r.difficulty = ${difficulty}`;

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
      WHERE 1=1
      ${difficultyFilter}
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

