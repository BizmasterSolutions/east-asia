"use client";
import { useState, useEffect, useCallback } from "react";
import { Msg, SectionCard, btnPrimary, btnDanger, btnSecondary, inputStyle } from "../home-content/Shared";

const TERMS = ["Term 1", "Term 2", "Term 3", "Term 4", "Mid-Term", "Final"];

function autoGrade(m) {
  const v = parseFloat(m);
  if (v >= 90) return "A+";
  if (v >= 80) return "A";
  if (v >= 70) return "B+";
  if (v >= 60) return "B";
  if (v >= 50) return "C";
  if (v >= 40) return "D";
  return "F";
}

function gradeColor(g) {
  if (!g) return "#6b7280";
  if (g === "A+" || g === "A") return "#16a34a";
  if (g === "B+" || g === "B") return "#0891b2";
  if (g === "C") return "#f59e0b";
  if (g === "D") return "#ea580c";
  return "#ef4444";
}

export default function ExamResultsAdminSection() {
  // ── Subjects (global) ─────────────────────────────────────────────────
  const [allSubjects, setAllSubjects] = useState([]);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [subjectMsg, setSubjectMsg] = useState(null);
  const [addingSubject, setAddingSubject] = useState(false);

  // ── Student picker ────────────────────────────────────────────────────
  const [students, setStudents] = useState([]);
  const [studentSearch, setStudentSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // ── Student tabs ──────────────────────────────────────────────────────
  const [tab, setTab] = useState("results");
  const [enrollments, setEnrollments] = useState([]);
  const [enrollSubjectId, setEnrollSubjectId] = useState("");
  const [marks, setMarks] = useState([]);
  const [filterTerm, setFilterTerm] = useState("all");
  const [showMarkForm, setShowMarkForm] = useState(false);
  const [editMarkId, setEditMarkId] = useState(null);
  const [markForm, setMarkForm] = useState({ subjectId: "", term: "Term 1", marks: "", teacherRemarks: "" });

  const [studentMsg, setStudentMsg] = useState(null);
  const [saving, setSaving] = useState(false);

  // ── Load on mount ─────────────────────────────────────────────────────
  useEffect(() => {
    fetch("/api/admin/students").then(r => r.json()).then(d => { if (Array.isArray(d)) setStudents(d); });
    loadSubjects();
  }, []);

  const loadSubjects = () => {
    fetch("/api/admin/subjects").then(r => r.json()).then(d => { if (Array.isArray(d)) setAllSubjects(d); });
  };

  const loadStudentData = useCallback((studentId) => {
    fetch(`/api/admin/enrollments?studentId=${studentId}`).then(r => r.json()).then(d => { if (Array.isArray(d)) setEnrollments(d); });
    fetch(`/api/admin/marks?studentId=${studentId}`).then(r => r.json()).then(d => { if (Array.isArray(d)) setMarks(d); });
  }, []);

  useEffect(() => {
    if (selectedStudent) loadStudentData(selectedStudent.id);
  }, [selectedStudent, loadStudentData]);

  // ── Subject actions ───────────────────────────────────────────────────
  const addSubject = async () => {
    if (!newSubjectName.trim()) return;
    setAddingSubject(true); setSubjectMsg(null);
    const res = await fetch("/api/admin/subjects", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newSubjectName.trim() }),
    });
    setAddingSubject(false);
    if (res.ok) {
      setNewSubjectName("");
      loadSubjects();
      setSubjectMsg({ ok: true, text: "Subject added." });
    } else {
      const d = await res.json(); setSubjectMsg({ ok: false, text: d.message });
    }
  };

  const deleteSubject = async (id, name) => {
    if (!confirm(`Delete subject "${name}"? This will also remove all related marks and enrollments.`)) return;
    const res = await fetch(`/api/admin/subjects/${id}`, { method: "DELETE" });
    if (res.ok) { loadSubjects(); setSubjectMsg({ ok: true, text: "Subject deleted." }); }
    else { const d = await res.json(); setSubjectMsg({ ok: false, text: d.message }); }
  };

  // ── Student picker actions ────────────────────────────────────────────
  const selectStudent = (s) => {
    setSelectedStudent(s);
    setStudentSearch(s.fullName);
    setShowDropdown(false);
    setTab("results");
    setShowMarkForm(false);
    setStudentMsg(null);
    setFilterTerm("all");
  };

  const filteredStudents = students.filter(s =>
    s.fullName.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.username.toLowerCase().includes(studentSearch.toLowerCase())
  );

  // ── Enrollment actions ────────────────────────────────────────────────
  const enroll = async () => {
    if (!enrollSubjectId || !selectedStudent) return;
    setSaving(true); setStudentMsg(null);
    const res = await fetch("/api/admin/enrollments", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId: selectedStudent.id, subjectId: parseInt(enrollSubjectId) }),
    });
    setSaving(false);
    if (res.ok) {
      setEnrollSubjectId("");
      setStudentMsg({ ok: true, text: "Subject enrolled successfully." });
      loadStudentData(selectedStudent.id);
    } else {
      const d = await res.json(); setStudentMsg({ ok: false, text: d.message });
    }
  };

  const removeEnrollment = async (id) => {
    if (!confirm("Remove this subject enrollment? Related marks will remain.")) return;
    const res = await fetch(`/api/admin/enrollments/${id}`, { method: "DELETE" });
    if (res.ok) { setStudentMsg({ ok: true, text: "Enrollment removed." }); loadStudentData(selectedStudent.id); }
    else { const d = await res.json(); setStudentMsg({ ok: false, text: d.message }); }
  };

  // ── Mark actions ──────────────────────────────────────────────────────
  const openAddMark = () => {
    setEditMarkId(null);
    setMarkForm({ subjectId: enrollments[0] ? String(enrollments[0].subjectId) : "", term: "Term 1", marks: "", teacherRemarks: "" });
    setShowMarkForm(true);
    setStudentMsg(null);
  };

  const openEditMark = (m) => {
    setEditMarkId(m.id);
    setMarkForm({ subjectId: String(m.subjectId), term: m.term, marks: String(m.marks), teacherRemarks: m.teacherRemarks || "" });
    setShowMarkForm(true);
    setStudentMsg(null);
  };

  const saveMark = async (e) => {
    e.preventDefault();
    setSaving(true); setStudentMsg(null);
    if (editMarkId) {
      const res = await fetch(`/api/admin/marks/${editMarkId}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ marks: parseFloat(markForm.marks), grade: autoGrade(markForm.marks), teacherRemarks: markForm.teacherRemarks || null }),
      });
      if (res.ok) { setStudentMsg({ ok: true, text: "Result updated." }); setShowMarkForm(false); loadStudentData(selectedStudent.id); }
      else { const d = await res.json(); setStudentMsg({ ok: false, text: d.message }); }
    } else {
      const res = await fetch("/api/admin/marks", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: selectedStudent.id, subjectId: parseInt(markForm.subjectId), term: markForm.term, marks: parseFloat(markForm.marks), grade: autoGrade(markForm.marks), teacherRemarks: markForm.teacherRemarks || null }),
      });
      if (res.ok) { setStudentMsg({ ok: true, text: "Result added." }); setShowMarkForm(false); loadStudentData(selectedStudent.id); }
      else { const d = await res.json(); setStudentMsg({ ok: false, text: d.message }); }
    }
    setSaving(false);
  };

  const deleteMark = async (id) => {
    if (!confirm("Delete this result?")) return;
    const res = await fetch(`/api/admin/marks/${id}`, { method: "DELETE" });
    if (res.ok) { setStudentMsg({ ok: true, text: "Result deleted." }); loadStudentData(selectedStudent.id); }
    else { const d = await res.json(); setStudentMsg({ ok: false, text: d.message }); }
  };

  // ── Derived values ────────────────────────────────────────────────────
  const terms = [...new Set(marks.map(m => m.term))].sort();
  const filteredMarks = filterTerm === "all" ? marks : marks.filter(m => m.term === filterTerm);
  const enrolledSubjectIds = new Set(enrollments.map(e => e.subjectId));
  const unenrolledSubjects = allSubjects.filter(s => !enrolledSubjectIds.has(s.id));
  const avg = marks.length ? Math.round(marks.reduce((s, m) => s + m.marks, 0) / marks.length * 10) / 10 : null;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 className="ea-page-title" style={{ marginBottom: 4 }}>Exam Results</h1>
        <p className="ea-page-subtitle">Manage subjects, student enrollment and exam marks</p>
      </div>

      {/* ═══ STEP 1 — MANAGE SUBJECTS (always visible) ═══════════════════ */}
      <SectionCard style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, background: "#e0e7ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>📚</div>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: 0 }}>Manage Subjects</h2>
          <span style={{ background: "#f3f4f6", color: "#6b7280", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 10 }}>{allSubjects.length}</span>
        </div>

        <Msg msg={subjectMsg} />

        {/* Add subject row */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          <input
            type="text"
            placeholder="New subject name (e.g. Mathematics)…"
            value={newSubjectName}
            onChange={e => setNewSubjectName(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addSubject(); } }}
            style={{ ...inputStyle, flex: 1 }}
          />
          <button
            onClick={addSubject}
            disabled={!newSubjectName.trim() || addingSubject}
            style={{ ...btnPrimary, opacity: (!newSubjectName.trim() || addingSubject) ? 0.6 : 1, display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}
          >
            <i className={addingSubject ? "fas fa-spinner fa-spin" : "fas fa-plus"} />
            {addingSubject ? "Adding…" : "Add Subject"}
          </button>
        </div>

        {/* Subject list */}
        {allSubjects.length === 0 ? (
          <p style={{ textAlign: "center", color: "#9ca3af", fontSize: 13, margin: "16px 0", padding: "20px", border: "1px dashed #e5e7eb", borderRadius: 8 }}>
            No subjects yet. Add your first subject above.
          </p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
            {allSubjects.map(s => (
              <div key={s.id} style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8, padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 6, background: "#e0e7ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>📖</div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{s.name}</span>
                </div>
                <button
                  onClick={() => deleteSubject(s.id, s.name)}
                  title="Delete subject"
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: 13, padding: "2px 4px", borderRadius: 4, flexShrink: 0 }}
                  onMouseEnter={e => e.currentTarget.style.background = "#fef2f2"}
                  onMouseLeave={e => e.currentTarget.style.background = "none"}
                >
                  <i className="fas fa-trash" />
                </button>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      {/* ═══ STEP 2 — SELECT STUDENT ══════════════════════════════════════ */}
      <SectionCard style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>👤</div>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: 0 }}>Select Student</h2>
        </div>

        <div style={{ position: "relative" }}>
          <i className="fas fa-search" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: 13 }} />
          <input
            type="text"
            placeholder="Search by name or username…"
            value={studentSearch}
            onChange={e => { setStudentSearch(e.target.value); setShowDropdown(true); if (!e.target.value) { setSelectedStudent(null); } }}
            onFocus={() => setShowDropdown(true)}
            style={{ ...inputStyle, paddingLeft: 36 }}
          />
          {studentSearch && showDropdown && filteredStudents.length > 0 && (
            <div style={{ position: "absolute", left: 0, right: 0, top: "calc(100% + 4px)", border: "1px solid #e5e7eb", borderRadius: 8, background: "#fff", boxShadow: "0 6px 20px rgba(0,0,0,0.1)", maxHeight: 220, overflowY: "auto", zIndex: 50 }}>
              {filteredStudents.slice(0, 10).map(s => (
                <div key={s.id}
                  onClick={() => selectStudent(s)}
                  style={{ padding: "10px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid #f3f4f6" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
                  onMouseLeave={e => e.currentTarget.style.background = "#fff"}
                >
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#e0e7ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#4f46e5", flexShrink: 0 }}>
                    {s.fullName.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase()}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: 13, color: "#111827" }}>{s.fullName}</p>
                    <p style={{ margin: 0, fontSize: 11, color: "#9ca3af" }}>{s.username} · {s.grade}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected student badge */}
        {selectedStudent && (
          <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10 }}>
            <div style={{ width: 42, height: 42, borderRadius: "50%", background: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
              {selectedStudent.fullName.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#111827" }}>{selectedStudent.fullName}</p>
              <p style={{ margin: 0, fontSize: 12, color: "#16a34a" }}>
                {selectedStudent.grade} · {enrollments.length} subject{enrollments.length !== 1 ? "s" : ""} enrolled · {marks.length} result{marks.length !== 1 ? "s" : ""} recorded
              </p>
            </div>
            {avg !== null && (
              <div style={{ textAlign: "center", background: "#fff", border: "1px solid #bbf7d0", borderRadius: 8, padding: "6px 16px", flexShrink: 0 }}>
                <p style={{ margin: 0, fontSize: 10, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>Average</p>
                <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: avg >= 75 ? "#16a34a" : avg >= 50 ? "#f59e0b" : "#ef4444" }}>{avg}%</p>
              </div>
            )}
          </div>
        )}
      </SectionCard>

      {/* ═══ STEP 3 — STUDENT TABS (enrollment + marks) ══════════════════ */}
      {selectedStudent && (
        <>
          {/* Tabs */}
          <div style={{ display: "flex", gap: 4, marginBottom: 20, borderBottom: "2px solid #e5e7eb" }}>
            {[
              { key: "results",    label: "Exam Results",     icon: "fas fa-chart-bar" },
              { key: "enrollment", label: "Enrolled Subjects", icon: "fas fa-book-open" },
            ].map(t => (
              <button key={t.key}
                onClick={() => { setTab(t.key); setShowMarkForm(false); setStudentMsg(null); }}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", background: "none", border: "none", borderBottom: tab === t.key ? "2px solid #4f46e5" : "2px solid transparent", marginBottom: -2, cursor: "pointer", fontSize: 13, fontWeight: tab === t.key ? 700 : 500, color: tab === t.key ? "#4f46e5" : "#6b7280" }}
              >
                <i className={t.icon} /> {t.label}
              </button>
            ))}
          </div>

          <Msg msg={studentMsg} />

          {/* ── EXAM RESULTS TAB ──────────────────────────────────────── */}
          {tab === "results" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
                <select value={filterTerm} onChange={e => setFilterTerm(e.target.value)} style={{ ...inputStyle, width: "auto", minWidth: 140 }}>
                  <option value="all">All Terms</option>
                  {terms.map(t => <option key={t}>{t}</option>)}
                </select>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {enrollments.length === 0 && (
                    <span style={{ fontSize: 12, color: "#f59e0b" }}>⚠ Enroll subjects first (Enrolled Subjects tab)</span>
                  )}
                  {!showMarkForm && (
                    <button onClick={openAddMark} disabled={enrollments.length === 0}
                      style={{ ...btnPrimary, display: "flex", alignItems: "center", gap: 8, opacity: enrollments.length === 0 ? 0.5 : 1 }}>
                      <i className="fas fa-plus" /> Add Result
                    </button>
                  )}
                </div>
              </div>

              {/* Add / Edit form */}
              {showMarkForm && (
                <SectionCard style={{ borderLeft: "4px solid #4f46e5", marginBottom: 20 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1e1b4b", margin: "0 0 16px" }}>
                    {editMarkId ? "✏️ Edit Result" : "➕ Add Exam Result"}
                  </h3>
                  <form onSubmit={saveMark}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>

                      {/* Subject — only for new result */}
                      {!editMarkId && (
                        <div style={{ marginBottom: 16 }}>
                          <label style={{ display: "block", fontWeight: 600, fontSize: 13, marginBottom: 4, color: "#374151" }}>Subject <span style={{ color: "#ef4444" }}>*</span></label>
                          <select value={markForm.subjectId} onChange={e => setMarkForm(p => ({ ...p, subjectId: e.target.value }))} required style={inputStyle}>
                            <option value="">— Select subject —</option>
                            {enrollments.map(en => <option key={en.subjectId} value={en.subjectId}>{en.subject.name}</option>)}
                          </select>
                        </div>
                      )}

                      {/* Term — only for new result */}
                      {!editMarkId && (
                        <div style={{ marginBottom: 16 }}>
                          <label style={{ display: "block", fontWeight: 600, fontSize: 13, marginBottom: 4, color: "#374151" }}>Term <span style={{ color: "#ef4444" }}>*</span></label>
                          <select value={markForm.term} onChange={e => setMarkForm(p => ({ ...p, term: e.target.value }))} style={inputStyle}>
                            {TERMS.map(t => <option key={t}>{t}</option>)}
                          </select>
                        </div>
                      )}

                      {/* Marks */}
                      <div style={{ marginBottom: 16 }}>
                        <label style={{ display: "block", fontWeight: 600, fontSize: 13, marginBottom: 4, color: "#374151" }}>
                          Marks (0–100) <span style={{ color: "#ef4444" }}>*</span>
                        </label>
                        <input type="number" min="0" max="100" step="0.1" required
                          value={markForm.marks} onChange={e => setMarkForm(p => ({ ...p, marks: e.target.value }))}
                          placeholder="e.g. 85" style={inputStyle} />
                        {markForm.marks !== "" && (
                          <p style={{ margin: "4px 0 0", fontSize: 12, fontWeight: 700, color: gradeColor(autoGrade(markForm.marks)) }}>
                            Auto grade: {autoGrade(markForm.marks)}
                          </p>
                        )}
                      </div>

                      {/* Remarks */}
                      <div style={{ marginBottom: 16 }}>
                        <label style={{ display: "block", fontWeight: 600, fontSize: 13, marginBottom: 4, color: "#374151" }}>Teacher Remarks</label>
                        <input type="text" value={markForm.teacherRemarks}
                          onChange={e => setMarkForm(p => ({ ...p, teacherRemarks: e.target.value }))}
                          placeholder="Optional feedback…" style={inputStyle} />
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 10 }}>
                      <button type="submit" disabled={saving}
                        style={{ ...btnPrimary, opacity: saving ? 0.7 : 1, display: "flex", alignItems: "center", gap: 8 }}>
                        <i className={saving ? "fas fa-spinner fa-spin" : "fas fa-save"} />
                        {saving ? "Saving…" : editMarkId ? "Update Result" : "Save Result"}
                      </button>
                      <button type="button" onClick={() => { setShowMarkForm(false); setStudentMsg(null); }} style={btnSecondary}>
                        Cancel
                      </button>
                    </div>
                  </form>
                </SectionCard>
              )}

              {/* Marks table */}
              {filteredMarks.length === 0 ? (
                <SectionCard>
                  <p style={{ textAlign: "center", color: "#9ca3af", fontSize: 14, margin: "24px 0" }}>
                    {marks.length === 0 ? "No results recorded yet. Click Add Result to begin." : "No results for the selected term."}
                  </p>
                </SectionCard>
              ) : (
                <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                    <thead>
                      <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                        {["Subject", "Term", "Marks", "Grade", "Remarks", "Actions"].map(h => (
                          <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontWeight: 600, color: "#374151", fontSize: 12 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMarks.map((m, i) => {
                        const gc = gradeColor(m.grade);
                        return (
                          <tr key={m.id} style={{ borderBottom: i < filteredMarks.length - 1 ? "1px solid #f3f4f6" : "none", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                            <td style={{ padding: "12px 16px", fontWeight: 600, color: "#111827" }}>{m.subject.name}</td>
                            <td style={{ padding: "12px 16px" }}>
                              <span style={{ background: "#e0f2fe", color: "#0369a1", fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: 20 }}>{m.term}</span>
                            </td>
                            <td style={{ padding: "12px 16px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <span style={{ fontWeight: 800, fontSize: 15, color: gc }}>{m.marks}</span>
                                <div style={{ width: 50, height: 5, background: "#f3f4f6", borderRadius: 3 }}>
                                  <div style={{ height: "100%", width: `${m.marks}%`, background: gc, borderRadius: 3 }} />
                                </div>
                              </div>
                            </td>
                            <td style={{ padding: "12px 16px" }}>
                              <span style={{ background: gc + "20", color: gc, fontWeight: 700, fontSize: 12, padding: "3px 10px", borderRadius: 10 }}>{m.grade}</span>
                            </td>
                            <td style={{ padding: "12px 16px", color: "#6b7280", fontSize: 13, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.teacherRemarks || "—"}</td>
                            <td style={{ padding: "12px 16px" }}>
                              <div style={{ display: "flex", gap: 6 }}>
                                <button onClick={() => openEditMark(m)} style={{ ...btnSecondary, display: "flex", alignItems: "center", gap: 4, padding: "5px 10px" }}>
                                  <i className="fas fa-edit" /> Edit
                                </button>
                                <button onClick={() => deleteMark(m.id)} style={{ ...btnDanger, padding: "5px 8px" }}>
                                  <i className="fas fa-trash" />
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
          )}

          {/* ── ENROLLED SUBJECTS TAB ─────────────────────────────────── */}
          {tab === "enrollment" && (
            <div>
              {allSubjects.length === 0 ? (
                <SectionCard>
                  <p style={{ textAlign: "center", color: "#9ca3af", fontSize: 14, margin: "24px 0" }}>
                    No subjects exist yet. Add subjects in the "Manage Subjects" panel above first.
                  </p>
                </SectionCard>
              ) : (
                <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
                  <select value={enrollSubjectId} onChange={e => setEnrollSubjectId(e.target.value)}
                    style={{ ...inputStyle, flex: 1, minWidth: 200 }}>
                    <option value="">— Select a subject to enroll —</option>
                    {unenrolledSubjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                  <button onClick={enroll} disabled={!enrollSubjectId || saving}
                    style={{ ...btnPrimary, opacity: (!enrollSubjectId || saving) ? 0.6 : 1, display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}>
                    <i className="fas fa-plus" /> Enroll Subject
                  </button>
                </div>
              )}

              {unenrolledSubjects.length === 0 && allSubjects.length > 0 && (
                <p style={{ fontSize: 12, color: "#16a34a", marginBottom: 12 }}>✓ Student is enrolled in all available subjects.</p>
              )}

              {enrollments.length === 0 ? (
                <SectionCard>
                  <p style={{ textAlign: "center", color: "#9ca3af", fontSize: 14, margin: "24px 0" }}>
                    No subjects enrolled yet.
                  </p>
                </SectionCard>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 12 }}>
                  {enrollments.map(en => (
                    <div key={en.id} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 8, background: "#e0e7ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>📚</div>
                        <span style={{ fontWeight: 600, fontSize: 13, color: "#111827" }}>{en.subject.name}</span>
                      </div>
                      <button onClick={() => removeEnrollment(en.id)}
                        title="Remove enrollment"
                        style={{ background: "none", border: "1px solid #fecaca", cursor: "pointer", color: "#ef4444", fontSize: 12, padding: "4px 8px", borderRadius: 6, flexShrink: 0 }}
                        onMouseEnter={e => e.currentTarget.style.background = "#fef2f2"}
                        onMouseLeave={e => e.currentTarget.style.background = "none"}
                      >
                        <i className="fas fa-times" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
