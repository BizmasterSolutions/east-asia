"use client";
import { useState, useEffect } from "react";
import { Field, ImageUpload, Msg, SectionCard, btnPrimary, btnDanger } from "./Shared";

const EMPTY = { studentName: "", description: "", imagePath: "" };

export default function StoriesTab() {
  const [stories, setStories] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () =>
    fetch("/api/admin/home-content/success-stories").then((r) => r.json()).then(setStories);

  useEffect(() => { load(); }, []);

  const set = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const startEdit = (s) => { setEditId(s.id); setForm({ studentName: s.studentName, description: s.description, imagePath: s.imagePath || "" }); };
  const cancelEdit = () => { setEditId(null); setForm(EMPTY); };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true); setMsg(null);
    const url = editId ? `/api/admin/home-content/success-stories/${editId}` : "/api/admin/home-content/success-stories";
    const res = await fetch(url, {
      method: editId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) { setMsg({ ok: true, text: editId ? "Updated." : "Added." }); setForm(EMPTY); setEditId(null); load(); }
    else setMsg({ ok: false, text: (await res.json()).message });
    setSaving(false);
  };

  const del = async (id) => {
    if (!confirm("Delete this story?")) return;
    await fetch(`/api/admin/home-content/success-stories/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div>
      <Msg msg={msg} />
      <SectionCard>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, marginTop: 0 }}>
          {editId ? "Edit Story" : "Add Success Story"}
        </h3>
        <form onSubmit={save}>
          <Field label="Student Name" name="studentName" value={form.studentName} onChange={set} placeholder="e.g. Kamal Perera" required />
          <Field label="Description" name="description" value={form.description} onChange={set} textarea placeholder="Tell their story…" required />
          <ImageUpload label="Photo (optional)" currentUrl={form.imagePath} onUpload={(url) => setForm((p) => ({ ...p, imagePath: url }))} />
          <div style={{ display: "flex", gap: 10 }}>
            <button type="submit" disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.7 : 1 }}>
              {saving ? "Saving…" : editId ? "Update" : "Add Story"}
            </button>
            {editId && <button type="button" onClick={cancelEdit} style={{ ...btnPrimary, background: "#6b7280" }}>Cancel</button>}
          </div>
        </form>
      </SectionCard>

      {stories.length === 0 && <p style={{ color: "#9ca3af", fontSize: 14 }}>No stories yet.</p>}
      {stories.map((s) => (
        <SectionCard key={s.id} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
          {s.imagePath && (
            <img src={s.imagePath} alt={s.studentName} style={{ width: 70, height: 70, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontWeight: 700, fontSize: 15, margin: "0 0 4px" }}>{s.studentName}</p>
            <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 12px", lineHeight: 1.5 }}>{s.description}</p>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => startEdit(s)} style={{ fontSize: 12, padding: "4px 12px", background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", borderRadius: 4, cursor: "pointer" }}>Edit</button>
              <button onClick={() => del(s.id)} style={{ fontSize: 12, padding: "4px 12px", background: "#fee2e2", color: "#dc2626", border: "1px solid #fecaca", borderRadius: 4, cursor: "pointer" }}>Delete</button>
            </div>
          </div>
        </SectionCard>
      ))}
    </div>
  );
}
