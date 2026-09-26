import { NextResponse } from "next/server";
import { getSessionFromCookies, clearSessionCookie } from "@/lib/auth";
import { logActivity } from "@/lib/activityLog";

export async function POST() {
  const session = getSessionFromCookies();
  clearSessionCookie();
  if (session) {
    await logActivity({ adminId: session.adminId, action: "admin.logout" });
  }
  return NextResponse.json({ ok: true });
}
