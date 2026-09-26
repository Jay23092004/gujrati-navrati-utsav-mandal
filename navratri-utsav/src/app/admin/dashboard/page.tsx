"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";

type Stats = {
  totalRegistrations: number;
  todayRegistrations: number;
  pendingRegistrations: number;
  confirmedRegistrations: number;
  totalEnquiries: number;
  upcomingEvents: number;
  activeAnnouncements: number;
  galleryCount: number;
};

const cards: { key: keyof Stats; label: string }[] = [
  { key: "totalRegistrations", label: "Total Registrations" },
  { key: "todayRegistrations", label: "Today's Registrations" },
  { key: "pendingRegistrations", label: "Pending Registrations" },
  { key: "confirmedRegistrations", label: "Confirmed Registrations" },
  { key: "totalEnquiries", label: "Total Enquiries" },
  { key: "upcomingEvents", label: "Upcoming Events" },
  { key: "activeAnnouncements", label: "Active Announcements" },
  { key: "galleryCount", label: "Gallery Images" }
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((r) => r.json())
      .then(setStats);
  }, []);

  return (
    <AdminShell>
      <h1 className="font-display text-2xl font-bold text-maroon">Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.key} className="card">
            <p className="text-3xl font-bold text-pink">{stats ? stats[c.key] : "—"}</p>
            <p className="mt-1 text-sm text-maroon/60">{c.label}</p>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
