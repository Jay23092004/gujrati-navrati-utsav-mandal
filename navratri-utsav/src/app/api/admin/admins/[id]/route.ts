import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionFromCookies, requireActiveAdmin, hashPassword } from "@/lib/auth";
import { logActivity } from "@/lib/activityLog";

// Super Admin: disable/enable an admin, change their role, or reset their
// password (issues a temporary password the Super Admin relays out-of-band).
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = getSessionFromCookies();
  const actor = await requireActiveAdmin(session);
  if (!actor || actor.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const data: Record<string, unknown> = {};

  if (body.status === "ACTIVE" || body.status === "DISABLED") data.status = body.status;
  if (body.role === "ADMIN" || body.role === "SUPER_ADMIN") data.role = body.role;
  if (typeof body.name === "string" && body.name.trim()) data.name = body.name.trim();

  let tempPassword: string | undefined;
  if (body.resetPassword) {
    tempPassword = Math.random().toString(36).slice(-10) + "!A1";
    data.passwordHash = await hashPassword(tempPassword);
  }

  const admin = await prisma.admin.update({ where: { id: params.id }, data });

  await logActivity({
    adminId: actor.id,
    action: body.resetPassword ? "admin.reset_password" : "admin.update",
    entityType: "admin",
    entityId: admin.id,
    metadata: { changes: Object.keys(data).filter((k) => k !== "passwordHash") }
  });

  return NextResponse.json({
    admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role, status: admin.status },
    ...(tempPassword ? { tempPassword } : {})
  });
}
