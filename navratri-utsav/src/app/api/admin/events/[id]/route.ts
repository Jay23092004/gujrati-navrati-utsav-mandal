import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionFromCookies } from "@/lib/auth";
import { logActivity } from "@/lib/activityLog";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = getSessionFromCookies();
  const body = await req.json().catch(() => ({}));
  const { eventDate, ...rest } = body;

  const event = await prisma.event.update({
    where: { id: params.id },
    data: { ...rest, ...(eventDate ? { eventDate: new Date(eventDate) } : {}) }
  });

  await logActivity({
    adminId: session?.adminId ?? null,
    action: "event.update",
    entityType: "event",
    entityId: event.id
  });

  return NextResponse.json({ event });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = getSessionFromCookies();
  await prisma.event.delete({ where: { id: params.id } });
  await logActivity({
    adminId: session?.adminId ?? null,
    action: "event.delete",
    entityType: "event",
    entityId: params.id
  });
  return NextResponse.json({ ok: true });
}
