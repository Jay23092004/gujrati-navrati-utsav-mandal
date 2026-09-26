import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionFromCookies } from "@/lib/auth";
import { logActivity } from "@/lib/activityLog";

export async function GET() {
  const announcements = await prisma.announcement.findMany({ orderBy: { publishDate: "desc" } });
  return NextResponse.json({ announcements });
}

export async function POST(req: NextRequest) {
  const session = getSessionFromCookies();
  const body = await req.json().catch(() => ({}));
  if (!body.title || !body.description) {
    return NextResponse.json({ error: "title and description are required." }, { status: 400 });
  }
  const announcement = await prisma.announcement.create({
    data: {
      ...body,
      publishDate: body.publishDate ? new Date(body.publishDate) : undefined,
      expiryDate: body.expiryDate ? new Date(body.expiryDate) : undefined
    }
  });
  await logActivity({ adminId: session?.adminId ?? null, action: "announcement.create", entityType: "announcement", entityId: announcement.id });
  return NextResponse.json({ announcement }, { status: 201 });
}
