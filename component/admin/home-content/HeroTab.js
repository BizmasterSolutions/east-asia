"use client";
import { useState, useEffect } from "react";
import { Field, ImageUpload, Msg, btnPrimary } from "./Shared";

const EMPTY = {
  hero_subtitle: "",
  hero_subtitle_color: "#ffffff",
  hero_heading: "",
  hero_heading_color: "#ffffff",
  hero_heading_highlight: "",
  hero_highlight_color: "#f59e0b",
  hero_description: "",
  hero_description_color: "#ffffff",
  hero_cta_text: "",
  hero_cta_link: "",
  hero_bg_image: "",
};

function ColorField({ label, name, value, onChange, previewBg = "transparent" }) {
  const safeVal = value || "#ffffff";
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: "block", fontWeight: 600, fontSize: 13, marginBottom: 4, color: "#374151" }}>
        {label} Color
      </label>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <input
          type="color"
          name={name}
          value={safeVal}
          onChange={onChange}
          style={{ width: 44, height: 36, border: "1px solid #d1d5db", borderRadius: 6, cursor: "pointer", padding: 2 }}
        />
        <input
          type="text"
          name={name}
          value={safeVal}
          onChange={onChange}
          placeholder="#ffffff"
          style={{ width: 110, padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 13 }}
        />
        <span style={{
          fontSize: 13,
          fontWeight: 600,
          color: safeVal,
          background: previewBg || "#374151",
          padding: "2px 10px",
          borderRadius: 4,
          border: "1px solid #e5e7eb",
        }}>
          Preview
        </span>
      </div>
    </div>
  );
}

export default function HeroTab() {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    fetch("/api/admin/home-content/hero")
      .then((r) => r.json())
      .then((d) => { setForm(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const set = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true); setMsg(null);
    const res = await fetch("/api/admin/home-content/hero", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setMsg({ ok: res.ok, text: (await res.json()).message });
    setSaving(false);
  };

  if (loading) return <p style={{ color: "#9ca3af" }}>Loading…</p>;

  const warn = form.hero_heading_highlight && form.hero_heading && !form.hero_heading.includes(form.hero_heading_highlight);

  return (
    <form onSubmit={save}>
      <ImageUpload
        label="Background Image"
        currentUrl={form.hero_bg_image}
        onUpload={(url) => setForm((p) => ({ ...p, hero_bg_image: url }))}
      />

      {/* Subtitle */}
      <Field label="Subtitle" name="hero_subtitle" value={form.hero_subtitle} onChange={set} placeholder="Welcome to East Asian!" />
      <ColorField label="Subtitle" name="hero_subtitle_color" value={form.hero_subtitle_color} onChange={set} />

      {/* Main Heading */}
      <Field label="Main Heading" name="hero_heading" value={form.hero_heading} onChange={set} placeholder="Students for a Brighter Future." />
      <ColorField label="Main Heading" name="hero_heading_color" value={form.hero_heading_color} onChange={set} />

      {/* Highlighted Word */}
      <Field
        label="Highlighted Word"
        name="hero_heading_highlight"
        value={form.hero_heading_highlight}
        onChange={set}
        placeholder="e.g. Brighter"
        hint="Must appear in the heading — wraps in a coloured span."
      />
      {warn && <p style={{ color: "#d97706", fontSize: 12, marginTop: -12, marginBottom: 12 }}>⚠ &quot;{form.hero_heading_highlight}&quot; not found in heading</p>}
      <ColorField label="Highlighted Word" name="hero_highlight_color" value={form.hero_highlight_color} onChange={set} />

      {/* Description */}
      <Field label="Description" name="hero_description" value={form.hero_description} onChange={set} textarea placeholder="Short paragraph…" />
      <ColorField label="Description" name="hero_description_color" value={form.hero_description_color} onChange={set} />

      <Field label="Button Text" name="hero_cta_text" value={form.hero_cta_text} onChange={set} placeholder="Read More" />
      <Field label="Button Link" name="hero_cta_link" value={form.hero_cta_link} onChange={set} placeholder="/about" />
      <Msg msg={msg} />
      <button type="submit" disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.7 : 1 }}>
        {saving ? "Saving…" : "Save Changes"}
      </button>
    </form>
  );
}
