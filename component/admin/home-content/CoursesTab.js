"use client";
import { useState, useEffect } from "react";
import { Field, ImageUpload, Msg, SectionCard, btnPrimary, btnDanger, btnSecondary, inputStyle } from "./Shared";

const COLORS = ["orange", "green", "red", "blue"];
const BLANK = { title: "", desc: "", imagePath: "", color: "orange", sortOrder: 0 };

export default function CoursesTab() {
  const [heading, setHeading] = useState({ courses_subtitle: "", courses_heading: "" });
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(BLANK);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const load = () =>
    fetch("/api/admin/home-content/courses")
      .then((r) => r.json())
      .then((d) => { setHeading(d.heading); setItems(d.items); })
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const changeHeading = (e) => setHeading((h) => ({ ...h, [e.target.name]: e.target.value }));
  const changeForm = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const saveHeading = async () => {
    setSaving(true); setMsg(null);
    const res = await fetch("/api/admin/home-content/courses", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(heading) });
    const d = await res.json();
    setMsg({ ok: res.ok, text: d.message });
    setSaving(false);
  };

  const saveItem = async () => {
    setSaving(true); setMsg(null);
    const url = editId ? `/api/admin/home-content/courses/${editId}` : "/api/admin/home-content/courses";
    const method = editId ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, sortOrder: Number(form.sortOrder) }) });
    const d = await res.json();
    if (res.ok) { setForm(BLANK); setEditId(null); await load(); setMsg({ ok: true, text: editId ? "Course updated." : "Course added." }); }
    else setMsg({ ok: false, text: d.message });
    setSaving(false);
  };

  const remove = async (id) => {
    if (!confirm("Delete this course card?")) return;
    await fetch(`/api/admin/home-content/courses/${id}`, { method: "DELETE" });
    await load();
  };

  const startEdit = (item) => { setForm({ title: item.title, desc: item.desc, imagePath: item.imagePath || "", color: item.color, sortOrder: item.sortOrder }); setEditId(item.id); };
  const cancelEdit = () => { setForm(BLANK); setEditId(null); };

  if (loading) return <p style={{ color: "#6b7280" }}>Loading…</p>;

  return (
    <div>
      <Msg msg={msg} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>

        {/* ── LEFT: heading + form ── */}
        <div>
          <SectionCard>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: "#111827" }}>Section Heading</h3>
            <Field label="Subtitle" name="courses_subtitle" value={heading.courses_subtitle} onChange={changeHeading} />
            <Field label="Main Heading" name="courses_heading" value={heading.courses_heading} onChange={changeHeading} />
            <button onClick={saveHeading} disabled={saving} style={btnPrimary}>{saving ? "Saving…" : "Save Heading"}</button>
          </SectionCard>

          <SectionCard>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: "#111827" }}>{editId ? "Edit Course Card" : "Add Course Card"}</h3>
            <Field label="Title" name="title" value={form.title} onChange={changeForm} required />
            <Field label="Description" name="desc" value={form.desc} onChange={changeForm} textarea required />
            <ImageUpload label="Image" currentUrl={form.imagePath} onUpload={(url) => setForm((f) => ({ ...f, imagePath: url }))} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
              <div>
                <label style={{ display: "block", fontWeight: 600, fontSize: 13, marginBottom: 4, color: "#374151" }}>Color</label>
                <select name="color" value={form.color} onChange={changeForm} style={inputStyle}>
                  {COLORS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <Field label="Sort Order" name="sortOrder" value={form.sortOrder} onChange={changeForm} type="number" />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={saveItem} disabled={saving} style={btnPrimary}>{saving ? "Saving…" : editId ? "Update" : "Add Card"}</button>
              {editId && <button onClick={cancelEdit} style={btnSecondary}>Cancel</button>}
            </div>
          </SectionCard>
        </div>

        {/* ── RIGHT: course cards list ── */}
        <div>
          <SectionCard>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: "#111827" }}>
              Course Cards ({items.length})
            </h3>
            {items.length === 0 && (
              <p style={{ color: "#6b7280", fontSize: 13 }}>No course cards yet. Add one on the left.</p>
            )}
            {items.map((item) => (
              <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0", borderBottom: "1px solid #f3f4f6" }}>
                <div style={{ width: 110, height: 80, flexShrink: 0, borderRadius: 8, overflow: "hidden", background: "#f3f4f6" }}>
                  {item.imagePath
                    ? <img src={item.imagePath} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af", fontSize: 12 }}>No img</div>
                  }
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: 4 }}>{item.title}</div>
                  <div style={{ fontSize: 13, color: "#6b7280", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{item.desc}</div>
                  <span style={{ display: "inline-block", marginTop: 6, fontSize: 11, background: "#f3f4f6", borderRadius: 4, padding: "2px 8px", color: "#374151" }}>{item.color} · order {item.sortOrder}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
                  <button onClick={() => startEdit(item)} style={btnSecondary}>Edit</button>
                  <button onClick={() => remove(item.id)} style={btnDanger}>Delete</button>
                </div>
              </div>
            ))}
          </SectionCard>
        </div>

      </div>
    </div>
  );
}
