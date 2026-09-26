import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionFromCookies } from "@/lib/auth";
import { logActivity } from "@/lib/activityLog";

export async function GET() {
  const sponsors = await prisma.sponsor.findMany({ orderBy: { displayOrder: "asc" } });
  return NextResponse.json({ sponsors });
}

export async function POST(req: NextRequest) {
  const session = getSessionFromCookies();
  const body = await req.json().catch(() => ({}));
  if (!body.name) return NextResponse.json({ error: "name is required." }, { status: 400 });
  const sponsor = await prisma.sponsor.create({ data: body });
  await logActivity({ adminId: session?.adminId ?? null, action: "sponsor.create", entityType: "sponsor", entityId: sponsor.id });
  return NextResponse.json({ sponsor }, { status: 201 });
}
