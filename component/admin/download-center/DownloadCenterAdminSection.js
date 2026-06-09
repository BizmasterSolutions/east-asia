"use client";
import { useState, useEffect } from "react";
import { Msg, SectionCard, btnPrimary, btnDanger, inputStyle } from "../home-content/Shared";

const GRADES = [
  "All Grades",
  "Grade 1","Grade 2","Grade 3","Grade 4","Grade 5","Grade 6",
  "Grade 7","Grade 8","Grade 9","Grade 10","Grade 11","Grade 12",
];

const SECTIONS = [
  { key: "lecture-notes", label: "Lecture Notes",   icon: "📖", color: "#6366f1", accept: ".pdf",                         hint: "PDF only · Max 20 MB" },
  { key: "term-paper",    label: "Term Papers",      icon: "📝", color: "#0891b2", accept: ".pdf",                         hint: "PDF only · Max 20 MB" },
  { key: "mock",          label: "Mock Papers",      icon: "📋", color: "#16a34a", accept: ".pdf",                         hint: "PDF only · Max 20 MB" },
  { key: "past",          label: "Past Papers",      icon: "📚", color: "#ea580c", accept: ".pdf",                         hint: "PDF only · Max 20 MB" },
  { key: "revision",      label: "Revision Notes",   icon: "✏️", color: "#c8a000", accept: ".pdf",                         hint: "PDF only · Max 20 MB" },
  { key: "timetable",     label: "Timetables",       icon: "📅", color: "#7c3aed", accept: ".pdf,.jpg,.jpeg,.png,.webp",   hint: "PDF or Image · Max 20 MB" },
  { key: "images",        label: "Images & Diagrams",icon: "🖼️", color: "#db2777", accept: ".jpg,.jpeg,.png,.webp,.gif,.avif", hint: "JPG, PNG, WEBP, GIF · Max 20 MB" },
];

