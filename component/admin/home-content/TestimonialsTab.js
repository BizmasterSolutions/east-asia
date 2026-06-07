"use client";
import { useState, useEffect } from "react";
import { Field, ImageUpload, Msg, SectionCard, btnPrimary, btnDanger, btnSecondary } from "./Shared";

const BLANK = { name: "", designation: "", description: "", imagePath: "" };

export default function TestimonialsTab() {
  const [heading, setHeading] = useState({ testimonial_subtitle: "", testimonial_heading: "" });
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(BLANK);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const load = () =>
    fetch("/api/admin/home-content/testimonials")
      .then((r) => r.json())
      .then((d) => { setHeading(d.heading); setItems(d.items); })
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const changeHeading = (e) => setHeading((h) => ({ ...h, [e.target.name]: e.target.value }));
  const changeForm = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const saveHeading = async () => {
    setSaving(true); setMsg(null);
    const res = await fetch("/api/admin/home-content/testimonials", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(heading) });
    const d = await res.json();
    setMsg({ ok: res.ok, text: d.message });
    setSaving(false);
  };

  const saveItem = async () => {
    setSaving(true); setMsg(null);
    const url = editId ? `/api/admin/home-content/testimonials/${editId}` : "/api/admin/home-content/testimonials";
    const method = editId ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const d = await res.json();
    if (res.ok) { setForm(BLANK); setEditId(null); await load(); setMsg({ ok: true, text: editId ? "Testimonial updated." : "Testimonial added." }); }
    else setMsg({ ok: false, text: d.message });
    setSaving(false);
  };

  const remove = async (id) => {
    if (!confirm("Delete this testimonial?")) return;
    await fetch(`/api/admin/home-content/testimonials/${id}`, { method: "DELETE" });
    await load();
  };

  const startEdit = (item) => {
    setForm({ name: item.name, designation: item.designation, description: item.description, imagePath: item.imagePath || "" });
    setEditId(item.id);
  };
  const cancelEdit = () => { setForm(BLANK); setEditId(null); };

  if (loading) return <p style={{ color: "#6b7280" }}>Loading…</p>;

  return (
    <div>
      <Msg msg={msg} />

      <SectionCard>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: "#111827" }}>Section Heading</h3>
        <Field label="Subtitle" name="testimonial_subtitle" value={heading.testimonial_subtitle} onChange={changeHeading} />
        <Field label="Main Heading" name="testimonial_heading" value={heading.testimonial_heading} onChange={changeHeading} />
        <button onClick={saveHeading} disabled={saving} style={btnPrimary}>{saving ? "Saving…" : "Save Heading"}</button>
      </SectionCard>

      <SectionCard>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: "#111827" }}>{editId ? "Edit Testimonial" : "Add Testimonial"}</h3>
        <Field label="Client Name" name="name" value={form.name} onChange={changeForm} required />
        <Field label="Designation / Role" name="designation" value={form.designation} onChange={changeForm} placeholder="e.g. Parent, Student, Teacher" />
        <Field label="Testimonial Text" name="description" value={form.description} onChange={changeForm} textarea required />
        <ImageUpload label="Photo (optional)" currentUrl={form.imagePath} onUpload={(url) => setForm((f) => ({ ...f, imagePath: url }))} />
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={saveItem} disabled={saving} style={btnPrimary}>{saving ? "Saving…" : editId ? "Update" : "Add Testimonial"}</button>
          {editId && <button onClick={cancelEdit} style={btnSecondary}>Cancel</button>}
        </div>
      </SectionCard>

      <SectionCard>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: "#111827" }}>Testimonials ({items.length})</h3>
        {items.length === 0 && <p style={{ color: "#6b7280", fontSize: 13 }}>No testimonials yet. Add one above.</p>}
        {items.map((item) => (
          <div key={item.id} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 0", borderBottom: "1px solid #f3f4f6" }}>
            {item.imagePath && <img src={item.imagePath} alt="" style={{ width: 44, height: 44, objectFit: "cover", borderRadius: "50%" }} />}
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{item.name} <span style={{ fontWeight: 400, color: "#6b7280", fontSize: 12 }}>— {item.designation}</span></div>
              <div style={{ fontSize: 13, color: "#374151", marginTop: 2 }}>{item.description.slice(0, 80)}{item.description.length > 80 ? "…" : ""}</div>
            </div>
            <button onClick={() => startEdit(item)} style={btnSecondary}>Edit</button>
            <button onClick={() => remove(item.id)} style={btnDanger}>Delete</button>
          </div>
        ))}
      </SectionCard>
    </div>
  );
}
