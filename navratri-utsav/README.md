# Navratri Utsav — Database & Admin Platform

A full-stack scaffold built from the supplied PRD: a Next.js public website plus a
secured admin panel, backed by PostgreSQL via Prisma. Retains the maroon/pink/gold/cream
visual identity and DM Sans / Playfair Display typography named in the PRD's design
reference, and seeds real events from the supplied Games Schedule.

## Stack
- **Frontend + backend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Database**: PostgreSQL via Prisma ORM
- **Auth**: httpOnly JWT session cookie, bcrypt-hashed passwords, role-based access
  (Super Admin / Admin)
- **Storage**: image URLs are stored in Postgres; actual files go to an object storage
  provider of your choice (Cloudinary, S3, Supabase Storage, Firebase Storage) — wire
  your provider's upload flow in and paste the resulting URL into the Gallery/Sponsors
  admin forms. No provider is hard-wired here, matching the PRD's "select during
  implementation" note.

## Getting started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up your environment**
   ```bash
   cp .env.example .env
   ```
   Fill in:
   - `DATABASE_URL` — your PostgreSQL connection string
   - `JWT_SECRET` — a long random string (e.g. `openssl rand -hex 32`)
   - `ADMIN_EMAIL` / `ADMIN_INITIAL_PASSWORD` — used **once** by the seed script to
     create your first Super Admin. Change the password immediately after first login,
     then you can remove these two lines from `.env`.

3. **Create the database schema**
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Seed the initial admin + games schedule**
   ```bash
   npm run prisma:seed
   ```
   This creates your Super Admin account and publishes all 16 events from the supplied
   Games Schedule (Musical Chair through Debate, including the Maha Ashtami no-games
   day) dated Oct 11–20. Update the year/dates in `prisma/seed.ts` or from the Admin
   Panel once real dates are confirmed.

5. **Run it**
   ```bash
   npm run dev
   ```
   - Public site: http://localhost:3000
   - Admin login: http://localhost:3000/admin/login

## What's implemented

- **Public site**: Home, About, Events (list + detail with registration form),
  Schedule (grouped by day), Gallery, Sponsors, Contact — all database-driven.
- **Registration system**: public visitors submit registrations per event; each gets
  an auto-generated registration number. Payment status auto-set to Pending when a
  fee applies.
- **Admin Panel** (`/admin/*`, protected by middleware + per-route session checks):
  - Dashboard with the 8 stat cards from PRD §7
  - Events: create/publish/unpublish/delete
  - Registrations: search (name/mobile/reg. number), filter by status, inline status
    change (Pending/Confirmed/Cancelled/Rejected), CSV export
  - Gallery, Sponsors, Announcements, Contact Enquiries: CRUD
  - Website Settings: edit hero content, venue, contact details, social links
  - Admin Users (**Super Admin only**): create admins, disable/enable accounts,
    change roles, reset passwords
  - Activity Logs: every create/update/delete and status change is recorded with
    admin, action, entity and timestamp

## Security notes (per PRD §11–12, §18)

- Passwords are hashed with bcrypt (cost factor 12) — never stored or logged in
  plain text.
- The admin session is a JWT in an `httpOnly`, `sameSite=lax` cookie — never exposed
  to client-side JavaScript.
- `middleware.ts` blocks unauthenticated requests to `/admin/*` and `/api/admin/*`
  before they reach a page or handler; each admin route handler additionally
  re-verifies the session against the database so a disabled admin's existing token
  stops working immediately, not just at next login.
- `ADMIN_EMAIL` / `ADMIN_INITIAL_PASSWORD` are read only by the one-time seed script
  from environment variables — they are never hard-coded into HTML, React, or any
  client-side bundle.
- All secrets (`DATABASE_URL`, `JWT_SECRET`, storage credentials) stay server-side via
  `.env` — none are prefixed `NEXT_PUBLIC_`, so none reach the browser bundle.

## What you still need to do before production

- Pick and wire an object storage provider for real image uploads (currently the
  Gallery/Sponsors admin forms accept a pre-hosted image URL).
- Point `DATABASE_URL` at your production Postgres instance and run
  `npx prisma migrate deploy`.
- Set a strong, unique `JWT_SECRET` and rotate `ADMIN_INITIAL_PASSWORD` immediately
  after first login.
- Add rate limiting / brute-force protection on `/api/auth/login` before going public.
- Confirm final event dates/times and update them from Admin → Events (the seeded
  dates are placeholders based on the supplied schedule).

## Project structure

```
prisma/schema.prisma      Database schema (9 tables per PRD §9)
prisma/seed.ts            Seeds the first Super Admin + all 16 games-schedule events
src/lib/auth.ts            Password hashing, JWT sign/verify, session cookie helpers
src/lib/db.ts               Prisma client singleton
src/lib/activityLog.ts      Activity log writer used by every admin mutation
src/middleware.ts          Protects /admin and /api/admin routes
src/app/api/...            Public + admin REST API routes (see PRD §10)
src/app/(public pages)      Home, About, Events, Schedule, Gallery, Sponsors, Contact
src/app/admin/...          Admin Panel pages (login, dashboard, and each module)
src/components/            Shared nav/footer/forms/admin shell
```
