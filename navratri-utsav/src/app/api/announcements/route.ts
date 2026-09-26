import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const now = new Date();
  const announcements = await prisma.announcement.findMany({
    where: {
      status: "ACTIVE",
      publishDate: { lte: now },
      OR: [{ expiryDate: null }, { expiryDate: { gte: now } }]
    },
    orderBy: [{ priority: "desc" }, { publishDate: "desc" }]
  });
  return NextResponse.json({ announcements });
}
