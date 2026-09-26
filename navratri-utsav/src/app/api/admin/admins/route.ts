import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSessionFromCookies, requireActiveAdmin, hashPassword } from "@/lib/auth";
import { logActivity } from "@/lib/activityLog";

const createSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters."),
  role: z.enum(["SUPER_ADMIN", "ADMIN"]).default("ADMIN")
});

// Only a Super Admin may list or create administrator accounts.
export async function GET() {
  const session = getSessionFromCookies();
  const actor = await requireActiveAdmin(session);
  if (!actor || actor.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const admins = await prisma.admin.findMany({
    select: { id: true, name: true, email: true, role: true, status: true, lastLogin: true, createdAt: true },
    orderBy: { createdAt: "asc" }
  });
  return NextResponse.json({ admins });
}

export async function POST(req: NextRequest) {
  const session = getSessionFromCookies();
  const actor = await requireActiveAdmin(session);
  if (!actor || actor.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = createSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input." }, { status: 400 });
  }
  const { password, ...rest } = parsed.data;

  const existing = await prisma.admin.findUnique({ where: { email: rest.email } });
  if (existing) return NextResponse.json({ error: "An admin with this email already exists." }, { status: 409 });

  const passwordHash = await hashPassword(password);
  const admin = await prisma.admin.create({ data: { ...rest, passwordHash } });

  await logActivity({ adminId: actor.id, action: "admin.create", entityType: "admin", entityId: admin.id });

  return NextResponse.json(
    { admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role, status: admin.status } },
    { status: 201 }
  );
}
