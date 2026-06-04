"use client";
import { useState, useEffect } from "react";
import { Field, ImageUpload, Msg, SectionCard, btnPrimary, btnDanger, inputStyle } from "./Shared";

const EMPTY = { imagePath: "", caption: "", sortOrder: 0 };

export default function SlideshowTab() {
  const [slides, setSlides] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () =>
    fetch("/api/admin/home-content/slideshow")
      .then((r) => r.json())
      .then(setSlides);

  useEffect(() => { load(); }, []);

  const set = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.name === "sortOrder" ? Number(e.target.value) : e.target.value }));

  const startEdit = (slide) => {
    setEditId(slide.id);
    setForm({ imagePath: slide.imagePath, caption: slide.caption || "", sortOrder: slide.sortOrder });
  };

  const cancelEdit = () => { setEditId(null); setForm(EMPTY); };

  const save = async (e) => {
    e.preventDefault();
    if (!form.imagePath) { setMsg({ ok: false, text: "Please upload an image." }); return; }
    setSaving(true); setMsg(null);
    const url = editId
      ? `/api/admin/home-content/slideshow/${editId}`
      : "/api/admin/home-content/slideshow";
    const method = editId ? "PUT" : "POST";
    const body = editId
      ? { caption: form.caption, sortOrder: form.sortOrder }
      : form;
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (res.ok) { setMsg({ ok: true, text: editId ? "Updated." : "Added." }); setForm(EMPTY); setEditId(null); load(); }
    else setMsg({ ok: false, text: (await res.json()).message });
    setSaving(false);
  };

  const del = async (id) => {
    if (!confirm("Delete this slide?")) return;
    await fetch(`/api/admin/home-content/slideshow/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div>
      <Msg msg={msg} />

      {/* Add / Edit form */}
      <SectionCard>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, marginTop: 0 }}>
          {editId ? "Edit Slide" : "Add New Slide"}
        </h3>
        <form onSubmit={save}>
          {!editId && (
            <ImageUpload
              label="Slide Image"
              currentUrl={form.imagePath}
              onUpload={(url) => setForm((p) => ({ ...p, imagePath: url }))}
            />
          )}
          <Field label="Caption" name="caption" value={form.caption} onChange={set} placeholder="Optional caption…" />
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: "block", fontWeight: 600, fontSize: 13, marginBottom: 4, color: "#374151" }}>Sort Order</label>
            <input type="number" name="sortOrder" value={form.sortOrder} onChange={set} style={{ ...inputStyle, width: 100 }} />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button type="submit" disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.7 : 1 }}>
              {saving ? "Saving…" : editId ? "Update" : "Add Slide"}
            </button>
            {editId && (
              <button type="button" onClick={cancelEdit} style={{ ...btnPrimary, background: "#6b7280" }}>Cancel</button>
            )}
          </div>
        </form>
      </SectionCard>

      {/* List */}
      {slides.length === 0 && <p style={{ color: "#9ca3af", fontSize: 14 }}>No slides yet.</p>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
        {slides.map((s) => (
          <div key={s.id} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden" }}>
            <img src={s.imagePath} alt={s.caption || ""} style={{ width: "100%", height: 130, objectFit: "cover", display: "block" }} />
            <div style={{ padding: "10px 14px" }}>
              <p style={{ fontSize: 13, color: "#374151", margin: "0 0 4px", fontWeight: 500 }}>
                {s.caption || <span style={{ color: "#9ca3af" }}>No caption</span>}
              </p>
              <p style={{ fontSize: 11, color: "#9ca3af", margin: "0 0 10px" }}>Order: {s.sortOrder}</p>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => startEdit(s)} style={{ fontSize: 12, padding: "4px 12px", background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", borderRadius: 4, cursor: "pointer" }}>
                  Edit
                </button>
                <button onClick={() => del(s.id)} style={{ fontSize: 12, padding: "4px 12px", background: "#fee2e2", color: "#dc2626", border: "1px solid #fecaca", borderRadius: 4, cursor: "pointer" }}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
