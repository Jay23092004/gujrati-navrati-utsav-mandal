import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [
    totalRegistrations,
    todayRegistrations,
    pendingRegistrations,
    confirmedRegistrations,
    totalEnquiries,
    upcomingEvents,
    activeAnnouncements,
    galleryCount
  ] = await Promise.all([
    prisma.registration.count(),
    prisma.registration.count({ where: { createdAt: { gte: startOfToday } } }),
    prisma.registration.count({ where: { registrationStatus: "PENDING" } }),
    prisma.registration.count({ where: { registrationStatus: "CONFIRMED" } }),
    prisma.contactMessage.count(),
    prisma.event.count({ where: { status: "PUBLISHED", eventDate: { gte: new Date() } } }),
    prisma.announcement.count({ where: { status: "ACTIVE" } }),
    prisma.gallery.count()
  ]);

  return NextResponse.json({
    totalRegistrations,
    todayRegistrations,
    pendingRegistrations,
    confirmedRegistrations,
    totalEnquiries,
    upcomingEvents,
    activeAnnouncements,
    galleryCount
  });
}
