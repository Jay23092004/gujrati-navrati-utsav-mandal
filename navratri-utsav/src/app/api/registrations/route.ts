import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const schema = z.object({
  eventId: z.string().min(1),
  fullName: z.string().min(1, "Full name is required."),
  mobile: z.string().min(7, "A valid mobile number is required."),
  email: z.string().email().optional().or(z.literal("")),
  age: z.number().int().positive().optional(),
  gender: z.string().optional(),
  city: z.string().optional(),
  participants: z.number().int().positive().default(1)
});

function generateRegistrationNumber() {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `GNUM-${stamp}-${rand}`;
}

// Public: submit a registration for an event. No auth required.
export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input." }, { status: 400 });
  }
  const data = parsed.data;

  const event = await prisma.event.findUnique({ where: { id: data.eventId } });
  if (!event || event.status !== "PUBLISHED" || !event.registrationEnabled) {
    return NextResponse.json({ error: "Registration is not open for this event." }, { status: 400 });
  }

  const registration = await prisma.registration.create({
    data: {
      registrationNumber: generateRegistrationNumber(),
      eventId: data.eventId,
      fullName: data.fullName,
      mobile: data.mobile,
      email: data.email || undefined,
      age: data.age,
      gender: data.gender,
      city: data.city,
      participants: data.participants,
      paymentStatus: event.registrationFee && Number(event.registrationFee) > 0 ? "PENDING" : "NOT_APPLICABLE",
      registrationStatus: "PENDING"
    }
  });

  return NextResponse.json({ registration }, { status: 201 });
}
