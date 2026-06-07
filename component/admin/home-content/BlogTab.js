"use client";
import { useState, useEffect } from "react";
import { Field, ImageUpload, Msg, SectionCard, btnPrimary, btnDanger, btnSecondary, inputStyle } from "./Shared";

const COLORS = ["light_blue", "orange", "green", "red", "blue"];
const BLANK = { title: "", slug: "", category: "", categoryColor: "light_blue", description: "", imagePath: "", author: "" };

function toSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function BlogTab() {
  const [heading, setHeading] = useState({ blog_subtitle: "", blog_heading: "" });
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(BLANK);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const load = () =>
    fetch("/api/admin/home-content/blog")
      .then((r) => r.json())
      .then((d) => { setHeading(d.heading); setItems(d.items); })
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const changeHeading = (e) => setHeading((h) => ({ ...h, [e.target.name]: e.target.value }));
  const changeForm = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value, ...(name === "title" && !editId ? { slug: toSlug(value) } : {}) }));
  };

  const saveHeading = async () => {
    setSaving(true); setMsg(null);
    const res = await fetch("/api/admin/home-content/blog", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(heading) });
    const d = await res.json();
    setMsg({ ok: res.ok, text: d.message });
    setSaving(false);
  };

  const saveItem = async () => {
    setSaving(true); setMsg(null);
    const url = editId ? `/api/admin/home-content/blog/${editId}` : "/api/admin/home-content/blog";
    const method = editId ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const d = await res.json();
    if (res.ok) { setForm(BLANK); setEditId(null); await load(); setMsg({ ok: true, text: editId ? "Post updated." : "Post added." }); }
    else setMsg({ ok: false, text: d.message });
    setSaving(false);
  };

  const remove = async (id) => {
    if (!confirm("Delete this blog post?")) return;
    await fetch(`/api/admin/home-content/blog/${id}`, { method: "DELETE" });
    await load();
  };

  const startEdit = (item) => {
    setForm({ title: item.title, slug: item.slug, category: item.category, categoryColor: item.categoryColor, description: item.description, imagePath: item.imagePath || "", author: item.author || "" });
    setEditId(item.id);
  };
  const cancelEdit = () => { setForm(BLANK); setEditId(null); };

  if (loading) return <p style={{ color: "#6b7280" }}>Loading…</p>;

  return (
    <div>
      <Msg msg={msg} />

      <SectionCard>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: "#111827" }}>Section Heading</h3>
        <Field label="Subtitle" name="blog_subtitle" value={heading.blog_subtitle} onChange={changeHeading} />
        <Field label="Main Heading" name="blog_heading" value={heading.blog_heading} onChange={changeHeading} />
        <button onClick={saveHeading} disabled={saving} style={btnPrimary}>{saving ? "Saving…" : "Save Heading"}</button>
      </SectionCard>

      <SectionCard>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: "#111827" }}>{editId ? "Edit Blog Post" : "Add Blog Post"}</h3>
        <Field label="Title" name="title" value={form.title} onChange={changeForm} required />
        <Field label="Slug (URL)" name="slug" value={form.slug} onChange={changeForm} hint="Auto-generated from title. Edit if needed." />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
          <Field label="Category" name="category" value={form.category} onChange={changeForm} placeholder="e.g. design, technology" required />
          <div>
            <label style={{ display: "block", fontWeight: 600, fontSize: 13, marginBottom: 4, color: "#374151" }}>Category Color</label>
            <select name="categoryColor" value={form.categoryColor} onChange={changeForm} style={inputStyle}>
              {COLORS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <Field label="Description" name="description" value={form.description} onChange={changeForm} textarea required />
        <Field label="Author" name="author" value={form.author} onChange={changeForm} placeholder="e.g. John Doe" />
        <ImageUpload label="Cover Image" currentUrl={form.imagePath} onUpload={(url) => setForm((f) => ({ ...f, imagePath: url }))} />
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={saveItem} disabled={saving} style={btnPrimary}>{saving ? "Saving…" : editId ? "Update" : "Add Post"}</button>
          {editId && <button onClick={cancelEdit} style={btnSecondary}>Cancel</button>}
        </div>
      </SectionCard>

      <SectionCard>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: "#111827" }}>Blog Posts ({items.length})</h3>
        {items.length === 0 && <p style={{ color: "#6b7280", fontSize: 13 }}>No posts yet. Add one above.</p>}
        {items.map((item) => (
          <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: "1px solid #f3f4f6" }}>
            {/* Thumbnail */}
            <div style={{ flexShrink: 0, width: 80, height: 56, borderRadius: 6, overflow: "hidden", background: "#f3f4f6" }}>
              {item.imagePath
                ? <img src={item.imagePath} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <i className="fas fa-image" style={{ color: "#d1d5db", fontSize: 20 }} />
                  </div>
              }
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {item.title}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4, flexWrap: "wrap" }}>
                <span style={{ background: "#ede9fe", color: "#6d28d9", borderRadius: 4, padding: "1px 8px", fontSize: 11, fontWeight: 600 }}>
                  {item.category}
                </span>
                {item.author && (
                  <span style={{ fontSize: 12, color: "#6b7280" }}>by {item.author}</span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div style={{ flexShrink: 0, display: "flex", gap: 6 }}>
              <button onClick={() => startEdit(item)} style={btnSecondary}>Edit</button>
              <button onClick={() => remove(item.id)} style={btnDanger}>Delete</button>
            </div>
          </div>
        ))}
      </SectionCard>
    </div>
  );
}
