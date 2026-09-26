import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const schema = z.object({
  name: z.string().min(1, "Name is required."),
  mobile: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  subject: z.string().optional(),
  message: z.string().min(1, "Message is required.")
});

// Public: submit a contact/enquiry message.
export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input." }, { status: 400 });
  }
  const { email, ...rest } = parsed.data;
  const contactMessage = await prisma.contactMessage.create({
    data: { ...rest, email: email || undefined }
  });
  return NextResponse.json({ contactMessage }, { status: 201 });
}
