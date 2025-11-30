import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      playerId,
      playerName,
      gameId,
      normalizedScore,
      rawValue,
      rawUnit,
    } = body as {
      playerId: string;
      playerName?: string;
      gameId: string;
      normalizedScore: number;
      rawValue: number;
      rawUnit: string;
    };

    if (!playerId || !gameId || typeof normalizedScore !== "number") {
      return NextResponse.json(
        { error: "Missing or invalid fields" },
        { status: 400 }
      );
    }

    // Upsert player with optional handle
    await sql`
      INSERT INTO players (id, handle)
      VALUES (${playerId}::uuid, ${playerName ?? null})
      ON CONFLICT (id) DO UPDATE SET
        handle = COALESCE(EXCLUDED.handle, players.handle);
    `;

    // Insert run
    await sql`
      INSERT INTO runs (player_id, game_id, normalized_score, raw_value, raw_unit)
      VALUES (${playerId}::uuid, ${gameId}, ${normalizedScore}, ${rawValue}, ${rawUnit});
    `;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("POST /api/runs failed", err);
    return NextResponse.json(
      { error: "Failed to store run" },
      { status: 500 }
    );
  }
}

