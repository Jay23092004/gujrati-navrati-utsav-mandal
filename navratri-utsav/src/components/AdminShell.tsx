"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/registrations", label: "Registrations" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/sponsors", label: "Sponsors" },
  { href: "/admin/announcements", label: "Announcements" },
  { href: "/admin/contact", label: "Contact Enquiries" },
  { href: "/admin/settings", label: "Website Settings" },
  { href: "/admin/admins", label: "Admin Users" },
  { href: "/admin/logs", label: "Activity Logs" }
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-cream">
      <aside className="hidden w-56 flex-shrink-0 border-r border-gold/20 bg-maroon text-cream md:block">
        <div className="px-5 py-5 font-display text-lg font-bold">🪔 Admin Panel</div>
        <nav className="flex flex-col gap-1 px-3">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-lg px-3 py-2 text-sm ${
                pathname === l.href ? "bg-pink text-white" : "text-cream/80 hover:bg-white/10"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <button onClick={logout} className="mx-3 mt-6 rounded-lg px-3 py-2 text-left text-sm text-cream/70 hover:bg-white/10">
          Log out
        </button>
      </aside>
      <main className="min-w-0 flex-1 p-6">{children}</main>
    </div>
  );
}
