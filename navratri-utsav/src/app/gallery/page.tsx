import Image from "next/image";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const items = await prisma.gallery.findMany({
    where: { status: "ACTIVE" },
    orderBy: { displayOrder: "asc" }
  });

  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-6xl px-5 py-14">
        <h1 className="section-title mb-6">Gallery</h1>
        {items.length === 0 ? (
          <p className="text-maroon/60">No gallery images have been added yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {items.map((img) => (
              <div key={img.id} className="relative aspect-square overflow-hidden rounded-xl bg-gold/10">
                <Image src={img.imageUrl} alt={img.title} fill className="object-cover" />
              </div>
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
