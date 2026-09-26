import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/events", label: "Events" },
  { href: "/schedule", label: "Schedule" },
  { href: "/gallery", label: "Gallery" },
  { href: "/sponsors", label: "Sponsors" },
  { href: "/contact", label: "Contact" }
];

export default function SiteNav() {
  return (
    <header className="border-b border-gold/20 bg-white/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-4">
        <Link href="/" className="font-display text-xl font-bold text-maroon">
          🪔 Navratri Utsav
        </Link>
        <ul className="flex flex-wrap gap-4 text-sm font-medium text-maroon/80">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="hover:text-pink">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
