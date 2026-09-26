import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Public: list published events, soonest first.
export async function GET() {
  const events = await prisma.event.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ eventDate: "asc" }, { displayOrder: "asc" }]
  });
  return NextResponse.json({ events });
}
