"use client";
import { useState, useEffect } from "react";
import { Msg, btnPrimary } from "./Shared";

const DEFAULTS = {
  navbar_bg_color: "#ffffff",
  navbar_text_color: "#222222",
  navbar_link_color: "#222222",
};

function ColorField({ label, name, value, onChange }) {
  const safe = value || "#ffffff";
  return (
    <div style={{ marginBottom: 24 }}>
      <label style={{ display: "block", fontWeight: 600, fontSize: 13, marginBottom: 6, color: "#374151" }}>
        {label}
      </label>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <input
          type="color"
          name={name}
          value={safe}
          onChange={onChange}
          style={{ width: 44, height: 36, border: "1px solid #d1d5db", borderRadius: 6, cursor: "pointer", padding: 2 }}
        />
        <input
          type="text"
          name={name}
          value={safe}
          onChange={onChange}
          placeholder="#ffffff"
          style={{ width: 110, padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 13 }}
        />
        <span style={{
          fontSize: 13,
          fontWeight: 600,
          padding: "4px 14px",
          borderRadius: 4,
          border: "1px solid #e5e7eb",
          background: safe,
        }} />
      </div>
    </div>
  );
}

export default function NavbarTab() {
  const [form, setForm] = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    fetch("/api/admin/home-content/navbar")
      .then((r) => r.json())
      .then((d) => { setForm(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const set = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    const res = await fetch("/api/admin/home-content/navbar", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setMsg({ ok: res.ok, text: (await res.json()).message });
    setSaving(false);
  };

  if (loading) return <p style={{ color: "#9ca3af" }}>Loading…</p>;

  return (
    <form onSubmit={save}>
      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 24 }}>
        Controls the background and text colours of the navigation bar on the public site.
      </p>

      {/* Live preview */}
      <div style={{
        background: form.navbar_bg_color,
        borderRadius: 8,
        padding: "14px 24px",
        marginBottom: 28,
        border: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        gap: 24,
      }}>
        <span style={{ fontWeight: 700, fontSize: 15, color: form.navbar_text_color }}>East Asian</span>
        {["Home", "About", "Courses", "Contact"].map((l) => (
          <span key={l} style={{ fontSize: 13, color: form.navbar_link_color }}>{l}</span>
        ))}
      </div>

      <ColorField label="Background Color" name="navbar_bg_color" value={form.navbar_bg_color} onChange={set} />
      <ColorField label="Text / Logo Color" name="navbar_text_color" value={form.navbar_text_color} onChange={set} />
      <ColorField label="Link Color" name="navbar_link_color" value={form.navbar_link_color} onChange={set} />

      <Msg msg={msg} />
      <button type="submit" disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.7 : 1 }}>
        {saving ? "Saving…" : "Save Changes"}
      </button>
    </form>
  );
}
