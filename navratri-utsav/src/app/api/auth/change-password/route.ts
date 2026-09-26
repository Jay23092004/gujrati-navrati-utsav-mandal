import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSessionFromCookies, requireActiveAdmin, verifyPassword, hashPassword } from "@/lib/auth";
import { logActivity } from "@/lib/activityLog";

const schema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8, "New password must be at least 8 characters.")
});

export async function POST(req: NextRequest) {
  const session = getSessionFromCookies();
  const admin = await requireActiveAdmin(session);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input." }, { status: 400 });
  }

  const ok = await verifyPassword(parsed.data.currentPassword, admin.passwordHash);
  if (!ok) return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });

  const passwordHash = await hashPassword(parsed.data.newPassword);
  await prisma.admin.update({ where: { id: admin.id }, data: { passwordHash } });
  await logActivity({ adminId: admin.id, action: "admin.change_password" });

  return NextResponse.json({ ok: true });
}
