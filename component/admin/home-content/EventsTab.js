"use client";
import { useState, useEffect } from "react";
import { Field, Msg, SectionCard, btnPrimary } from "./Shared";

const EMPTY = { title: "", description: "", eventDate: "" };

export default function EventsTab() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () =>
    fetch("/api/admin/home-content/events").then((r) => r.json()).then(setEvents);

  useEffect(() => { load(); }, []);

  const set = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const startEdit = (ev) => {
    setEditId(ev.id);
    setForm({
      title: ev.title,
      description: ev.description || "",
      eventDate: ev.eventDate ? ev.eventDate.split("T")[0] : "",
    });
  };
  const cancelEdit = () => { setEditId(null); setForm(EMPTY); };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true); setMsg(null);
    const url = editId ? `/api/admin/home-content/events/${editId}` : "/api/admin/home-content/events";
    const res = await fetch(url, {
      method: editId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) { setMsg({ ok: true, text: editId ? "Updated." : "Added." }); setForm(EMPTY); setEditId(null); load(); }
    else setMsg({ ok: false, text: (await res.json()).message });
    setSaving(false);
  };

  const del = async (id) => {
    if (!confirm("Delete this event?")) return;
    await fetch(`/api/admin/home-content/events/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div>
      <Msg msg={msg} />
      <SectionCard>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, marginTop: 0 }}>
          {editId ? "Edit Event" : "Add Event"}
        </h3>
        <form onSubmit={save}>
          <Field label="Title" name="title" value={form.title} onChange={set} placeholder="Event name…" required />
          <Field label="Date" name="eventDate" value={form.eventDate} onChange={set} type="date" required />
          <Field label="Description" name="description" value={form.description} onChange={set} textarea placeholder="Optional details…" />
          <div style={{ display: "flex", gap: 10 }}>
            <button type="submit" disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.7 : 1 }}>
              {saving ? "Saving…" : editId ? "Update" : "Add Event"}
            </button>
            {editId && <button type="button" onClick={cancelEdit} style={{ ...btnPrimary, background: "#6b7280" }}>Cancel</button>}
          </div>
        </form>
      </SectionCard>

      {events.length === 0 && <p style={{ color: "#9ca3af", fontSize: 14 }}>No events yet.</p>}
      {events.map((ev) => (
        <SectionCard key={ev.id}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
                <span style={{ background: "#ede9fe", color: "#6d28d9", borderRadius: 6, padding: "3px 10px", fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
                  {new Date(ev.eventDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </span>
                <p style={{ fontWeight: 700, fontSize: 15, margin: 0 }}>{ev.title}</p>
              </div>
              {ev.description && <p style={{ fontSize: 13, color: "#6b7280", margin: 0, lineHeight: 1.5 }}>{ev.description}</p>}
            </div>
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              <button onClick={() => startEdit(ev)} style={{ fontSize: 12, padding: "4px 12px", background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", borderRadius: 4, cursor: "pointer" }}>Edit</button>
              <button onClick={() => del(ev.id)} style={{ fontSize: 12, padding: "4px 12px", background: "#fee2e2", color: "#dc2626", border: "1px solid #fecaca", borderRadius: 4, cursor: "pointer" }}>Delete</button>
            </div>
          </div>
        </SectionCard>
      ))}
    </div>
  );
}
