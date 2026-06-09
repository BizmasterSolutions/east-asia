"use client";
import { useState, useEffect } from "react";
import { Field, Msg, SectionCard, btnPrimary, btnDanger, btnSecondary } from "../home-content/Shared";

const EMPTY = { title: "", body: "", target: "all" };

const TARGET_OPTIONS = [
  { value: "all",      label: "All (Students & Parents)" },
  { value: "students", label: "Students only" },
  { value: "parents",  label: "Parents only" },
];

const targetBadge = {
  all:      { bg: "#e0f2fe", color: "#0369a1", label: "All" },
  students: { bg: "#dcfce7", color: "#15803d", label: "Students" },
  parents:  { bg: "#fef3c7", color: "#b45309", label: "Parents" },
};

export default function AnnouncementsAdminSection() {
  const [items, setItems]       = useState([]);
  const [form, setForm]         = useState(EMPTY);
  const [editId, setEditId]     = useState(null);
  const [msg, setMsg]           = useState(null);
  const [saving, setSaving]     = useState(false);
  const [search, setSearch]     = useState("");
  const [showForm, setShowForm] = useState(false);
  const [filterTarget, setFilterTarget] = useState("all-filter");

  const load = () =>
    fetch("/api/admin/announcements")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setItems(data);
        else setMsg({ ok: false, text: data.message || "Failed to load announcements." });
      })
      .catch((e) => setMsg({ ok: false, text: e.message }));

  useEffect(() => { load(); }, []);

  const set = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const startAdd = () => {
    setEditId(null);
    setForm(EMPTY);
    setShowForm(true);
    setMsg(null);
  };

  const startEdit = (item) => {
    setEditId(item.id);
    setForm({ title: item.title, body: item.body, target: item.target });
    setShowForm(true);
    setMsg(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelForm = () => { setEditId(null); setForm(EMPTY); setShowForm(false); setMsg(null); };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true); setMsg(null);
    const url = editId ? `/api/admin/announcements/${editId}` : "/api/admin/announcements";
    const res = await fetch(url, {
      method: editId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setMsg({ ok: true, text: editId ? "Announcement updated." : "Announcement published." });
      setForm(EMPTY); setEditId(null); setShowForm(false); load();
    } else {
      const data = await res.json();
      setMsg({ ok: false, text: data.message || "Something went wrong." });
    }
    setSaving(false);
  };

  const del = async (id) => {
    if (!confirm("Delete this announcement? This cannot be undone.")) return;
    const res = await fetch(`/api/admin/announcements/${id}`, { method: "DELETE" });
    if (res.ok) { setMsg({ ok: true, text: "Announcement deleted." }); load(); }
    else setMsg({ ok: false, text: "Failed to delete." });
  };

  const filtered = items.filter((a) => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.body.toLowerCase().includes(search.toLowerCase());
    const matchTarget = filterTarget === "all-filter" || a.target === filterTarget;
    return matchSearch && matchTarget;
  });

  const counts = {
    all:      items.filter((a) => a.target === "all").length,
    students: items.filter((a) => a.target === "students").length,
    parents:  items.filter((a) => a.target === "parents").length,
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 className="ea-page-title" style={{ marginBottom: 4 }}>Announcements</h1>
          <p className="ea-page-subtitle">{items.length} announcement{items.length !== 1 ? "s" : ""} total</p>
        </div>
        {!showForm && (
          <button onClick={startAdd} style={{ ...btnPrimary, display: "flex", alignItems: "center", gap: 8 }}>
            <i className="fas fa-plus" /> New Announcement
          </button>
        )}
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { key: "all",      icon: "📢", label: "Broadcast (All)",  bg: "#e0f2fe", color: "#0369a1" },
          { key: "students", icon: "🎓", label: "Students Only",    bg: "#dcfce7", color: "#15803d" },
          { key: "parents",  icon: "👨‍👧", label: "Parents Only",    bg: "#fef3c7", color: "#b45309" },
        ].map(({ key, icon, label, bg, color }) => (
          <div key={key} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: "18px 20px", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
              {icon}
            </div>
            <div>
              <p style={{ fontSize: 11, color: "#9ca3af", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>{label}</p>
              <p style={{ fontSize: 26, fontWeight: 800, color, margin: 0, lineHeight: 1 }}>{counts[key]}</p>
            </div>
          </div>
        ))}
      </div>

      <Msg msg={msg} />

      {/* Form */}
      {showForm && (
        <SectionCard style={{ borderLeft: "4px solid #4f46e5", marginBottom: 28 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, marginTop: 0, color: "#1e1b4b" }}>
            {editId ? "✏️ Edit Announcement" : "📢 New Announcement"}
          </h3>
          <form onSubmit={save}>
            <Field label="Title" name="title" value={form.title} onChange={set} placeholder="e.g. School closes early on Friday" required />

            {/* Target audience selector */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontWeight: 600, fontSize: 13, marginBottom: 8, color: "#374151" }}>
                Send To <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                {TARGET_OPTIONS.map(({ value, label }) => {
                  const badge = targetBadge[value];
                  const active = form.target === value;
                  return (
                    <label key={value} style={{
                      display: "flex", alignItems: "center", gap: 10, padding: "12px 14px",
                      border: `2px solid ${active ? badge.color : "#e5e7eb"}`,
                      borderRadius: 8, cursor: "pointer",
                      background: active ? badge.bg : "#fff",
                      transition: "all 0.15s",
                    }}>
                      <input type="radio" name="target" value={value} checked={active} onChange={set} style={{ accentColor: badge.color }} />
                      <span style={{ fontSize: 13, fontWeight: active ? 700 : 500, color: active ? badge.color : "#374151" }}>{label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <Field label="Message Body" name="body" value={form.body} onChange={set} textarea placeholder="Write your announcement here…" required />

            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <button type="submit" disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.7 : 1, display: "flex", alignItems: "center", gap: 8 }}>
                <i className={saving ? "fas fa-spinner fa-spin" : "fas fa-paper-plane"} />
                {saving ? "Publishing…" : editId ? "Update" : "Publish"}
              </button>
              <button type="button" onClick={cancelForm} style={{ ...btnSecondary }}>Cancel</button>
            </div>
          </form>
        </SectionCard>
      )}

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
          <i className="fas fa-search" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: 13 }} />
          <input
            type="text"
            placeholder="Search announcements…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "100%", padding: "10px 12px 10px 36px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }}
          />
        </div>
        <select
          value={filterTarget}
          onChange={(e) => setFilterTarget(e.target.value)}
          style={{ padding: "10px 14px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, background: "#fff", color: "#374151", minWidth: 180 }}
        >
          <option value="all-filter">All Audiences</option>
          <option value="all">Broadcast (All)</option>
          <option value="students">Students only</option>
          <option value="parents">Parents only</option>
        </select>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <SectionCard>
          <p style={{ textAlign: "center", color: "#9ca3af", fontSize: 14, margin: "24px 0" }}>
            {search || filterTarget !== "all-filter"
              ? "No announcements match your filters."
              : 'No announcements yet. Click "New Announcement" to publish one.'}
          </p>
        </SectionCard>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map((a) => {
            const badge = targetBadge[a.target] || targetBadge.all;
            return (
              <div key={a.id} style={{
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderLeft: `4px solid ${badge.color}`,
                borderRadius: 10,
                padding: "16px 20px",
                display: "flex",
                gap: 16,
                alignItems: "flex-start",
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
                    <strong style={{ fontSize: 14, color: "#111827" }}>{a.title}</strong>
                    <span style={{ background: badge.bg, color: badge.color, fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 20 }}>
                      {badge.label}
                    </span>
                  </div>
                  <p style={{ margin: "0 0 8px", color: "#6b7280", fontSize: 13, lineHeight: 1.6 }}>{a.body}</p>
                  <span style={{ fontSize: 11, color: "#9ca3af" }}>
                    {new Date(a.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <button onClick={() => startEdit(a)} style={{ ...btnSecondary, display: "flex", alignItems: "center", gap: 6 }}>
                    <i className="fas fa-edit" /> Edit
                  </button>
                  <button onClick={() => del(a.id)} style={{ ...btnDanger, display: "flex", alignItems: "center", gap: 6 }}>
                    <i className="fas fa-trash" /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
