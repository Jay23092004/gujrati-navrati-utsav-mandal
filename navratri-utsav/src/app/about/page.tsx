import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export default function AboutPage() {
  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-3xl px-5 py-14">
        <h1 className="section-title mb-4">About the Utsav</h1>
        <p className="text-maroon/80">
          Our Navratri Utsav brings the community together for nine nights of Garba, cultural
          programs, games and celebration. Edit this page&apos;s content from the Admin Panel
          under Website Settings.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
