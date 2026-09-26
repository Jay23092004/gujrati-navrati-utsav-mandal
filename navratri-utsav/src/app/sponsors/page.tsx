import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function SponsorsPage() {
  const sponsors = await prisma.sponsor.findMany({
    where: { status: "ACTIVE" },
    orderBy: { displayOrder: "asc" }
  });

  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-5xl px-5 py-14">
        <h1 className="section-title mb-6">Our Sponsors</h1>
        {sponsors.length === 0 ? (
          <p className="text-maroon/60">Sponsor details will appear here soon.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {sponsors.map((s) => (
              <a key={s.id} href={s.websiteUrl ?? "#"} className="card block text-center hover:shadow-md">
                <p className="font-display font-semibold text-maroon">{s.name}</p>
                {s.category && <p className="text-xs text-gold">{s.category}</p>}
              </a>
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
