import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { eventDate: "asc" }
  });

  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-6xl px-5 py-14">
        <h1 className="section-title mb-6">Events</h1>
        <div className="grid gap-4 md:grid-cols-2">
          {events.map((e) => (
            <Link key={e.id} href={`/events/${e.slug}`} className="card block hover:shadow-md">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold text-maroon">{e.title}</h2>
                {Number(e.registrationFee) > 0 && (
                  <span className="text-sm font-semibold text-gold">₹{Number(e.registrationFee)}</span>
                )}
              </div>
              <p className="text-sm text-gold">
                {new Date(e.eventDate).toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}
                {e.startTime ? ` · ${e.startTime}` : ""}
              </p>
              {e.ageGroup && <p className="mt-1 text-xs text-maroon/60">{e.ageGroup}</p>}
              {!e.registrationEnabled && (
                <p className="mt-1 text-xs font-medium text-maroon/50">Registration closed</p>
              )}
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
