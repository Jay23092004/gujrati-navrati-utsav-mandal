import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import ContactForm from "@/components/ContactForm";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const settings = await prisma.websiteSettings.findUnique({ where: { id: 1 } });

  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-3xl px-5 py-14">
        <h1 className="section-title mb-6">Contact Us</h1>
        <div className="mb-8 text-sm text-maroon/70">
          {settings?.address && <p>{settings.address}</p>}
          {settings?.phone && <p>📞 {settings.phone}</p>}
          {settings?.email && <p>✉️ {settings.email}</p>}
        </div>
        <ContactForm />
      </main>
      <SiteFooter />
    </>
  );
}
