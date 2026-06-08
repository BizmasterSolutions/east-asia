"use client";
import { useState, useEffect, useCallback } from "react";

const GRADES = [
  "Grade 1","Grade 2","Grade 3","Grade 4",
  "Grade 5","Grade 6","Grade 7","Grade 8",
  "Grade 9","Grade 10","Grade 11","Grade 12",
];

const GRADE_GROUPS = [
  { label: "Lower Primary", grades: ["Grade 1","Grade 2","Grade 3","Grade 4"], color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
  { label: "Upper Primary",  grades: ["Grade 5","Grade 6","Grade 7","Grade 8"], color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
  { label: "Secondary",      grades: ["Grade 9","Grade 10","Grade 11","Grade 12"], color: "#7c3aed", bg: "#faf5ff", border: "#e9d5ff" },
];

const EMPTY_FORM = { fullName: "", username: "", password: "", grade: "Grade 1" };

function Modal({ title, onClose, children }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.45)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px",
    }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: "#fff", borderRadius: 12, width: "100%", maxWidth: 480,
        boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
        maxHeight: "90vh", overflowY: "auto",
      }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 24px 16px", borderBottom: "1px solid #f0f0f0",
        }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#111" }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#9ca3af", lineHeight: 1 }}>
            <i className="fas fa-times" />
          </button>
        </div>
        <div style={{ padding: "20px 24px 24px" }}>{children}</div>
      </div>
    </div>
  );
}

function FormField({ label, type = "text", value, onChange, placeholder, required, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 6 }}>
        {label}{required && <span style={{ color: "#ef4444" }}> *</span>}
      </label>
      {children || (
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          style={{
            width: "100%", padding: "10px 12px",
            border: "1.5px solid #e5e7eb", borderRadius: 8,
            fontSize: 14, color: "#111", background: "#f9fafb",
            outline: "none", boxSizing: "border-box",
            transition: "border-color .15s",
          }}
          onFocus={e => e.target.style.borderColor = "#4f46e5"}
          onBlur={e => e.target.style.borderColor = "#e5e7eb"}
        />
      )}
    </div>
  );
}

function GradeTag({ grade }) {
  const group = GRADE_GROUPS.find(g => g.grades.includes(grade));
  const color  = group?.color  || "#6b7280";
  const bg     = group?.bg     || "#f3f4f6";
  const border = group?.border || "#e5e7eb";
  return (
    <span style={{
      display: "inline-block",
      padding: "3px 10px",
      borderRadius: 20,
      fontSize: 12, fontWeight: 700,
      color, background: bg,
      border: `1px solid ${border}`,
      whiteSpace: "nowrap",
    }}>
      {grade}
    </span>
  );
}

