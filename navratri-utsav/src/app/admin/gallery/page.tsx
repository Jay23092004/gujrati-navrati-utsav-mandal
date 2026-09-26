"use client";

import { useEffect, useState, useCallback } from "react";
import AdminShell from "@/components/AdminShell";

type Item = { id: string; title: string; imageUrl: string; status: string };

export default function AdminGalleryPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/gallery");
    setItems((await res.json()).gallery ?? []);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/admin/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, imageUrl })
    });
    setTitle(""); setImageUrl("");
    load();
  }

  async function remove(id: string) {
    await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <AdminShell>
      <h1 className="font-display text-2xl font-bold text-maroon">Gallery</h1>
      <p className="mt-1 text-sm text-maroon/60">
        Upload images to your chosen object storage provider first, then paste the resulting URL here.
      </p>
      <form onSubmit={add} className="card mt-4 flex flex-wrap gap-3">
        <input required placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="flex-1 rounded-lg border border-gold/30 px-3 py-2" />
        <input required placeholder="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="flex-[2] rounded-lg border border-gold/30 px-3 py-2" />
        <button className="btn-primary">Add</button>
      </form>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.map((it) => (
          <div key={it.id} className="card">
            <img src={it.imageUrl} alt={it.title} className="aspect-square w-full rounded-lg object-cover" />
            <p className="mt-2 text-sm font-medium">{it.title}</p>
            <button onClick={() => remove(it.id)} className="mt-1 text-xs text-pink hover:underline">Remove</button>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
