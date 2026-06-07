"use client";
import { useState, useEffect } from "react";
import { Field, ImageUpload, Msg, SectionCard, btnPrimary, btnSecondary } from "./Shared";

const DEFAULTS = {
  about_subtitle: "OUR About Us",
  about_heading: "District is Made of about Students Childhood.",
  about_description: "",
  about_bullets: JSON.stringify(["", "", "", "", ""]),
  about_cta_link: "/about",
  about_main_img: "",
  about_top_img: "",
  about_top_heading: "Study Off Flexibly",
  about_top_description: "",
  about_stat_number: "183k+",
  about_stat_label: "Complete Projects",
};

export default function AboutTab() {
  const [form, setForm] = useState(DEFAULTS);
  const [bullets, setBullets] = useState(["", "", "", "", ""]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    fetch("/api/admin/home-content/about")
      .then((r) => r.json())
      .then((d) => {
        setForm(d);
        try { setBullets(JSON.parse(d.about_bullets || "[]")); } catch { setBullets(["", "", "", "", ""]); }
      })
      .finally(() => setLoading(false));
  }, []);

  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const save = async () => {
    setSaving(true);
    setMsg(null);
    const payload = { ...form, about_bullets: JSON.stringify(bullets) };
    const res = await fetch("/api/admin/home-content/about", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await res.json();
    setMsg({ ok: res.ok, text: data.message });
    setSaving(false);
  };

  if (loading) return <p style={{ color: "#6b7280" }}>Loading…</p>;

  return (
    <div>
      <Msg msg={msg} />

      <SectionCard>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: "#111827" }}>Top Banner Strip</h3>
        <ImageUpload label="Top Image" currentUrl={form.about_top_img} onUpload={(url) => setForm((f) => ({ ...f, about_top_img: url }))} />
        <Field label="Top Heading" name="about_top_heading" value={form.about_top_heading} onChange={change} />
        <Field label="Top Description" name="about_top_description" value={form.about_top_description} onChange={change} textarea />
      </SectionCard>

      <SectionCard>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: "#111827" }}>About Text Block</h3>
        <Field label="Section Subtitle" name="about_subtitle" value={form.about_subtitle} onChange={change} />
        <Field label="Main Heading" name="about_heading" value={form.about_heading} onChange={change} required />
        <Field label="Description" name="about_description" value={form.about_description} onChange={change} textarea />
        <div style={{ marginBottom: 18 }}>
          <label style={{ display: "block", fontWeight: 600, fontSize: 13, marginBottom: 8, color: "#374151" }}>Bullet Points</label>
          {bullets.map((b, i) => (
            <input
              key={i}
              value={b}
              onChange={(e) => { const next = [...bullets]; next[i] = e.target.value; setBullets(next); }}
              placeholder={`Bullet ${i + 1}`}
              style={{ width: "100%", padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 14, marginBottom: 6, boxSizing: "border-box" }}
            />
          ))}
          <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
            <button onClick={() => setBullets([...bullets, ""])} style={btnSecondary}>+ Add Bullet</button>
            {bullets.length > 1 && (
              <button onClick={() => setBullets(bullets.slice(0, -1))} style={{ ...btnSecondary, color: "#dc2626" }}>− Remove Last</button>
            )}
          </div>
        </div>
        <Field label="CTA Link" name="about_cta_link" value={form.about_cta_link} onChange={change} />
      </SectionCard>

      <SectionCard>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: "#111827" }}>About Image &amp; Stat Badge</h3>
        <ImageUpload label="Main Image" currentUrl={form.about_main_img} onUpload={(url) => setForm((f) => ({ ...f, about_main_img: url }))} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="Stat Number" name="about_stat_number" value={form.about_stat_number} onChange={change} placeholder="e.g. 183k+" />
          <Field label="Stat Label" name="about_stat_label" value={form.about_stat_label} onChange={change} placeholder="e.g. Complete Projects" />
        </div>
      </SectionCard>

      <button onClick={save} disabled={saving} style={btnPrimary}>{saving ? "Saving…" : "Save Changes"}</button>
    </div>
  );
}
