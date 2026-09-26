import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionFromCookies } from "@/lib/auth";
import { logActivity } from "@/lib/activityLog";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = getSessionFromCookies();
  const body = await req.json().catch(() => ({}));
  const sponsor = await prisma.sponsor.update({ where: { id: params.id }, data: body });
  await logActivity({ adminId: session?.adminId ?? null, action: "sponsor.update", entityType: "sponsor", entityId: sponsor.id });
  return NextResponse.json({ sponsor });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = getSessionFromCookies();
  await prisma.sponsor.delete({ where: { id: params.id } });
  await logActivity({ adminId: session?.adminId ?? null, action: "sponsor.delete", entityType: "sponsor", entityId: params.id });
  return NextResponse.json({ ok: true });
}
