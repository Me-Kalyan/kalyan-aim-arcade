import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      playerId,
      gameId,
      normalizedScore,
      rawValue,
      rawUnit,
    } = body as {
      playerId: string;
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

    // Ensure player row exists
    await sql`
      INSERT INTO players (id)
      VALUES (${playerId}::uuid)
      ON CONFLICT (id) DO NOTHING;
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

