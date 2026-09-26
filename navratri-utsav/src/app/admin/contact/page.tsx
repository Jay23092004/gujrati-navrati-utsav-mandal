"use client";

import { useEffect, useState, useCallback } from "react";
import AdminShell from "@/components/AdminShell";

type Msg = { id: string; name: string; email: string | null; mobile: string | null; message: string; status: string; createdAt: string };

export default function AdminContactPage() {
  const [messages, setMessages] = useState<Msg[]>([]);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/contact");
    setMessages((await res.json()).messages ?? []);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function setStatus(id: string, status: string) {
    await fetch(`/api/admin/contact/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    load();
  }

  return (
    <AdminShell>
      <h1 className="font-display text-2xl font-bold text-maroon">Contact Enquiries</h1>
      <div className="mt-6 space-y-3">
        {messages.map((m) => (
          <div key={m.id} className="card">
            <div className="flex items-center justify-between">
              <p className="font-semibold">{m.name} {m.mobile && `· ${m.mobile}`} {m.email && `· ${m.email}`}</p>
              <select value={m.status} onChange={(e) => setStatus(m.id, e.target.value)} className="rounded border border-gold/30 px-2 py-1 text-xs">
                <option value="new">New</option>
                <option value="read">Read</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
            <p className="mt-1 text-sm text-maroon/70">{m.message}</p>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
