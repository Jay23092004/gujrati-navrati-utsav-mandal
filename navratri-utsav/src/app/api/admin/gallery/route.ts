import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionFromCookies } from "@/lib/auth";
import { logActivity } from "@/lib/activityLog";

export async function GET() {
  const items = await prisma.gallery.findMany({ orderBy: { displayOrder: "asc" } });
  return NextResponse.json({ gallery: items });
}

export async function POST(req: NextRequest) {
  const session = getSessionFromCookies();
  const body = await req.json().catch(() => ({}));
  if (!body.title || !body.imageUrl) {
    return NextResponse.json({ error: "title and imageUrl are required." }, { status: 400 });
  }
  const item = await prisma.gallery.create({ data: body });
  await logActivity({ adminId: session?.adminId ?? null, action: "gallery.create", entityType: "gallery", entityId: item.id });
  return NextResponse.json({ gallery: item }, { status: 201 });
}