function FileUpload({ section, onUpload }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState("");

  const handle = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    setFileName(file.name);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/admin/upload-file", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok) onUpload(data.url);
      else setError(data.message || "Upload failed.");
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div>
      <label style={{ display: "block", fontWeight: 600, fontSize: 13, marginBottom: 6, color: "#374151" }}>
        File <span style={{ color: "#ef4444" }}>*</span>
      </label>
      <div style={{ border: "2px dashed #d1d5db", borderRadius: 10, padding: "20px 16px", textAlign: "center", background: "#fafafa" }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>{section.icon}</div>
        <input type="file" accept={section.accept} onChange={handle} disabled={uploading}
          style={{ display: "none" }} id="file-upload" />
        <label htmlFor="file-upload" style={{
          display: "inline-block", padding: "8px 18px", background: section.color, color: "#fff",
          borderRadius: 6, cursor: uploading ? "not-allowed" : "pointer", fontSize: 13, fontWeight: 600,
          opacity: uploading ? 0.7 : 1,
        }}>
          {uploading ? "Uploading…" : "Choose File"}
        </label>
        {fileName && !uploading && (
          <p style={{ margin: "8px 0 0", fontSize: 12, color: "#16a34a", fontWeight: 600 }}>✓ {fileName}</p>
        )}
        <p style={{ margin: "8px 0 0", fontSize: 11, color: "#9ca3af" }}>{section.hint}</p>
      </div>
      {error && (
        <div style={{ marginTop: 8, padding: "7px 12px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 6, color: "#dc2626", fontSize: 13 }}>
          ⚠ {error}
        </div>
      )}
    </div>
  );
}

function isImage(url) {
  return /\.(jpg|jpeg|png|webp|gif|avif)$/i.test(url || "");
}

export default function DownloadCenterAdminSection() {
  const [allFiles, setAllFiles]   = useState([]);
  const [activeKey, setActiveKey] = useState("lecture-notes");
  const [form, setForm]           = useState({ title: "", grade: "All Grades", filePath: "" });
  const [msg, setMsg]             = useState(null);
  const [saving, setSaving]       = useState(false);
  const [search, setSearch]       = useState("");
  const [filterGrade, setFilterGrade] = useState("all");
  const [showForm, setShowForm]   = useState(false);

  const load = () =>
    fetch("/api/admin/downloads")
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setAllFiles(d); })
      .catch((e) => setMsg({ ok: false, text: e.message }));

  useEffect(() => { load(); }, []);

  const activeSection = SECTIONS.find((s) => s.key === activeKey);

  const sectionFiles = allFiles.filter((f) => {
    if (f.category !== activeKey) return false;
    const matchSearch = f.title.toLowerCase().includes(search.toLowerCase());
    const matchGrade  = filterGrade === "all" || f.grade === filterGrade;
    return matchSearch && matchGrade;
  });

  const gradeOptions = [...new Set(allFiles.filter((f) => f.category === activeKey).map((f) => f.grade))].sort();

  const openForm = () => {
    setForm({ title: "", grade: "All Grades", filePath: "" });
    setShowForm(true);
    setMsg(null);
  };

  const save = async (e) => {
    e.preventDefault();
    if (!form.filePath) { setMsg({ ok: false, text: "Please upload a file first." }); return; }
    setSaving(true); setMsg(null);
    const res = await fetch("/api/admin/downloads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: form.title, grade: form.grade, category: activeKey, filePath: form.filePath }),
    });
    if (res.ok) {
      setMsg({ ok: true, text: "File added successfully." });
      setForm({ title: "", grade: "All Grades", filePath: "" });
      setShowForm(false);
      load();
    } else {
      const data = await res.json();
      setMsg({ ok: false, text: data.message || "Something went wrong." });
    }
    setSaving(false);
  };

  const del = async (id) => {
    if (!confirm("Delete this file? This cannot be undone.")) return;
    const res = await fetch(`/api/admin/downloads/${id}`, { method: "DELETE" });
    if (res.ok) { setMsg({ ok: true, text: "File deleted." }); load(); }
    else setMsg({ ok: false, text: "Failed to delete." });
  };

  const totalForSection = allFiles.filter((f) => f.category === activeKey).length;

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 className="ea-page-title" style={{ marginBottom: 4 }}>Download Center</h1>
          <p className="ea-page-subtitle">{allFiles.length} file{allFiles.length !== 1 ? "s" : ""} across all sections</p>
        </div>
      </div>

      {/* Section tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {SECTIONS.map((s) => {
          const count = allFiles.filter((f) => f.category === s.key).length;
          const active = activeKey === s.key;
          return (
            <button key={s.key} onClick={() => { setActiveKey(s.key); setShowForm(false); setMsg(null); setSearch(""); setFilterGrade("all"); }}
              style={{
                display: "flex", alignItems: "center", gap: 6, padding: "8px 16px",
                background: active ? s.color : "#fff",
                color: active ? "#fff" : "#374151",
                border: `2px solid ${active ? s.color : "#e5e7eb"}`,
                borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600,
                transition: "all 0.15s",
              }}>
              {s.icon} {s.label}
              <span style={{
                background: active ? "rgba(255,255,255,0.25)" : "#f3f4f6",
                color: active ? "#fff" : "#6b7280",
                fontSize: 11, fontWeight: 700, padding: "1px 7px", borderRadius: 10,
              }}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Active section card */}
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
        {/* Section header bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid #f3f4f6", background: `${activeSection.color}08` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 22 }}>{activeSection.icon}</span>
            <div>
              <p style={{ fontWeight: 700, fontSize: 15, color: "#111827", margin: 0 }}>{activeSection.label}</p>
              <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>{totalForSection} file{totalForSection !== 1 ? "s" : ""} uploaded</p>
            </div>
          </div>
          {!showForm && (
            <button onClick={openForm} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: activeSection.color, color: "#fff", border: "none", borderRadius: 7, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
              <i className="fas fa-plus" /> Add File
            </button>
          )}
        </div>

        <div style={{ padding: "20px" }}>
          <Msg msg={msg} />

          {/* Upload form */}
          {showForm && (
            <div style={{ border: `2px solid ${activeSection.color}`, borderRadius: 10, padding: "20px", marginBottom: 20, background: `${activeSection.color}05` }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: "0 0 16px" }}>
                Upload to {activeSection.label}
              </h3>
              <form onSubmit={save}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
                  {/* Title */}
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: "block", fontWeight: 600, fontSize: 13, marginBottom: 4, color: "#374151" }}>
                      Title <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <input
                      type="text" value={form.title} required
                      onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                      placeholder="e.g. Chapter 3 – Algebra Notes"
                      style={inputStyle}
                    />
                  </div>

                  {/* Grade */}
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: "block", fontWeight: 600, fontSize: 13, marginBottom: 4, color: "#374151" }}>
                      Visible To <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <select value={form.grade} onChange={(e) => setForm((p) => ({ ...p, grade: e.target.value }))}
                      style={{ ...inputStyle }}>
                      {GRADES.map((g) => <option key={g}>{g}</option>)}
                    </select>
                  </div>

                  {/* File upload – full width */}
                  <div style={{ gridColumn: "1 / -1", marginBottom: 16 }}>
                    <FileUpload
                      section={activeSection}
                      onUpload={(url) => setForm((p) => ({ ...p, filePath: url }))}
                    />
                    {form.filePath && (
                      <p style={{ marginTop: 6, fontSize: 12, color: "#16a34a", fontWeight: 600 }}>
                        ✓ Uploaded: {form.filePath.split("/").pop()}
                      </p>
                    )}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <button type="submit" disabled={saving || !form.filePath}
                    style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 20px", background: form.filePath ? activeSection.color : "#d1d5db", color: "#fff", border: "none", borderRadius: 6, cursor: form.filePath ? "pointer" : "not-allowed", fontSize: 14, fontWeight: 600 }}>
                    <i className={saving ? "fas fa-spinner fa-spin" : "fas fa-upload"} />
                    {saving ? "Saving…" : "Add File"}
                  </button>
                  <button type="button" onClick={() => { setShowForm(false); setMsg(null); }}
                    style={{ padding: "9px 20px", background: "#f3f4f6", color: "#374151", border: "1px solid #e5e7eb", borderRadius: 6, cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Filters */}
          <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 180, position: "relative" }}>
              <i className="fas fa-search" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: 12 }} />
              <input type="text" placeholder="Search files…" value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ ...inputStyle, paddingLeft: 32 }} />
            </div>
            <select value={filterGrade} onChange={(e) => setFilterGrade(e.target.value)}
              style={{ ...inputStyle, width: "auto", minWidth: 160 }}>
              <option value="all">All Grades</option>
              {gradeOptions.map((g) => <option key={g}>{g}</option>)}
            </select>
          </div>

          {/* Files grid */}
          {sectionFiles.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px", border: "2px dashed #e5e7eb", borderRadius: 10 }}>
              <p style={{ fontSize: 36, margin: "0 0 8px" }}>{activeSection.icon}</p>
              <p style={{ color: "#9ca3af", fontSize: 14, margin: 0 }}>
                {search || filterGrade !== "all"
                  ? "No files match your filters."
                  : `No files in ${activeSection.label} yet. Click "Add File" to upload one.`}
              </p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
              {sectionFiles.map((file) => {
                const img = isImage(file.filePath);
                return (
                  <div key={file.id} style={{ background: "#fafafa", border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden" }}>
                    {/* Preview */}
                    {img ? (
                      <div style={{ width: "100%", height: 120, overflow: "hidden", background: "#f3f4f6" }}>
                        <img src={file.filePath} alt={file.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                    ) : (
                      <div style={{ height: 80, background: `${activeSection.color}12`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <i className="fas fa-file-pdf" style={{ fontSize: 36, color: activeSection.color }} />
                      </div>
                    )}

                    <div style={{ padding: "12px 14px" }}>
                      <p style={{ fontWeight: 600, fontSize: 13, color: "#111827", margin: "0 0 4px", lineHeight: 1.4 }}>{file.title}</p>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                        <span style={{ background: `${activeSection.color}15`, color: activeSection.color, fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 10 }}>
                          {file.grade}
                        </span>
                        <span style={{ fontSize: 11, color: "#9ca3af" }}>
                          {new Date(file.uploadedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: 6 }}>
                        <a href={file.filePath} target="_blank" rel="noreferrer"
                          style={{ flex: 1, display: "block", textAlign: "center", padding: "6px", background: activeSection.color, color: "#fff", borderRadius: 6, textDecoration: "none", fontSize: 12, fontWeight: 600 }}>
                          ↓ Preview
                        </a>
                        <button onClick={() => del(file.id)}
                          style={{ padding: "6px 10px", background: "#fee2e2", color: "#dc2626", border: "1px solid #fecaca", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>
                          <i className="fas fa-trash" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
