import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionFromCookies } from "@/lib/auth";
import { logActivity } from "@/lib/activityLog";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = getSessionFromCookies();
  const body = await req.json().catch(() => ({}));
  const { publishDate, expiryDate, ...rest } = body;
  const announcement = await prisma.announcement.update({
    where: { id: params.id },
    data: {
      ...rest,
      ...(publishDate ? { publishDate: new Date(publishDate) } : {}),
      ...(expiryDate ? { expiryDate: new Date(expiryDate) } : {})
    }
  });
  await logActivity({ adminId: session?.adminId ?? null, action: "announcement.update", entityType: "announcement", entityId: announcement.id });
  return NextResponse.json({ announcement });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = getSessionFromCookies();
  await prisma.announcement.delete({ where: { id: params.id } });
  await logActivity({ adminId: session?.adminId ?? null, action: "announcement.delete", entityType: "announcement", entityId: params.id });
  return NextResponse.json({ ok: true });
}
