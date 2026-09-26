import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const event = await prisma.event.findFirst({
    where: { OR: [{ id: params.id }, { slug: params.id }], status: "PUBLISHED" }
  });
  if (!event) return NextResponse.json({ error: "Event not found." }, { status: 404 });
  return NextResponse.json({ event });
}
