import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionFromCookies } from "@/lib/auth";
import { logActivity } from "@/lib/activityLog";

export async function GET() {
  const settings = await prisma.websiteSettings.findUnique({ where: { id: 1 } });
  return NextResponse.json({ settings });
}

export async function PUT(req: NextRequest) {
  const session = getSessionFromCookies();
  const body = await req.json().catch(() => ({}));
  delete body.id;
  const settings = await prisma.websiteSettings.upsert({
    where: { id: 1 },
    update: body,
    create: { id: 1, ...body }
  });
  await logActivity({ adminId: session?.adminId ?? null, action: "settings.update", entityType: "website_settings", entityId: "1" });
  return NextResponse.json({ settings });
}
