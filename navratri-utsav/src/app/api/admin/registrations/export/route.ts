import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Admin: CSV export honoring the same filters as the list endpoint.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get("eventId") ?? undefined;
  const status = searchParams.get("status") ?? undefined;

  const where: any = {};
  if (eventId) where.eventId = eventId;
  if (status) where.registrationStatus = status;

  const registrations = await prisma.registration.findMany({
    where,
    include: { event: { select: { title: true } } },
    orderBy: { createdAt: "desc" }
  });

  const headers = [
    "Registration Number", "Event", "Full Name", "Mobile", "Email", "Age",
    "Gender", "City", "Participants", "Payment Status", "Registration Status",
    "Remarks", "Registered At"
  ];

  const escapeCsv = (val: unknown) => {
    const s = val === null || val === undefined ? "" : String(val);
    return `"${s.replace(/"/g, '""')}"`;
  };

  const rows = registrations.map((r) =>
    [
      r.registrationNumber, r.event.title, r.fullName, r.mobile, r.email ?? "",
      r.age ?? "", r.gender ?? "", r.city ?? "", r.participants, r.paymentStatus,
      r.registrationStatus, r.remarks ?? "", r.createdAt.toISOString()
    ].map(escapeCsv).join(",")
  );

  const csv = [headers.map(escapeCsv).join(","), ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="registrations-${Date.now()}.csv"`
    }
  });
}
