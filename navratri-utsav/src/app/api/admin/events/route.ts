import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSessionFromCookies } from "@/lib/auth";
import { logActivity } from "@/lib/activityLog";

const createSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  ageGroup: z.string().optional(),
  registrationFee: z.number().optional(),
  eventDate: z.string(), // ISO date
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  venue: z.string().optional(),
  imageUrl: z.string().optional(),
  registrationEnabled: z.boolean().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  displayOrder: z.number().optional()
});

// Admin: list ALL events regardless of status, for the admin table.
export async function GET() {
  const events = await prisma.event.findMany({
    orderBy: [{ eventDate: "asc" }, { displayOrder: "asc" }],
    include: { _count: { select: { registrations: true } } }
  });
  return NextResponse.json({ events });
}

export async function POST(req: NextRequest) {
  const session = getSessionFromCookies();
  const parsed = createSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input." }, { status: 400 });
  }
  const data = parsed.data;

  const event = await prisma.event.create({
    data: { ...data, eventDate: new Date(data.eventDate) }
  });

  await logActivity({
    adminId: session?.adminId ?? null,
    action: "event.create",
    entityType: "event",
    entityId: event.id
  });

  return NextResponse.json({ event }, { status: 201 });
}
