import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { verifyPassword, signSession, setSessionCookie } from "@/lib/auth";
import { logActivity } from "@/lib/activityLog";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }
  const { email, password } = parsed.data;

  const admin = await prisma.admin.findUnique({ where: { email } });

  // Same generic error whether the email doesn't exist or the password is
  // wrong, so login can't be used to enumerate admin accounts.
  const genericError = NextResponse.json({ error: "Invalid email or password." }, { status: 401 });

  if (!admin) return genericError;
  if (admin.status !== "ACTIVE") {
    return NextResponse.json({ error: "This account has been disabled." }, { status: 403 });
  }

  const valid = await verifyPassword(password, admin.passwordHash);
  if (!valid) return genericError;

  const token = signSession({ adminId: admin.id, email: admin.email, role: admin.role as any });
  setSessionCookie(token);

  await prisma.admin.update({ where: { id: admin.id }, data: { lastLogin: new Date() } });
  await logActivity({ adminId: admin.id, action: "admin.login" });

  return NextResponse.json({
    admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role }
  });
}
