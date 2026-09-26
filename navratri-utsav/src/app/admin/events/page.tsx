"use client";

import { useEffect, useState, useCallback } from "react";
import AdminShell from "@/components/AdminShell";

type EventRow = {
  id: string;
  title: string;
  slug: string;
  eventDate: string;
  status: string;
  registrationEnabled: boolean;
  _count: { registrations: number };
};

const emptyForm = { title: "", slug: "", eventDate: "", startTime: "", ageGroup: "", registrationFee: "", description: "" };

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/events");
    const data = await res.json();
    setEvents(data.events ?? []);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function createEvent(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/admin/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        registrationFee: form.registrationFee ? Number(form.registrationFee) : undefined,
        status: "PUBLISHED"
      })
    });
    setForm(emptyForm);
    setSaving(false);
    load();
  }

  async function toggleStatus(row: EventRow) {
    const next = row.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    await fetch(`/api/admin/events/${row.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next })
    });
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this event and its registrations?")) return;
    await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <AdminShell>
      <h1 className="font-display text-2xl font-bold text-maroon">Events</h1>

      <form onSubmit={createEvent} className="card mt-4 grid gap-3 sm:grid-cols-3">
        <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-lg border border-gold/30 px-3 py-2" />
        <input required placeholder="Slug (url-friendly)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="rounded-lg border border-gold/30 px-3 py-2" />
        <input required type="date" value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} className="rounded-lg border border-gold/30 px-3 py-2" />
        <input placeholder="Time slot (e.g. After Aarti)" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} className="rounded-lg border border-gold/30 px-3 py-2" />
        <input placeholder="Age group" value={form.ageGroup} onChange={(e) => setForm({ ...form, ageGroup: e.target.value })} className="rounded-lg border border-gold/30 px-3 py-2" />
        <input type="number" placeholder="Registration fee" value={form.registrationFee} onChange={(e) => setForm({ ...form, registrationFee: e.target.value })} className="rounded-lg border border-gold/30 px-3 py-2" />
        <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="rounded-lg border border-gold/30 px-3 py-2 sm:col-span-3" />
        <button disabled={saving} className="btn-primary sm:col-span-3">{saving ? "Saving..." : "Add Event"}</button>
      </form>

      <div className="mt-6 overflow-x-auto rounded-xl border border-gold/20 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gold/10 text-left text-xs uppercase text-maroon/60">
            <tr>
              <th className="px-3 py-2">Title</th>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Registrations</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold/10">
            {events.map((ev) => (
              <tr key={ev.id}>
                <td className="px-3 py-2">{ev.title}</td>
                <td className="px-3 py-2">{new Date(ev.eventDate).toLocaleDateString()}</td>
                <td className="px-3 py-2">
                  <button onClick={() => toggleStatus(ev)} className="rounded-full bg-gold/10 px-2 py-1 text-xs">{ev.status}</button>
                </td>
                <td className="px-3 py-2">{ev._count.registrations}</td>
                <td className="px-3 py-2">
                  <button onClick={() => remove(ev.id)} className="text-xs text-pink hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
