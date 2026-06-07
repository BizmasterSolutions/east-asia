"use client";
import { useState, useEffect } from "react";
import { Field, Msg, SectionCard, ImageUpload, btnPrimary, btnDanger, btnSecondary } from "../home-content/Shared";

const EMPTY = {
  title: "", description: "", eventDate: "",
  category: "School", location: "", time: "",
  organizerName: "", color: "blue", imagePath: "",
};

const COLOR_OPTIONS = ["blue", "orange", "green", "red"];
const CATEGORY_OPTIONS = ["School", "Sports", "Music", "Science", "Arts", "Technology", "Cultural", "Academic"];

export default function EventsAdminSection() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const load = () =>
    fetch("/api/admin/events")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setEvents(data);
        else setMsg({ ok: false, text: data.detail || data.message || "Failed to load events." });
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

  const startEdit = (ev) => {
    setEditId(ev.id);
    setForm({
      title: ev.title,
      description: ev.description || "",
      eventDate: ev.eventDate ? ev.eventDate.split("T")[0] : "",
      category: ev.category || "School",
      location: ev.location || "",
      time: ev.time || "",
      organizerName: ev.organizerName || "",
      color: ev.color || "blue",
      imagePath: ev.imagePath || "",
    });
    setShowForm(true);
    setMsg(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelForm = () => { setEditId(null); setForm(EMPTY); setShowForm(false); setMsg(null); };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true); setMsg(null);
    const url = editId ? `/api/admin/events/${editId}` : "/api/admin/events";
    const res = await fetch(url, {
      method: editId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setMsg({ ok: true, text: editId ? "Event updated successfully." : "Event added successfully." });
      setForm(EMPTY); setEditId(null); setShowForm(false); load();
    } else {
      const data = await res.json();
      setMsg({ ok: false, text: data.message || "Something went wrong." });
    }
    setSaving(false);
  };

  const del = async (id) => {
    if (!confirm("Delete this event? This cannot be undone.")) return;
    const res = await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
    if (res.ok) { setMsg({ ok: true, text: "Event deleted." }); load(); }
    else setMsg({ ok: false, text: "Failed to delete." });
  };

  const filtered = events.filter((ev) =>
    ev.title.toLowerCase().includes(search.toLowerCase()) ||
    (ev.category || "").toLowerCase().includes(search.toLowerCase())
  );

  const colorBadge = {
    blue: { bg: "#dbeafe", color: "#1d4ed8" },
    orange: { bg: "#ffedd5", color: "#c2410c" },
    green: { bg: "#dcfce7", color: "#15803d" },
    red: { bg: "#fee2e2", color: "#b91c1c" },
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 className="ea-page-title" style={{ marginBottom: 4 }}>Events</h1>
          <p className="ea-page-subtitle">{events.length} event{events.length !== 1 ? "s" : ""} total</p>
        </div>
        {!showForm && (
          <button onClick={startAdd} style={{ ...btnPrimary, display: "flex", alignItems: "center", gap: 8 }}>
            <i className="fas fa-plus" /> Add Event
          </button>
        )}
      </div>

      <Msg msg={msg} />

      {/* Form */}
      {showForm && (
        <SectionCard style={{ borderLeft: "4px solid #4f46e5", marginBottom: 28 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, marginTop: 0, color: "#1e1b4b" }}>
            {editId ? "✏️ Edit Event" : "➕ Add New Event"}
          </h3>
          <form onSubmit={save}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
              <div style={{ gridColumn: "1 / -1" }}>
                <Field label="Event Title" name="title" value={form.title} onChange={set} placeholder="e.g. Annual Sports Day" required />
              </div>
              <Field label="Event Date" name="eventDate" value={form.eventDate} onChange={set} type="date" required />
              <Field label="Time" name="time" value={form.time} onChange={set} placeholder="e.g. 08:00 AM – 12:00 PM" />
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: "block", fontWeight: 600, fontSize: 13, marginBottom: 4, color: "#374151" }}>
                  Category <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <select name="category" value={form.category} onChange={set}
                  style={{ width: "100%", padding: "9px 12px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 14, background: "#fff" }}>
                  {CATEGORY_OPTIONS.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: "block", fontWeight: 600, fontSize: 13, marginBottom: 4, color: "#374151" }}>
                  Badge Colour
                </label>
                <select name="color" value={form.color} onChange={set}
                  style={{ width: "100%", padding: "9px 12px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 14, background: "#fff" }}>
                  {COLOR_OPTIONS.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
              </div>
              <Field label="Location" name="location" value={form.location} onChange={set} placeholder="e.g. School Sports Ground" />
              <div style={{ gridColumn: "1 / -1" }}>
                <Field label="Organiser Name" name="organizerName" value={form.organizerName} onChange={set} placeholder="e.g. Mr. John Smith" />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <Field label="Description" name="description" value={form.description} onChange={set} textarea placeholder="Event details…" />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <ImageUpload
                  label="Event Image"
                  currentUrl={form.imagePath}
                  onUpload={(url) => setForm((p) => ({ ...p, imagePath: url }))}
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <button type="submit" disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.7 : 1, display: "flex", alignItems: "center", gap: 8 }}>
                <i className={saving ? "fas fa-spinner fa-spin" : "fas fa-save"} />
                {saving ? "Saving…" : editId ? "Update Event" : "Add Event"}
              </button>
              <button type="button" onClick={cancelForm} style={{ ...btnSecondary }}>Cancel</button>
            </div>
          </form>
        </SectionCard>
      )}

      {/* Search */}
      <div style={{ marginBottom: 20, position: "relative" }}>
        <i className="fas fa-search" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: 13 }} />
        <input
          type="text"
          placeholder="Search events by title or category…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: "100%", padding: "10px 12px 10px 36px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }}
        />
      </div>

      {/* Events Table */}
      {filtered.length === 0 ? (
        <SectionCard>
          <p style={{ textAlign: "center", color: "#9ca3af", fontSize: 14, margin: "24px 0" }}>
            {search ? "No events match your search." : "No events yet. Click \"Add Event\" to create one."}
          </p>
        </SectionCard>
      ) : (
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#374151" }}>Event</th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#374151" }}>Date</th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#374151" }}>Category</th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#374151" }}>Location</th>
                <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: 600, color: "#374151" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((ev, i) => {
                const badge = colorBadge[ev.color] || colorBadge.blue;
                return (
                  <tr key={ev.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                    <td style={{ padding: "14px 16px", maxWidth: 280 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        {/* Fixed wrapper prevents Bootstrap img rules from stretching the thumbnail */}
                        <div style={{ width: 52, height: 52, borderRadius: 8, overflow: "hidden", flexShrink: 0, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {ev.imagePath ? (
                            <img src={ev.imagePath} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                          ) : (
                            <i className="fas fa-calendar-alt" style={{ color: "#9ca3af", fontSize: 18 }} />
                          )}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontWeight: 600, margin: "0 0 2px", color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 180 }}>{ev.title}</p>
                          {ev.organizerName && <p style={{ fontSize: 12, color: "#6b7280", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 180 }}>{ev.organizerName}</p>}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px", color: "#374151", whiteSpace: "nowrap" }}>
                      <div style={{ fontWeight: 500 }}>{new Date(ev.eventDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</div>
                      {ev.time && <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{ev.time}</div>}
                    </td>
                    <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                      <span style={{ background: badge.bg, color: badge.color, borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 600 }}>
                        {ev.category}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px", color: "#6b7280", fontSize: 13, whiteSpace: "nowrap" }}>{ev.location || "—"}</td>
                    <td style={{ padding: "14px 16px", textAlign: "center" }}>
                      <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                        <button onClick={() => startEdit(ev)} style={{ ...btnSecondary, display: "flex", alignItems: "center", gap: 6 }}>
                          <i className="fas fa-edit" /> Edit
                        </button>
                        <button onClick={() => del(ev.id)} style={{ ...btnDanger, display: "flex", alignItems: "center", gap: 6 }}>
                          <i className="fas fa-trash" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
