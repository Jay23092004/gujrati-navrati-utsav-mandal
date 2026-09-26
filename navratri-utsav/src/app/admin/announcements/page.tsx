"use client";

import { useEffect, useState, useCallback } from "react";
import AdminShell from "@/components/AdminShell";

type Announcement = { id: string; title: string; description: string; status: string };

export default function AdminAnnouncementsPage() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [form, setForm] = useState({ title: "", description: "" });

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/announcements");
    setItems((await res.json()).announcements ?? []);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/admin/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    setForm({ title: "", description: "" });
    load();
  }

  async function toggle(a: Announcement) {
    await fetch(`/api/admin/announcements/${a.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: a.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" })
    });
    load();
  }

  async function remove(id: string) {
    await fetch(`/api/admin/announcements/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <AdminShell>
      <h1 className="font-display text-2xl font-bold text-maroon">Announcements</h1>
      <form onSubmit={add} className="card mt-4 grid gap-3">
        <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-lg border border-gold/30 px-3 py-2" />
        <textarea required placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="rounded-lg border border-gold/30 px-3 py-2" />
        <button className="btn-primary">Publish</button>
      </form>
      <div className="mt-6 space-y-3">
        {items.map((a) => (
          <div key={a.id} className="card flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold">{a.title}</p>
              <p className="text-sm text-maroon/70">{a.description}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button onClick={() => toggle(a)} className="rounded-full bg-gold/10 px-2 py-1 text-xs">{a.status}</button>
              <button onClick={() => remove(a.id)} className="text-xs text-pink hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
