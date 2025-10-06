import { NextResponse } from "next/server";
import { calculateSAW } from "../../lib/madm/saw";
import { calculateWP } from "../../lib/madm/wp";
import { calculateAHP } from "../../lib/madm/ahp";
import { calculateTOPSIS } from "../../lib/madm/topsis";
import { Criterion, Alternative } from "../../lib/madm/types";

export async function POST(req: Request) {
  const body = await req.json();
  const { method, criteria, alternatives } = body as {
    method: string;
    criteria: Criterion[];
    alternatives: Alternative[];
  };

  const methods: Record<string, Function> = {
    SAW: calculateSAW,
    WP: calculateWP,
    AHP: calculateAHP,
    TOPSIS: calculateTOPSIS,
  };

  if (!methods[method]) {
    return NextResponse.json({ error: `Metode ${method} tidak tersedia` }, { status: 400 });
  }

  const result = methods[method](alternatives, criteria);
  return NextResponse.json({ method, result });
}
