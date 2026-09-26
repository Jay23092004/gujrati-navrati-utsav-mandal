import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const sponsors = await prisma.sponsor.findMany({
    where: { status: "ACTIVE" },
    orderBy: { displayOrder: "asc" }
  });
  return NextResponse.json({ sponsors });
}
