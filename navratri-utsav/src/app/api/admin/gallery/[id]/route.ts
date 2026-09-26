import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionFromCookies } from "@/lib/auth";
import { logActivity } from "@/lib/activityLog";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = getSessionFromCookies();
  const body = await req.json().catch(() => ({}));
  const item = await prisma.gallery.update({ where: { id: params.id }, data: body });
  await logActivity({ adminId: session?.adminId ?? null, action: "gallery.update", entityType: "gallery", entityId: item.id });
  return NextResponse.json({ gallery: item });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = getSessionFromCookies();
  await prisma.gallery.delete({ where: { id: params.id } });
  await logActivity({ adminId: session?.adminId ?? null, action: "gallery.delete", entityType: "gallery", entityId: params.id });
  return NextResponse.json({ ok: true });
}
