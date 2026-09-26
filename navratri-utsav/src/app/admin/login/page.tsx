"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.get("email"), password: form.get("password") })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed.");
      router.push(params.get("next") || "/admin/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-maroon px-5">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="font-display text-2xl font-bold text-maroon">Admin Login</h1>
        <p className="mt-1 text-sm text-maroon/60">Navratri Utsav — Admin Panel</p>
        <div className="mt-6 space-y-3">
          <input name="email" type="email" required placeholder="Email" className="w-full rounded-lg border border-gold/30 px-3 py-2" />
          <input name="password" type="password" required placeholder="Password" className="w-full rounded-lg border border-gold/30 px-3 py-2" />
        </div>
        {error && <p className="mt-3 text-sm text-pink">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary mt-6 w-full">
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
