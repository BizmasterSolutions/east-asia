"use client";
import { useState, useEffect } from "react";
import { Field, Msg, SectionCard, btnPrimary } from "./Shared";

const EMPTY = { title: "", body: "" };

export default function NewsTab() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () =>
    fetch("/api/admin/home-content/news").then((r) => r.json()).then(setItems);

  useEffect(() => { load(); }, []);

  const set = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const startEdit = (item) => { setEditId(item.id); setForm({ title: item.title, body: item.body }); };
  const cancelEdit = () => { setEditId(null); setForm(EMPTY); };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true); setMsg(null);
    const url = editId ? `/api/admin/home-content/news/${editId}` : "/api/admin/home-content/news";
    const res = await fetch(url, {
      method: editId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) { setMsg({ ok: true, text: editId ? "Updated." : "Posted." }); setForm(EMPTY); setEditId(null); load(); }
    else setMsg({ ok: false, text: (await res.json()).message });
    setSaving(false);
  };

  const del = async (id) => {
    if (!confirm("Delete this news item?")) return;
    await fetch(`/api/admin/home-content/news/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div>
      <Msg msg={msg} />
      <SectionCard>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, marginTop: 0 }}>
          {editId ? "Edit News Item" : "Post News"}
        </h3>
        <form onSubmit={save}>
          <Field label="Title" name="title" value={form.title} onChange={set} placeholder="News headline…" required />
          <Field label="Body" name="body" value={form.body} onChange={set} textarea placeholder="News content…" required />
          <div style={{ display: "flex", gap: 10 }}>
            <button type="submit" disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.7 : 1 }}>
              {saving ? "Saving…" : editId ? "Update" : "Post"}
            </button>
            {editId && <button type="button" onClick={cancelEdit} style={{ ...btnPrimary, background: "#6b7280" }}>Cancel</button>}
          </div>
        </form>
      </SectionCard>

      {items.length === 0 && <p style={{ color: "#9ca3af", fontSize: 14 }}>No news yet.</p>}
      {items.map((item) => (
        <SectionCard key={item.id}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 700, fontSize: 15, margin: "0 0 4px" }}>{item.title}</p>
              <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 4px", lineHeight: 1.5 }}>{item.body}</p>
              <p style={{ fontSize: 11, color: "#9ca3af", margin: 0 }}>
                {new Date(item.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            </div>
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              <button onClick={() => startEdit(item)} style={{ fontSize: 12, padding: "4px 12px", background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", borderRadius: 4, cursor: "pointer" }}>Edit</button>
              <button onClick={() => del(item.id)} style={{ fontSize: 12, padding: "4px 12px", background: "#fee2e2", color: "#dc2626", border: "1px solid #fecaca", borderRadius: 4, cursor: "pointer" }}>Delete</button>
            </div>
          </div>
        </SectionCard>
      ))}
    </div>
  );
}