export default function StudentsAdminSection() {
  const [students, setStudents]     = useState([]);
  const [loading,  setLoading]      = useState(true);
  const [search,   setSearch]       = useState("");
  const [gradeFilter, setGradeFilter] = useState("");
  const [groupFilter, setGroupFilter] = useState("");

  const [showAdd,  setShowAdd]  = useState(false);
  const [showEdit, setShowEdit] = useState(null); // student object
  const [form,     setForm]     = useState(EMPTY_FORM);
  const [saving,   setSaving]   = useState(false);
  const [msg,      setMsg]      = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search)      params.set("search", search);
    if (gradeFilter) params.set("grade",  gradeFilter);
    const res  = await fetch(`/api/admin/students?${params}`);
    const data = await res.json();
    setStudents(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [search, gradeFilter]);

  useEffect(() => { load(); }, [load]);

  // group filter narrows gradeFilter options
  const gradesForFilter = groupFilter
    ? GRADE_GROUPS.find(g => g.label === groupFilter)?.grades ?? GRADES
    : GRADES;

  // stats per group
  const allStudents = students; // filtered by API already
  const groupCounts = GRADE_GROUPS.map(g => ({
    ...g,
    count: allStudents.filter(s => g.grades.includes(s.grade)).length,
  }));

  const openAdd = () => { setForm(EMPTY_FORM); setMsg(null); setShowAdd(true); };
  const openEdit = (s) => { setForm({ fullName: s.fullName, username: s.username, password: "", grade: s.grade }); setMsg(null); setShowEdit(s); };

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true); setMsg(null);
    const res = await fetch("/api/admin/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      setMsg({ ok: true, text: `Student "${data.fullName}" added successfully.` });
      setForm(EMPTY_FORM);
      load();
    } else {
      setMsg({ ok: false, text: data.message || "Failed to add student." });
    }
    setSaving(false);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setSaving(true); setMsg(null);
    const body = { fullName: form.fullName, grade: form.grade };
    if (form.password) body.password = form.password;
    const res = await fetch(`/api/admin/students/${showEdit.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (res.ok) {
      setMsg({ ok: true, text: "Student updated successfully." });
      load();
      setTimeout(() => setShowEdit(null), 900);
    } else {
      setMsg({ ok: false, text: data.message || "Failed to update student." });
    }
    setSaving(false);
  };

  const handleDelete = async (s) => {
    if (!confirm(`Delete "${s.fullName}" (${s.username})? This cannot be undone.`)) return;
    await fetch(`/api/admin/students/${s.id}`, { method: "DELETE" });
    load();
  };

  const fld = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const msgBox = (m) => m && (
    <div style={{
      padding: "10px 14px", borderRadius: 7, fontSize: 13, marginBottom: 16,
      background: m.ok ? "#f0fdf4" : "#fef2f2",
      color: m.ok ? "#16a34a" : "#dc2626",
      border: `1px solid ${m.ok ? "#bbf7d0" : "#fecaca"}`,
    }}>{m.text}</div>
  );

  return (
    <div>
      {/* Page header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#111" }}>Students</h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6b7280" }}>
            Manage all enrolled students — search, filter, add, edit or remove.
          </p>
        </div>
        <button onClick={openAdd} style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "10px 20px", background: "#001D3D", color: "#F0D264",
          border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700,
          cursor: "pointer", whiteSpace: "nowrap",
        }}>
          <i className="fas fa-user-plus" /> Add New Student
        </button>
      </div>

      {/* Grade group stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 24 }}>
        {groupCounts.map(g => (
          <div key={g.label} style={{
            background: g.bg, border: `1px solid ${g.border}`,
            borderRadius: 10, padding: "16px 20px",
            cursor: "pointer",
            outline: groupFilter === g.label ? `2px solid ${g.color}` : "none",
            transition: "transform .15s, box-shadow .15s",
          }}
            onClick={() => {
              setGroupFilter(prev => prev === g.label ? "" : g.label);
              setGradeFilter("");
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 700, color: g.color, textTransform: "uppercase", letterSpacing: ".6px", marginBottom: 6 }}>{g.label}</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: g.color, lineHeight: 1 }}>{g.count}</div>
            <div style={{ fontSize: 12, color: g.color, opacity: .7, marginTop: 4 }}>
              {g.grades[0]} – {g.grades[g.grades.length - 1]}
            </div>
          </div>
        ))}
        <div style={{
          background: "#f9fafb", border: "1px solid #e5e7eb",
          borderRadius: 10, padding: "16px 20px",
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: ".6px", marginBottom: 6 }}>Total</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: "#111", lineHeight: 1 }}>{students.length}</div>
          <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>All grades</div>
        </div>
      </div>

      {/* Search & filter bar */}
      <div style={{
        background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10,
        padding: "16px 20px", marginBottom: 16,
        display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center",
      }}>
        {/* Search */}
        <div style={{ position: "relative", flex: "1 1 220px", minWidth: 180 }}>
          <i className="fas fa-search" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: 13 }} />
          <input
            type="text"
            placeholder="Search by name or username…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: "100%", padding: "9px 12px 9px 34px",
              border: "1.5px solid #e5e7eb", borderRadius: 7,
              fontSize: 13, outline: "none", boxSizing: "border-box",
              background: "#f9fafb",
            }}
          />
        </div>

        {/* Grade filter */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", whiteSpace: "nowrap" }}>Grade:</label>
          <select
            value={gradeFilter}
            onChange={e => { setGradeFilter(e.target.value); setGroupFilter(""); }}
            style={{
              padding: "8px 32px 8px 12px", border: "1.5px solid #e5e7eb",
              borderRadius: 7, fontSize: 13, background: "#f9fafb",
              cursor: "pointer", outline: "none", appearance: "none",
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%239ca3af'/%3E%3C/svg%3E\")",
              backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center",
            }}
          >
            <option value="">All Grades</option>
            {gradesForFilter.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>

        {/* Clear filters */}
        {(search || gradeFilter || groupFilter) && (
          <button
            onClick={() => { setSearch(""); setGradeFilter(""); setGroupFilter(""); }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "8px 14px", background: "#fff",
              border: "1.5px solid #fecaca", borderRadius: 7,
              fontSize: 12, fontWeight: 700, color: "#dc2626", cursor: "pointer",
            }}
          >
            <i className="fas fa-times" /> Clear Filters
          </button>
        )}
      </div>

      {/* Table */}
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                {["#", "Full Name", "Username", "Grade", "Category", "Joined", "Actions"].map(h => (
                  <th key={h} style={{
                    padding: "12px 16px", textAlign: "left",
                    fontSize: 11, fontWeight: 800, color: "#6b7280",
                    textTransform: "uppercase", letterSpacing: ".6px",
                    whiteSpace: "nowrap",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ padding: "48px 16px", textAlign: "center", color: "#9ca3af" }}>
                    <i className="fas fa-spinner fa-spin" style={{ fontSize: 20, marginBottom: 8, display: "block" }} />
                    Loading students…
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: "48px 16px", textAlign: "center", color: "#9ca3af" }}>
                    <i className="fas fa-user-graduate" style={{ fontSize: 28, marginBottom: 10, display: "block", opacity: .4 }} />
                    No students found.{search || gradeFilter ? " Try different filters." : ""}
                  </td>
                </tr>
              ) : (
                students.map((s, i) => {
                  const group = GRADE_GROUPS.find(g => g.grades.includes(s.grade));
                  return (
                    <tr key={s.id} style={{ borderBottom: "1px solid #f3f4f6", transition: "background .1s" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#fafafa"}
                      onMouseLeave={e => e.currentTarget.style.background = ""}
                    >
                      <td style={{ padding: "13px 16px", color: "#9ca3af", fontSize: 12 }}>{i + 1}</td>
                      <td style={{ padding: "13px 16px", fontWeight: 600, color: "#111" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{
                            width: 34, height: 34, borderRadius: "50%",
                            background: group?.bg || "#f3f4f6",
                            border: `1.5px solid ${group?.border || "#e5e7eb"}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 13, fontWeight: 800, color: group?.color || "#6b7280",
                            flexShrink: 0,
                          }}>
                            {s.fullName.charAt(0).toUpperCase()}
                          </div>
                          {s.fullName}
                        </div>
                      </td>
                      <td style={{ padding: "13px 16px", color: "#6b7280", fontFamily: "monospace", fontSize: 13 }}>{s.username}</td>
                      <td style={{ padding: "13px 16px" }}><GradeTag grade={s.grade} /></td>
                      <td style={{ padding: "13px 16px" }}>
                        {group && (
                          <span style={{
                            fontSize: 11, fontWeight: 700, color: group.color,
                            textTransform: "uppercase", letterSpacing: ".4px",
                          }}>{group.label}</span>
                        )}
                      </td>
                      <td style={{ padding: "13px 16px", color: "#9ca3af", fontSize: 12, whiteSpace: "nowrap" }}>
                        {new Date(s.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                      </td>
                      <td style={{ padding: "13px 16px" }}>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button onClick={() => openEdit(s)} style={{
                            display: "inline-flex", alignItems: "center", gap: 5,
                            padding: "6px 12px", background: "#eff6ff",
                            border: "1px solid #bfdbfe", borderRadius: 6,
                            fontSize: 12, fontWeight: 600, color: "#2563eb",
                            cursor: "pointer",
                          }}>
                            <i className="fas fa-pen" style={{ fontSize: 10 }} /> Edit
                          </button>
                          <button onClick={() => handleDelete(s)} style={{
                            display: "inline-flex", alignItems: "center", gap: 5,
                            padding: "6px 12px", background: "#fef2f2",
                            border: "1px solid #fecaca", borderRadius: 6,
                            fontSize: 12, fontWeight: 600, color: "#dc2626",
                            cursor: "pointer",
                          }}>
                            <i className="fas fa-trash" style={{ fontSize: 10 }} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer count */}
        {!loading && students.length > 0 && (
          <div style={{
            padding: "12px 16px", borderTop: "1px solid #f3f4f6",
            fontSize: 12, color: "#9ca3af", background: "#fafafa",
          }}>
            Showing <strong style={{ color: "#374151" }}>{students.length}</strong> student{students.length !== 1 ? "s" : ""}
            {(search || gradeFilter) && " matching filters"}
          </div>
        )}
      </div>

      {/* ── ADD MODAL ── */}
      {showAdd && (
        <Modal title="Add New Student" onClose={() => setShowAdd(false)}>
          {msgBox(msg)}
          <form onSubmit={handleAdd}>
            <FormField label="Full Name" value={form.fullName} onChange={fld("fullName")} placeholder="e.g. John Doe" required />
            <FormField label="Username" value={form.username} onChange={fld("username")} placeholder="e.g. john_doe_g10" required />
            <FormField label="Password" type="password" value={form.password} onChange={fld("password")} placeholder="Minimum 6 characters" required />
            <FormField label="Grade" required>
              <select
                value={form.grade}
                onChange={fld("grade")}
                required
                style={{
                  width: "100%", padding: "10px 12px",
                  border: "1.5px solid #e5e7eb", borderRadius: 8,
                  fontSize: 14, background: "#f9fafb", outline: "none",
                  boxSizing: "border-box",
                }}
              >
                {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </FormField>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button type="submit" disabled={saving} style={{
                flex: 1, padding: "11px", background: "#001D3D", color: "#F0D264",
                border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700,
                cursor: saving ? "not-allowed" : "pointer", opacity: saving ? .7 : 1,
              }}>
                {saving ? "Adding…" : "Add Student"}
              </button>
              <button type="button" onClick={() => setShowAdd(false)} style={{
                padding: "11px 20px", background: "#f3f4f6", color: "#374151",
                border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 14,
                fontWeight: 600, cursor: "pointer",
              }}>Cancel</button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── EDIT MODAL ── */}
      {showEdit && (
        <Modal title={`Edit: ${showEdit.fullName}`} onClose={() => setShowEdit(null)}>
          {msgBox(msg)}
          <form onSubmit={handleEdit}>
            <FormField label="Full Name" value={form.fullName} onChange={fld("fullName")} placeholder="Full name" required />
            <FormField label="Username (read only)">
              <input
                type="text"
                value={form.username}
                disabled
                style={{
                  width: "100%", padding: "10px 12px",
                  border: "1.5px solid #e5e7eb", borderRadius: 8,
                  fontSize: 14, background: "#f3f4f6", color: "#9ca3af",
                  boxSizing: "border-box", cursor: "not-allowed",
                }}
              />
            </FormField>
            <FormField label="Grade" required>
              <select
                value={form.grade}
                onChange={fld("grade")}
                required
                style={{
                  width: "100%", padding: "10px 12px",
                  border: "1.5px solid #e5e7eb", borderRadius: 8,
                  fontSize: 14, background: "#f9fafb", outline: "none",
                  boxSizing: "border-box",
                }}
              >
                {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </FormField>
            <FormField label="New Password (leave blank to keep current)" type="password" value={form.password} onChange={fld("password")} placeholder="Enter new password to change" />
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button type="submit" disabled={saving} style={{
                flex: 1, padding: "11px", background: "#2563eb", color: "#fff",
                border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700,
                cursor: saving ? "not-allowed" : "pointer", opacity: saving ? .7 : 1,
              }}>
                {saving ? "Saving…" : "Save Changes"}
              </button>
              <button type="button" onClick={() => setShowEdit(null)} style={{
                padding: "11px 20px", background: "#f3f4f6", color: "#374151",
                border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 14,
                fontWeight: 600, cursor: "pointer",
              }}>Cancel</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
