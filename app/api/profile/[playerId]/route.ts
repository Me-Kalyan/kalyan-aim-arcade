import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: { playerId: string } }
) {
  const playerId = params.playerId;

  if (!playerId) {
    return NextResponse.json(
      { error: "Missing playerId" },
      { status: 400 }
    );
  }

  try {
    const playerResult = await sql`
      SELECT id, handle, created_at
      FROM players
      WHERE id = ${playerId}::uuid;
    ` as Array<{
      id: string;
      handle: string | null;
      created_at: string;
    }>;
    const [player] = playerResult;

    const totalsResult = await sql`
      SELECT COUNT(*)::int AS total_games
      FROM runs
      WHERE player_id = ${playerId}::uuid;
    ` as Array<{ total_games: number }>;
    const [totals] = totalsResult;

    const perGame = await sql`
      SELECT
        game_id,
        MAX(normalized_score)        AS best_score,
        COUNT(*)::int               AS runs,
        MAX(created_at)             AS last_played
      FROM runs
      WHERE player_id = ${playerId}::uuid
      GROUP BY game_id;
    ` as Array<{
      game_id: string;
      best_score: number;
      runs: number;
      last_played: string;
    }>;

    // 👇 NEW: last 5 runs for "Recent runs" list
    const recentRuns = await sql`
      SELECT game_id, normalized_score, created_at
      FROM runs
      WHERE player_id = ${playerId}::uuid
      ORDER BY created_at DESC
      LIMIT 5;
    ` as Array<{
      game_id: string;
      normalized_score: number;
      created_at: string;
    }>;

    const MAX_SCORE = 12000;

    const perGameRatings = perGame.map((g) => {
      const best = Number(g.best_score || 0);
      const rating = Math.max(
        0,
        Math.min(100, Math.round((best / MAX_SCORE) * 100))
      );
      return {
        gameId: g.game_id,
        bestScore: best,
        runs: Number(g.runs),
        lastPlayed: g.last_played,
        rating,
      };
    });

    const arcadeRating =
      perGameRatings.length > 0
        ? Math.round(
            perGameRatings.reduce((sum, g) => sum + g.rating, 0) /
              perGameRatings.length
          )
        : 0;

    return NextResponse.json({
      player: player ?? null,
      totalGames: Number(totals?.total_games ?? 0),
      arcadeRating,
      perGame: perGameRatings,
      recentRuns, // 👈 send raw recent runs back
    });
  } catch (err) {
    console.error("GET /api/profile failed", err);
    return NextResponse.json(
      { error: "Failed to load profile" },
      { status: 500 }
    );
  }
}

