"use client";
import { useState, useEffect } from "react";
import { Msg, btnPrimary, inputStyle } from "./Shared";

export default function StatsTab() {
  const [form, setForm] = useState({ stats_students: "", stats_years: "", stats_programmes: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    fetch("/api/admin/home-content/stats")
      .then((r) => r.json())
      .then((d) => { setForm(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const set = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true); setMsg(null);
    const res = await fetch("/api/admin/home-content/stats", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setMsg({ ok: res.ok, text: (await res.json()).message });
    setSaving(false);
  };

  if (loading) return <p style={{ color: "#9ca3af" }}>Loading…</p>;

  const stats = [
    { key: "stats_students", label: "Total Students", hint: "e.g. 1200", icon: "fas fa-user-graduate" },
    { key: "stats_years", label: "Years Operating", hint: "e.g. 25", icon: "fas fa-calendar-alt" },
    { key: "stats_programmes", label: "Programmes", hint: "e.g. 12", icon: "fas fa-book-open" },
  ];

  return (
    <form onSubmit={save}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 24 }}>
        {stats.map(({ key, label, hint, icon }) => (
          <div key={key} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: "20px 24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, background: "#ede9fe", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <i className={icon} style={{ color: "#6d28d9", fontSize: 16 }} />
              </div>
              <label style={{ fontWeight: 600, fontSize: 14, color: "#374151" }}>{label}</label>
            </div>
            <input
              type="number"
              name={key}
              value={form[key]}
              onChange={set}
              placeholder={hint}
              min="0"
              style={{ ...inputStyle }}
            />
          </div>
        ))}
      </div>
      <Msg msg={msg} />
      <button type="submit" disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.7 : 1 }}>
        {saving ? "Saving…" : "Save Stats"}
      </button>
    </form>
  );
}
