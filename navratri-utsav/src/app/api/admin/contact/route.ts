import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") ?? undefined;
  const messages = await prisma.contactMessage.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json({ messages });
}
