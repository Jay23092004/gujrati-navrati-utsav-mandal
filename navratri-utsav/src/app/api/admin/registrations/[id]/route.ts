import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSessionFromCookies } from "@/lib/auth";
import { logActivity } from "@/lib/activityLog";

const updateSchema = z.object({
  registrationStatus: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "REJECTED"]).optional(),
  paymentStatus: z.enum(["NOT_APPLICABLE", "PENDING", "PAID", "REFUNDED"]).optional(),
  remarks: z.string().optional(),
  fullName: z.string().optional(),
  mobile: z.string().optional(),
  email: z.string().optional(),
  city: z.string().optional(),
  participants: z.number().int().positive().optional()
});

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = getSessionFromCookies();
  const parsed = updateSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input." }, { status: 400 });
  }

  const before = await prisma.registration.findUnique({ where: { id: params.id } });
  const registration = await prisma.registration.update({
    where: { id: params.id },
    data: parsed.data
  });

  // Status changes get their own log entry with before/after, per PRD 16.
  if (parsed.data.registrationStatus && before && before.registrationStatus !== parsed.data.registrationStatus) {
    await logActivity({
      adminId: session?.adminId ?? null,
      action: "registration.status_change",
      entityType: "registration",
      entityId: registration.id,
      metadata: { from: before.registrationStatus, to: parsed.data.registrationStatus }
    });
  } else {
    await logActivity({
      adminId: session?.adminId ?? null,
      action: "registration.update",
      entityType: "registration",
      entityId: registration.id
    });
  }

  return NextResponse.json({ registration });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = getSessionFromCookies();
  await prisma.registration.delete({ where: { id: params.id } });
  await logActivity({
    adminId: session?.adminId ?? null,
    action: "registration.delete",
    entityType: "registration",
    entityId: params.id
  });
  return NextResponse.json({ ok: true });
}
