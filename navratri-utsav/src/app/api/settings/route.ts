import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Public: fetch site-wide content settings for the public pages to render.
export async function GET() {
  const settings = await prisma.websiteSettings.findUnique({ where: { id: 1 } });
  return NextResponse.json({ settings });
}
