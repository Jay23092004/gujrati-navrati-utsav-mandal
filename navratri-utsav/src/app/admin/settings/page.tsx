"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";

export default function AdminSettingsPage() {
  const [form, setForm] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings").then((r) => r.json()).then((d) => setForm(d.settings ?? {}));
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const fields: [string, string][] = [
    ["siteName", "Site name"], ["heroTitle", "Hero title"], ["heroSubtitle", "Hero subtitle"],
    ["venue", "Venue"], ["phone", "Phone"], ["email", "Email"], ["address", "Address"],
    ["facebookUrl", "Facebook URL"], ["instagramUrl", "Instagram URL"], ["mapUrl", "Map URL"],
    ["footerText", "Footer text"]
  ];

  return (
    <AdminShell>
      <h1 className="font-display text-2xl font-bold text-maroon">Website Settings</h1>
      <form onSubmit={save} className="card mt-4 grid gap-3 sm:grid-cols-2">
        {fields.map(([key, label]) => (
          <div key={key}>
            <label className="mb-1 block text-xs text-maroon/60">{label}</label>
            <input
              value={form[key] ?? ""}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="w-full rounded-lg border border-gold/30 px-3 py-2"
            />
          </div>
        ))}
        <button className="btn-primary sm:col-span-2">{saved ? "Saved!" : "Save Settings"}</button>
      </form>
    </AdminShell>
  );
}
