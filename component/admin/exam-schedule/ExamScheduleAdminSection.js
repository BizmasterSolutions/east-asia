"use client";
import { useState, useEffect } from "react";
import { Field, Msg, SectionCard, btnPrimary, btnDanger, btnSecondary } from "../home-content/Shared";

const GRADES = [
  "All Grades",
  "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6",
  "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12",
];

const EMPTY = { grade: "Grade 1", examName: "", examDate: "", pdfPath: "" };

function PdfUpload({ currentUrl, onUpload }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    if (currentUrl) fd.append("oldUrl", currentUrl);
    try {
      const res = await fetch("/api/admin/upload-pdf", { method: "POST", body: fd });
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

  const remove = () => onUpload("");

  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: "block", fontWeight: 600, fontSize: 13, marginBottom: 6, color: "#374151" }}>
        Exam Schedule PDF <span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 400 }}>(optional)</span>
      </label>

      {currentUrl && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, padding: "10px 14px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8 }}>
          <i className="fas fa-file-pdf" style={{ color: "#dc2626", fontSize: 20 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {currentUrl.split("/").pop()}
            </p>
            <a href={currentUrl} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: "#16a34a" }}>
              Preview PDF ↗
            </a>
          </div>
          <button type="button" onClick={remove} style={{ background: "none", border: "none", cursor: "pointer", color: "#dc2626", fontSize: 13, padding: "2px 6px" }}>
            ✕ Remove
          </button>
        </div>
      )}

      <input
        type="file"
        accept="application/pdf"
        onChange={handleFile}
        disabled={uploading}
        style={{ fontSize: 13 }}
      />
      <span style={{ display: "block", fontSize: 11, color: "#9ca3af", marginTop: 4 }}>PDF only · Max 20 MB</span>
      {uploading && <span style={{ fontSize: 12, color: "#6b7280", display: "block", marginTop: 4 }}>Uploading…</span>}
      {error && (
        <div style={{ marginTop: 6, padding: "7px 12px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 6, color: "#dc2626", fontSize: 13 }}>
          ⚠ {error}
        </div>
      )}
    </div>
  );
}

