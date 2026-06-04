"use client";
import { useState, useEffect } from "react";
import { Field, ImageUpload, Msg, btnPrimary } from "./Shared";

const EMPTY = {
  hero_subtitle: "",
  hero_heading: "",
  hero_heading_highlight: "",
  hero_description: "",
  hero_cta_text: "",
  hero_cta_link: "",
  hero_bg_image: "",
};

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
      <Field label="Subtitle" name="hero_subtitle" value={form.hero_subtitle} onChange={set} placeholder="Welcome to East Asian!" />
      <Field label="Main Heading" name="hero_heading" value={form.hero_heading} onChange={set} placeholder="Students for a Brighter Future." />
      <Field
        label="Highlighted Word"
        name="hero_heading_highlight"
        value={form.hero_heading_highlight}
        onChange={set}
        placeholder="e.g. Brighter"
        hint="Must appear in the heading — wraps in coloured span."
      />
      {warn && <p style={{ color: "#d97706", fontSize: 12, marginTop: -12, marginBottom: 12 }}>⚠ &quot;{form.hero_heading_highlight}&quot; not found in heading</p>}
      <Field label="Description" name="hero_description" value={form.hero_description} onChange={set} textarea placeholder="Short paragraph…" />
      <Field label="Button Text" name="hero_cta_text" value={form.hero_cta_text} onChange={set} placeholder="Read More" />
      <Field label="Button Link" name="hero_cta_link" value={form.hero_cta_link} onChange={set} placeholder="/about" />
      <Msg msg={msg} />
      <button type="submit" disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.7 : 1 }}>
        {saving ? "Saving…" : "Save Changes"}
      </button>
    </form>
  );
}
