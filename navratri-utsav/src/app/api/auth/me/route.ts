import { NextResponse } from "next/server";
import { getSessionFromCookies, requireActiveAdmin } from "@/lib/auth";

export async function GET() {
  const session = getSessionFromCookies();
  const admin = await requireActiveAdmin(session);
  if (!admin) return NextResponse.json({ admin: null }, { status: 401 });
  return NextResponse.json({
    admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role }
  });
}
