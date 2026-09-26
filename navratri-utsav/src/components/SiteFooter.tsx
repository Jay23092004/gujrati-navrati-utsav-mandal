export default function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-gold/20 bg-maroon py-8 text-center text-sm text-cream/80">
      <p>© {new Date().getFullYear()} Navratri Utsav Mandal. All rights reserved.</p>
      <p className="mt-1">The right to make any changes in the games rests only with the Games Committee.</p>
    </footer>
  );
}
