"use client";

import { useEffect, useState, useCallback } from "react";
import AdminShell from "@/components/AdminShell";

type Admin = { id: string; name: string; email: string; role: string; status: string; lastLogin: string | null };

export default function AdminUsersPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "ADMIN" });
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/admins");
    if (res.ok) setAdmins((await res.json()).admins ?? []);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/admin/admins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error); return; }
    setForm({ name: "", email: "", password: "", role: "ADMIN" });
    load();
  }

  async function toggleStatus(a: Admin) {
    await fetch(`/api/admin/admins/${a.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: a.status === "ACTIVE" ? "DISABLED" : "ACTIVE" })
    });
    load();
  }

  async function resetPassword(a: Admin) {
    const res = await fetch(`/api/admin/admins/${a.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resetPassword: true })
    });
    const data = await res.json();
    if (data.tempPassword) alert(`Temporary password for ${a.email}: ${data.tempPassword}\n\nShare this securely — it won't be shown again.`);
  }

  return (
    <AdminShell>
      <h1 className="font-display text-2xl font-bold text-maroon">Admin Users</h1>
      <p className="mt-1 text-sm text-maroon/60">Super Admin only — create administrators, manage roles and access.</p>

      <form onSubmit={create} className="card mt-4 grid gap-3 sm:grid-cols-4">
        <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-lg border border-gold/30 px-3 py-2" />
        <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="rounded-lg border border-gold/30 px-3 py-2" />
        <input required type="password" placeholder="Temporary password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="rounded-lg border border-gold/30 px-3 py-2" />
        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="rounded-lg border border-gold/30 px-3 py-2">
          <option value="ADMIN">Admin</option>
          <option value="SUPER_ADMIN">Super Admin</option>
        </select>
        {error && <p className="text-sm text-pink sm:col-span-4">{error}</p>}
        <button className="btn-primary sm:col-span-4">Create Admin</button>
      </form>

      <div className="mt-6 overflow-x-auto rounded-xl border border-gold/20 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gold/10 text-left text-xs uppercase text-maroon/60">
            <tr><th className="px-3 py-2">Name</th><th className="px-3 py-2">Email</th><th className="px-3 py-2">Role</th><th className="px-3 py-2">Status</th><th className="px-3 py-2"></th></tr>
          </thead>
          <tbody className="divide-y divide-gold/10">
            {admins.map((a) => (
              <tr key={a.id}>
                <td className="px-3 py-2">{a.name}</td>
                <td className="px-3 py-2">{a.email}</td>
                <td className="px-3 py-2">{a.role}</td>
                <td className="px-3 py-2">
                  <button onClick={() => toggleStatus(a)} className="rounded-full bg-gold/10 px-2 py-1 text-xs">{a.status}</button>
                </td>
                <td className="px-3 py-2">
                  <button onClick={() => resetPassword(a)} className="text-xs text-pink hover:underline">Reset password</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
