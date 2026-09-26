"use client";

import { useState } from "react";

export default function RegistrationForm({ eventId, eventTitle }: { eventId: string; eventTitle: string }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [regNumber, setRegNumber] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);

    const form = new FormData(e.currentTarget);
    const payload = {
      eventId,
      fullName: String(form.get("fullName") || ""),
      mobile: String(form.get("mobile") || ""),
      email: String(form.get("email") || ""),
      age: form.get("age") ? Number(form.get("age")) : undefined,
      gender: String(form.get("gender") || ""),
      city: String(form.get("city") || ""),
      participants: Number(form.get("participants") || 1)
    };

    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setRegNumber(data.registration.registrationNumber);
      setStatus("done");
    } catch (err: any) {
      setError(err.message);
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="card border-gold bg-gold/5">
        <p className="font-semibold text-maroon">You&apos;re registered for {eventTitle}!</p>
        <p className="mt-1 text-sm text-maroon/70">Registration number: <strong>{regNumber}</strong></p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card grid gap-3 sm:grid-cols-2">
      <h2 className="sm:col-span-2 font-display text-lg font-semibold text-maroon">Register for {eventTitle}</h2>
      <input name="fullName" required placeholder="Full name" className="rounded-lg border border-gold/30 px-3 py-2" />
      <input name="mobile" required placeholder="Mobile number" className="rounded-lg border border-gold/30 px-3 py-2" />
      <input name="email" type="email" placeholder="Email (optional)" className="rounded-lg border border-gold/30 px-3 py-2" />
      <input name="age" type="number" min="1" placeholder="Age (optional)" className="rounded-lg border border-gold/30 px-3 py-2" />
      <select name="gender" className="rounded-lg border border-gold/30 px-3 py-2">
        <option value="">Gender (optional)</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
      <input name="city" placeholder="City (optional)" className="rounded-lg border border-gold/30 px-3 py-2" />
      <input name="participants" type="number" min="1" defaultValue={1} placeholder="Number of participants" className="rounded-lg border border-gold/30 px-3 py-2" />
      {error && <p className="sm:col-span-2 text-sm text-pink">{error}</p>}
      <button type="submit" disabled={status === "submitting"} className="btn-primary sm:col-span-2">
        {status === "submitting" ? "Submitting..." : "Submit Registration"}
      </button>
    </form>
  );
}
