import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const items = await prisma.gallery.findMany({
    where: { status: "ACTIVE" },
    orderBy: { displayOrder: "asc" }
  });
  return NextResponse.json({ gallery: items });
}
