import { notFound } from "next/navigation";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import RegistrationForm from "@/components/RegistrationForm";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function EventDetailPage({ params }: { params: { slug: string } }) {
  const event = await prisma.event.findFirst({
    where: { slug: params.slug, status: "PUBLISHED" }
  });
  if (!event) notFound();

  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-3xl px-5 py-14">
        <h1 className="section-title">{event.title}</h1>
        <p className="mt-1 text-gold">
          {new Date(event.eventDate).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
          {event.startTime ? ` · ${event.startTime}` : ""}
          {event.venue ? ` · ${event.venue}` : ""}
        </p>
        {event.ageGroup && <p className="mt-1 text-sm text-maroon/60">Eligibility: {event.ageGroup}</p>}
        {Number(event.registrationFee) > 0 && (
          <p className="mt-1 text-sm font-semibold text-maroon">Registration fee: ₹{Number(event.registrationFee)}</p>
        )}
        <p className="mt-4 whitespace-pre-line text-maroon/80">{event.description}</p>

        <div className="mt-10">
          {event.registrationEnabled ? (
            <RegistrationForm eventId={event.id} eventTitle={event.title} />
          ) : (
            <p className="card text-sm text-maroon/60">Registration is closed for this event.</p>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