export default function ExamScheduleAdminSection() {
  const [items, setItems]       = useState([]);
  const [form, setForm]         = useState(EMPTY);
  const [editId, setEditId]     = useState(null);
  const [msg, setMsg]           = useState(null);
  const [saving, setSaving]     = useState(false);
  const [search, setSearch]     = useState("");
  const [filterGrade, setFilterGrade] = useState("all");
  const [showForm, setShowForm] = useState(false);

  const load = () =>
    fetch("/api/admin/exam-schedule")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setItems(data);
        else setMsg({ ok: false, text: data.message || "Failed to load." });
      })
      .catch((e) => setMsg({ ok: false, text: e.message }));

  useEffect(() => { load(); }, []);

  const set = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const startAdd = () => {
    setEditId(null); setForm(EMPTY); setShowForm(true); setMsg(null);
  };

  const startEdit = (item) => {
    setEditId(item.id);
    setForm({
      grade: item.grade,
      examName: item.examName,
      examDate: item.examDate ? item.examDate.split("T")[0] : "",
      pdfPath: item.pdfPath || "",
    });
    setShowForm(true); setMsg(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelForm = () => { setEditId(null); setForm(EMPTY); setShowForm(false); setMsg(null); };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true); setMsg(null);
    const url = editId ? `/api/admin/exam-schedule/${editId}` : "/api/admin/exam-schedule";
    const res = await fetch(url, {
      method: editId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setMsg({ ok: true, text: editId ? "Entry updated." : "Entry added." });
      setForm(EMPTY); setEditId(null); setShowForm(false); load();
    } else {
      const data = await res.json();
      setMsg({ ok: false, text: data.message || "Something went wrong." });
    }
    setSaving(false);
  };

  const del = async (id) => {
    if (!confirm("Delete this exam entry? This cannot be undone.")) return;
    const res = await fetch(`/api/admin/exam-schedule/${id}`, { method: "DELETE" });
    if (res.ok) { setMsg({ ok: true, text: "Entry deleted." }); load(); }
    else setMsg({ ok: false, text: "Failed to delete." });
  };

  const gradeOptions = [...new Set(items.map((i) => i.grade))].sort();

  const filtered = items.filter((a) => {
    const matchSearch =
      a.examName.toLowerCase().includes(search.toLowerCase()) ||
      a.grade.toLowerCase().includes(search.toLowerCase());
    const matchGrade = filterGrade === "all" || a.grade === filterGrade;
    return matchSearch && matchGrade;
  });

  const withPdf = items.filter((i) => i.pdfPath).length;

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 className="ea-page-title" style={{ marginBottom: 4 }}>Exam Schedule</h1>
          <p className="ea-page-subtitle">{items.length} entr{items.length !== 1 ? "ies" : "y"} · {withPdf} with PDF</p>
        </div>
        {!showForm && (
          <button onClick={startAdd} style={{ ...btnPrimary, display: "flex", alignItems: "center", gap: 8 }}>
            <i className="fas fa-plus" /> Add Exam Entry
          </button>
        )}
      </div>

      <Msg msg={msg} />

      {/* Form */}
      {showForm && (
        <SectionCard style={{ borderLeft: "4px solid #4f46e5", marginBottom: 28 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, marginTop: 0, color: "#1e1b4b" }}>
            {editId ? "✏️ Edit Exam Entry" : "➕ Add Exam Entry"}
          </h3>
          <form onSubmit={save}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
              {/* Grade */}
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: "block", fontWeight: 600, fontSize: 13, marginBottom: 4, color: "#374151" }}>
                  Grade <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <select name="grade" value={form.grade} onChange={set}
                  style={{ width: "100%", padding: "9px 12px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 14, background: "#fff" }}>
                  {GRADES.map((g) => <option key={g}>{g}</option>)}
                </select>
              </div>

              <Field label="Exam Name" name="examName" value={form.examName} onChange={set}
                placeholder="e.g. Mid-Term Examination" required />

              <Field label="Exam Date" name="examDate" value={form.examDate} onChange={set}
                type="date" required />

              {/* PDF upload spans full width */}
              <div style={{ gridColumn: "1 / -1" }}>
                <PdfUpload
                  currentUrl={form.pdfPath}
                  onUpload={(url) => setForm((p) => ({ ...p, pdfPath: url }))}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <button type="submit" disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.7 : 1, display: "flex", alignItems: "center", gap: 8 }}>
                <i className={saving ? "fas fa-spinner fa-spin" : "fas fa-save"} />
                {saving ? "Saving…" : editId ? "Update" : "Add Entry"}
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
            placeholder="Search by exam, subject or grade…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "100%", padding: "10px 12px 10px 36px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }}
          />
        </div>
        <select
          value={filterGrade}
          onChange={(e) => setFilterGrade(e.target.value)}
          style={{ padding: "10px 14px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, background: "#fff", color: "#374151" }}
        >
          <option value="all">All Grades</option>
          {gradeOptions.map((g) => <option key={g}>{g}</option>)}
        </select>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <SectionCard>
          <p style={{ textAlign: "center", color: "#9ca3af", fontSize: 14, margin: "24px 0" }}>
            {search || filterGrade !== "all"
              ? "No entries match your filters."
              : 'No exam entries yet. Click "Add Exam Entry" to get started.'}
          </p>
        </SectionCard>
      ) : (
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#374151" }}>Exam Name</th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#374151" }}>Grade</th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#374151" }}>Date</th>
                <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: 600, color: "#374151" }}>PDF</th>
                <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: 600, color: "#374151" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, i) => {
                const daysLeft = Math.ceil((new Date(item.examDate) - new Date()) / (1000 * 60 * 60 * 24));
                const urgency = daysLeft <= 7 ? "#ef4444" : daysLeft <= 14 ? "#f59e0b" : "#16a34a";
                return (
                  <tr key={item.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                    <td style={{ padding: "14px 16px" }}>
                      <p style={{ fontWeight: 600, margin: 0, color: "#111827" }}>{item.examName}</p>
                      <span style={{ fontSize: 11, color: "#9ca3af" }}>
                        {daysLeft > 0 ? (
                          <span style={{ color: urgency, fontWeight: 600 }}>{daysLeft}d left</span>
                        ) : daysLeft === 0 ? (
                          <span style={{ color: "#ef4444", fontWeight: 600 }}>Today</span>
                        ) : (
                          <span style={{ color: "#9ca3af" }}>Past</span>
                        )}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ background: "#e0f2fe", color: "#0369a1", fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 20 }}>
                        {item.grade}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px", color: "#374151", whiteSpace: "nowrap" }}>
                      {new Date(item.examDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td style={{ padding: "14px 16px", textAlign: "center" }}>
                      {item.pdfPath ? (
                        <a href={item.pdfPath} target="_blank" rel="noreferrer"
                          style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", borderRadius: 6, padding: "4px 10px", fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
                          <i className="fas fa-file-pdf" /> PDF
                        </a>
                      ) : (
                        <span style={{ color: "#d1d5db", fontSize: 12 }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: "14px 16px", textAlign: "center" }}>
                      <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                        <button onClick={() => startEdit(item)} style={{ ...btnSecondary, display: "flex", alignItems: "center", gap: 6 }}>
                          <i className="fas fa-edit" /> Edit
                        </button>
                        <button onClick={() => del(item.id)} style={{ ...btnDanger, display: "flex", alignItems: "center", gap: 6 }}>
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
