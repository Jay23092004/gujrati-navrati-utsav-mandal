"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";

type Log = { id: string; action: string; entityType: string | null; entityId: string | null; createdAt: string; admin: { name: string; email: string } | null };

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => {
    fetch("/api/admin/logs").then((r) => r.json()).then((d) => setLogs(d.logs ?? []));
  }, []);

  return (
    <AdminShell>
      <h1 className="font-display text-2xl font-bold text-maroon">Activity Logs</h1>
      <div className="mt-6 overflow-x-auto rounded-xl border border-gold/20 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gold/10 text-left text-xs uppercase text-maroon/60">
            <tr><th className="px-3 py-2">When</th><th className="px-3 py-2">Admin</th><th className="px-3 py-2">Action</th><th className="px-3 py-2">Entity</th></tr>
          </thead>
          <tbody className="divide-y divide-gold/10">
            {logs.map((l) => (
              <tr key={l.id}>
                <td className="px-3 py-2">{new Date(l.createdAt).toLocaleString()}</td>
                <td className="px-3 py-2">{l.admin?.name ?? "—"}</td>
                <td className="px-3 py-2">{l.action}</td>
                <td className="px-3 py-2">{l.entityType} {l.entityId?.slice(0, 8)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
