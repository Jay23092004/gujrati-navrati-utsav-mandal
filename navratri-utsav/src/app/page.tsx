import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [settings, upcomingEvents, announcements] = await Promise.all([
    prisma.websiteSettings.findUnique({ where: { id: 1 } }),
    prisma.event.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { eventDate: "asc" },
      take: 4
    }),
    prisma.announcement.findMany({
      where: { status: "ACTIVE" },
      orderBy: { priority: "desc" },
      take: 3
    })
  ]);

  return (
    <>
      <SiteNav />
      <main>
        <section className="bg-gradient-to-b from-pink/10 to-cream px-5 py-16 text-center">
          <h1 className="font-display text-4xl font-bold text-maroon md:text-5xl">
            {settings?.heroTitle ?? "Navratri Utsav"}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-maroon/70">
            {settings?.heroSubtitle ?? "Nine nights of Garba, games and community celebration."}
          </p>
          {settings?.venue && <p className="mt-2 text-sm text-gold">📍 {settings.venue}</p>}
          <div className="mt-8 flex justify-center gap-3">
            <Link href="/events" className="btn-primary">See Events</Link>
            <Link href="/schedule" className="rounded-full border border-maroon px-6 py-2.5 font-semibold text-maroon">
              Full Schedule
            </Link>
          </div>
        </section>

        {announcements.length > 0 && (
          <section className="mx-auto max-w-6xl px-5 py-10">
            <h2 className="section-title mb-4">Announcements</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {announcements.map((a) => (
                <div key={a.id} className="card">
                  <h3 className="font-semibold text-maroon">{a.title}</h3>
                  <p className="mt-1 text-sm text-maroon/70">{a.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mx-auto max-w-6xl px-5 py-10">
          <h2 className="section-title mb-4">Upcoming Events</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {upcomingEvents.map((e) => (
              <Link key={e.id} href={`/events/${e.slug}`} className="card block hover:shadow-md">
                <h3 className="font-display text-lg font-semibold text-maroon">{e.title}</h3>
                <p className="text-sm text-gold">
                  {new Date(e.eventDate).toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}
                  {e.startTime ? ` · ${e.startTime}` : ""}
                </p>
                <p className="mt-2 text-sm text-maroon/70">{e.description?.slice(0, 100)}...</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
