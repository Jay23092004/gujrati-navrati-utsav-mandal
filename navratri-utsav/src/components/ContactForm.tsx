"use client";

import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);
    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") || ""),
      mobile: String(form.get("mobile") || ""),
      email: String(form.get("email") || ""),
      subject: String(form.get("subject") || ""),
      message: String(form.get("message") || "")
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setStatus("done");
    } catch (err: any) {
      setError(err.message);
      setStatus("error");
    }
  }

  if (status === "done") {
    return <p className="card border-gold bg-gold/5 text-maroon">Thanks — we&apos;ve received your message and will get back to you.</p>;
  }

  return (
    <form onSubmit={onSubmit} className="card grid gap-3">
      <input name="name" required placeholder="Your name" className="rounded-lg border border-gold/30 px-3 py-2" />
      <input name="mobile" placeholder="Mobile (optional)" className="rounded-lg border border-gold/30 px-3 py-2" />
      <input name="email" type="email" placeholder="Email (optional)" className="rounded-lg border border-gold/30 px-3 py-2" />
      <input name="subject" placeholder="Subject (optional)" className="rounded-lg border border-gold/30 px-3 py-2" />
      <textarea name="message" required placeholder="Message" rows={4} className="rounded-lg border border-gold/30 px-3 py-2" />
      {error && <p className="text-sm text-pink">{error}</p>}
      <button type="submit" disabled={status === "submitting"} className="btn-primary">
        {status === "submitting" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
