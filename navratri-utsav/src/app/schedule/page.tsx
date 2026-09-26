import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function SchedulePage() {
  const events = await prisma.event.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { eventDate: "asc" }
  });

  const byDate = events.reduce<Record<string, typeof events>>((acc, e) => {
    const key = e.eventDate.toISOString().slice(0, 10);
    (acc[key] ??= []).push(e);
    return acc;
  }, {});

  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-4xl px-5 py-14">
        <h1 className="section-title mb-6">Program Schedule</h1>
        <div className="space-y-8">
          {Object.entries(byDate).map(([date, dayEvents]) => (
            <div key={date}>
              <h2 className="font-display text-lg font-semibold text-gold">
                {new Date(date).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
              </h2>
              <div className="mt-2 divide-y divide-gold/10 rounded-xl border border-gold/20 bg-white">
                {dayEvents.map((e) => (
                  <div key={e.id} className="flex items-center justify-between px-4 py-3">
                    <div>
                      <p className="font-medium text-maroon">{e.title}</p>
                      {e.ageGroup && <p className="text-xs text-maroon/60">{e.ageGroup}</p>}
                    </div>
                    <span className="text-sm text-gold">{e.startTime || "—"}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
