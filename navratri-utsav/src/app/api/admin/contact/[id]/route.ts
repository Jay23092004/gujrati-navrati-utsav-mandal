import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionFromCookies } from "@/lib/auth";
import { logActivity } from "@/lib/activityLog";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = getSessionFromCookies();
  const body = await req.json().catch(() => ({}));
  const message = await prisma.contactMessage.update({ where: { id: params.id }, data: body });
  await logActivity({ adminId: session?.adminId ?? null, action: "contact.update", entityType: "contact_message", entityId: message.id });
  return NextResponse.json({ message });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = getSessionFromCookies();
  await prisma.contactMessage.delete({ where: { id: params.id } });
  await logActivity({ adminId: session?.adminId ?? null, action: "contact.delete", entityType: "contact_message", entityId: params.id });
  return NextResponse.json({ ok: true });
}
