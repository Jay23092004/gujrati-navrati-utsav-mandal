"use client";

import { useEffect, useState, useCallback } from "react";
import AdminShell from "@/components/AdminShell";

type Registration = {
  id: string;
  registrationNumber: string;
  fullName: string;
  mobile: string;
  email: string | null;
  city: string | null;
  participants: number;
  paymentStatus: string;
  registrationStatus: string;
  event: { title: string };
  createdAt: string;
};

const STATUSES = ["PENDING", "CONFIRMED", "CANCELLED", "REJECTED"];

export default function AdminRegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (status) params.set("status", status);
    const res = await fetch(`/api/admin/registrations?${params.toString()}`);
    const data = await res.json();
    setRegistrations(data.registrations ?? []);
    setTotal(data.total ?? 0);
    setLoading(false);
  }, [q, status]);

  useEffect(() => {
    const t = setTimeout(load, 300); // debounce search
    return () => clearTimeout(t);
  }, [load]);

  async function updateStatus(id: string, registrationStatus: string) {
    await fetch(`/api/admin/registrations/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ registrationStatus })
    });
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this registration?")) return;
    await fetch(`/api/admin/registrations/${id}`, { method: "DELETE" });
    load();
  }

  function exportCsv() {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    window.open(`/api/admin/registrations/export?${params.toString()}`, "_blank");
  }

  return (
    <AdminShell>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-maroon">Registrations ({total})</h1>
        <button onClick={exportCsv} className="btn-primary">Export CSV</button>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, mobile or reg. number"
          className="w-64 rounded-lg border border-gold/30 px-3 py-2"
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border border-gold/30 px-3 py-2">
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-gold/20 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gold/10 text-left text-xs uppercase text-maroon/60">
            <tr>
              <th className="px-3 py-2">Reg. No.</th>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Mobile</th>
              <th className="px-3 py-2">Event</th>
              <th className="px-3 py-2">Participants</th>
              <th className="px-3 py-2">Payment</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold/10">
            {loading ? (
              <tr><td colSpan={8} className="px-3 py-6 text-center text-maroon/50">Loading...</td></tr>
            ) : registrations.length === 0 ? (
              <tr><td colSpan={8} className="px-3 py-6 text-center text-maroon/50">No registrations found.</td></tr>
            ) : (
              registrations.map((r) => (
                <tr key={r.id}>
                  <td className="px-3 py-2 font-mono text-xs">{r.registrationNumber}</td>
                  <td className="px-3 py-2">{r.fullName}</td>
                  <td className="px-3 py-2">{r.mobile}</td>
                  <td className="px-3 py-2">{r.event.title}</td>
                  <td className="px-3 py-2">{r.participants}</td>
                  <td className="px-3 py-2">{r.paymentStatus}</td>
                  <td className="px-3 py-2">
                    <select
                      value={r.registrationStatus}
                      onChange={(e) => updateStatus(r.id, e.target.value)}
                      className="rounded border border-gold/30 px-2 py-1 text-xs"
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <button onClick={() => remove(r.id)} className="text-xs text-pink hover:underline">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
