"use client";

import { useEffect, useState, useCallback } from "react";
import AdminShell from "@/components/AdminShell";

type Sponsor = { id: string; name: string; category: string | null; websiteUrl: string | null };

export default function AdminSponsorsPage() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [form, setForm] = useState({ name: "", category: "", websiteUrl: "" });

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/sponsors");
    setSponsors((await res.json()).sponsors ?? []);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/admin/sponsors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    setForm({ name: "", category: "", websiteUrl: "" });
    load();
  }

  async function remove(id: string) {
    await fetch(`/api/admin/sponsors/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <AdminShell>
      <h1 className="font-display text-2xl font-bold text-maroon">Sponsors</h1>
      <form onSubmit={add} className="card mt-4 flex flex-wrap gap-3">
        <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="flex-1 rounded-lg border border-gold/30 px-3 py-2" />
        <input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="flex-1 rounded-lg border border-gold/30 px-3 py-2" />
        <input placeholder="Website URL" value={form.websiteUrl} onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })} className="flex-1 rounded-lg border border-gold/30 px-3 py-2" />
        <button className="btn-primary">Add</button>
      </form>
      <div className="mt-6 overflow-x-auto rounded-xl border border-gold/20 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gold/10 text-left text-xs uppercase text-maroon/60"><tr><th className="px-3 py-2">Name</th><th className="px-3 py-2">Category</th><th className="px-3 py-2"></th></tr></thead>
          <tbody className="divide-y divide-gold/10">
            {sponsors.map((s) => (
              <tr key={s.id}><td className="px-3 py-2">{s.name}</td><td className="px-3 py-2">{s.category}</td>
                <td className="px-3 py-2"><button onClick={() => remove(s.id)} className="text-xs text-pink hover:underline">Delete</button></td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
