"use client";
import { useState, useEffect } from "react";
import { Field, ImageUpload, Msg, SectionCard, btnPrimary, btnSecondary, inputStyle } from "./Shared";

const COLORS = ["light_blue", "green", "orange", "blue", "red"];
const FA_ICONS = ["fa fa-book", "fa fa-graduation-cap", "fa fa-university", "fa fa-book-medical", "fa fa-running", "fa fa-music", "fa fa-paint-brush", "fa fa-futbol", "fa fa-microscope", "fa fa-globe"];
const BLANK_ITEM = { icon: "fa fa-book", title: "", color: "light_blue" };

export default function ActivitiesTab() {
  const [form, setForm] = useState({
    activity_subtitle: "",
    activity_heading: "",
    activity_description: "",
    activity_img: "",
    activity_items: JSON.stringify([BLANK_ITEM, BLANK_ITEM, BLANK_ITEM, BLANK_ITEM]),
  });
  const [activityItems, setActivityItems] = useState([{ ...BLANK_ITEM }, { ...BLANK_ITEM }, { ...BLANK_ITEM }, { ...BLANK_ITEM }]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    fetch("/api/admin/home-content/activities")
      .then((r) => r.json())
      .then((d) => {
        setForm(d);
        try { setActivityItems(JSON.parse(d.activity_items || "[]")); } catch { }
      })
      .finally(() => setLoading(false));
  }, []);

  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const changeItem = (i, key, val) => {
    const next = activityItems.map((it, idx) => idx === i ? { ...it, [key]: val } : it);
    setActivityItems(next);
  };

  const addItem = () => setActivityItems([...activityItems, { ...BLANK_ITEM }]);
  const removeItem = (i) => setActivityItems(activityItems.filter((_, idx) => idx !== i));

  const save = async () => {
    setSaving(true); setMsg(null);
    const payload = { ...form, activity_items: JSON.stringify(activityItems) };
    const res = await fetch("/api/admin/home-content/activities", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const d = await res.json();
    setMsg({ ok: res.ok, text: d.message });
    setSaving(false);
  };

  if (loading) return <p style={{ color: "#6b7280" }}>Loading…</p>;

  return (
    <div>
      <Msg msg={msg} />

      <SectionCard>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: "#111827" }}>Section Text</h3>
        <Field label="Subtitle" name="activity_subtitle" value={form.activity_subtitle} onChange={change} />
        <Field label="Main Heading" name="activity_heading" value={form.activity_heading} onChange={change} required />
        <Field label="Description" name="activity_description" value={form.activity_description} onChange={change} textarea />
      </SectionCard>

      <SectionCard>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: "#111827" }}>Activity Items</h3>
        {activityItems.map((item, i) => (
          <div key={i} style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 6, padding: 12, marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Activity {i + 1}</span>
              {activityItems.length > 1 && (
                <button onClick={() => removeItem(i)} style={{ fontSize: 12, color: "#dc2626", background: "none", border: "none", cursor: "pointer" }}>Remove</button>
              )}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Icon (Font Awesome)</label>
                <select value={item.icon} onChange={(e) => changeItem(i, "icon", e.target.value)} style={{ ...inputStyle, fontSize: 13 }}>
                  {FA_ICONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Title</label>
                <input value={item.title} onChange={(e) => changeItem(i, "title", e.target.value)} style={{ ...inputStyle, fontSize: 13 }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Color</label>
                <select value={item.color} onChange={(e) => changeItem(i, "color", e.target.value)} style={{ ...inputStyle, fontSize: 13 }}>
                  {COLORS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>
        ))}
        <button onClick={addItem} style={btnSecondary}>+ Add Activity Item</button>
      </SectionCard>

      <SectionCard>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: "#111827" }}>Section Image</h3>
        <ImageUpload label="Activities Image" currentUrl={form.activity_img} onUpload={(url) => setForm((f) => ({ ...f, activity_img: url }))} />
      </SectionCard>

      <button onClick={save} disabled={saving} style={btnPrimary}>{saving ? "Saving…" : "Save Changes"}</button>
    </div>
  );
}
