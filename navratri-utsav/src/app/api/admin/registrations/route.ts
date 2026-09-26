import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Admin: search + filter registrations.
// Query params: q (name/mobile/registration number), eventId, status,
// dateFrom, dateTo, page, pageSize
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();
  const eventId = searchParams.get("eventId") ?? undefined;
  const status = searchParams.get("status") ?? undefined;
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize") ?? 25)));

  const where: any = {};
  if (eventId) where.eventId = eventId;
  if (status) where.registrationStatus = status;
  if (dateFrom || dateTo) {
    where.createdAt = {};
    if (dateFrom) where.createdAt.gte = new Date(dateFrom);
    if (dateTo) where.createdAt.lte = new Date(dateTo);
  }
  if (q) {
    where.OR = [
      { fullName: { contains: q, mode: "insensitive" } },
      { mobile: { contains: q, mode: "insensitive" } },
      { registrationNumber: { contains: q, mode: "insensitive" } }
    ];
  }

  const [total, registrations] = await Promise.all([
    prisma.registration.count({ where }),
    prisma.registration.findMany({
      where,
      include: { event: { select: { title: true, slug: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize
    })
  ]);

  return NextResponse.json({ registrations, total, page, pageSize });
}
