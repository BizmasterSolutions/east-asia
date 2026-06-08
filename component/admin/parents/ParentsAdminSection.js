"use client";
import { useState, useEffect, useCallback } from "react";

const EMPTY_FORM = { fullName: "", username: "", password: "" };

function Modal({ title, onClose, children, wide }) {
  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: "#fff", borderRadius: 12, width: "100%", maxWidth: wide ? 640 : 480,
        boxShadow: "0 20px 60px rgba(0,0,0,0.18)", maxHeight: "90vh", overflowY: "auto",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px 16px", borderBottom: "1px solid #f0f0f0" }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#111" }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#9ca3af" }}>
            <i className="fas fa-times" />
          </button>
        </div>
        <div style={{ padding: "20px 24px 24px" }}>{children}</div>
      </div>
    </div>
  );
}

function FormField({ label, type = "text", value, onChange, placeholder, required, disabled, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 6 }}>
        {label}{required && <span style={{ color: "#ef4444" }}> *</span>}
      </label>
      {children || (
        <input
          type={type} value={value} onChange={onChange} placeholder={placeholder}
          required={required} disabled={disabled}
          style={{
            width: "100%", padding: "10px 12px", border: "1.5px solid #e5e7eb",
            borderRadius: 8, fontSize: 14, color: "#111",
            background: disabled ? "#f3f4f6" : "#f9fafb",
            outline: "none", boxSizing: "border-box",
            cursor: disabled ? "not-allowed" : "text",
          }}
          onFocus={e => !disabled && (e.target.style.borderColor = "#4f46e5")}
          onBlur={e => (e.target.style.borderColor = "#e5e7eb")}
        />
      )}
    </div>
  );
}

function MsgBox({ msg }) {
  if (!msg) return null;
  return (
    <div style={{
      padding: "10px 14px", borderRadius: 7, fontSize: 13, marginBottom: 16,
      background: msg.ok ? "#f0fdf4" : "#fef2f2",
      color: msg.ok ? "#16a34a" : "#dc2626",
      border: `1px solid ${msg.ok ? "#bbf7d0" : "#fecaca"}`,
    }}>{msg.text}</div>
  );
}

function GradeTag({ grade }) {
  const colors =
    ["Grade 1","Grade 2","Grade 3","Grade 4"].includes(grade) ? { c: "#16a34a", bg: "#f0fdf4", b: "#bbf7d0" } :
    ["Grade 5","Grade 6","Grade 7","Grade 8"].includes(grade) ? { c: "#2563eb", bg: "#eff6ff", b: "#bfdbfe" } :
                                                                 { c: "#7c3aed", bg: "#faf5ff", b: "#e9d5ff" };
  return (
    <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 20, fontSize: 11, fontWeight: 700, color: colors.c, background: colors.bg, border: `1px solid ${colors.b}`, whiteSpace: "nowrap" }}>
      {grade}
    </span>
  );
}

function ChildrenPill({ count }) {
  const s = count === 0
    ? { c: "#ea580c", bg: "#fff7ed", b: "#fed7aa" }
    : { c: "#16a34a", bg: "#f0fdf4", b: "#bbf7d0" };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700, color: s.c, background: s.bg, border: `1px solid ${s.b}` }}>
      <i className={count === 0 ? "fas fa-user-slash" : "fas fa-child"} style={{ fontSize: 10 }} />
      {count} {count === 1 ? "child" : "children"}
    </span>
  );
}

export default function ParentsAdminSection() {
  // full dataset — never filtered, used for real stat totals
  const [allParents,  setAllParents]  = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [apiError,    setApiError]    = useState(null);

  // filter/search state (applied client-side)
  const [search,  setSearch]  = useState("");
  const [filter,  setFilter]  = useState("all"); // "all" | "linked" | "unlinked"

  // modal state
  const [showAdd,       setShowAdd]       = useState(false);
  const [showEdit,      setShowEdit]      = useState(null);
  const [form,          setForm]          = useState(EMPTY_FORM);
  const [linkedIds,     setLinkedIds]     = useState([]);
  const [studentSearch, setStudentSearch] = useState("");
  const [saving,        setSaving]        = useState(false);
  const [msg,           setMsg]           = useState(null);

  // ── data loading ──────────────────────────────────────────────────────────

  const loadParents = useCallback(async () => {
    setLoading(true);
    setApiError(null);
    try {
      const res  = await fetch("/api/admin/parents");
      const data = await res.json();
      if (!res.ok) {
        setApiError(data.message || `Error ${res.status}`);
        setAllParents([]);
      } else {
        setAllParents(Array.isArray(data) ? data : []);
      }
    } catch {
      setApiError("Network error — could not reach the server.");
      setAllParents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadStudents = useCallback(async () => {
    try {
      const res  = await fetch("/api/admin/students");
      const data = await res.json();
      setAllStudents(res.ok && Array.isArray(data) ? data : []);
    } catch {
      setAllStudents([]);
    }
  }, []);

  useEffect(() => { loadParents(); }, [loadParents]);
  useEffect(() => { loadStudents(); }, [loadStudents]);

  // ── derived data ──────────────────────────────────────────────────────────

  // real totals always from full dataset
  const totalAll      = allParents.length;
  const totalLinked   = allParents.filter(p => p.children.length > 0).length;
  const totalUnlinked = allParents.filter(p => p.children.length === 0).length;

  // client-side filtering for the table
  const displayed = allParents.filter(p => {
    const matchFilter =
      filter === "linked"   ? p.children.length > 0 :
      filter === "unlinked" ? p.children.length === 0 :
      true;

    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      p.fullName.toLowerCase().includes(q) ||
      p.username.toLowerCase().includes(q);

    return matchFilter && matchSearch;
  });

  const STAT_CARDS = [
    { key: "all",      label: "Total Parents",        icon: "fas fa-users",      color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe", count: totalAll      },
    { key: "linked",   label: "With Linked Children", icon: "fas fa-link",       color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0", count: totalLinked   },
    { key: "unlinked", label: "No Children Linked",   icon: "fas fa-user-slash", color: "#ea580c", bg: "#fff7ed", border: "#fed7aa", count: totalUnlinked },
  ];

  // ── form helpers ──────────────────────────────────────────────────────────

  const openAdd = () => {
    setForm(EMPTY_FORM); setLinkedIds([]); setStudentSearch("");
    setMsg(null); setShowAdd(true);
  };
  const openEdit = (p) => {
    setForm({ fullName: p.fullName, username: p.username, password: "" });
    setLinkedIds(p.children.map(c => c.id));
    setStudentSearch(""); setMsg(null); setShowEdit(p);
  };

  const handleAdd = async (e) => {
    e.preventDefault(); setSaving(true); setMsg(null);
    const res = await fetch("/api/admin/parents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      // link children if selected
      if (linkedIds.length > 0) {
        await fetch(`/api/admin/parents/${data.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fullName: data.fullName, studentIds: linkedIds }),
        });
      }
      setMsg({ ok: true, text: `Parent "${data.fullName}" added successfully.` });
      setForm(EMPTY_FORM); setLinkedIds([]);
      loadParents();
    } else {
      setMsg({ ok: false, text: data.message || "Failed to add parent." });
    }
    setSaving(false);
  };

  const handleEdit = async (e) => {
    e.preventDefault(); setSaving(true); setMsg(null);
    const body = { fullName: form.fullName, studentIds: linkedIds };
    if (form.password) body.password = form.password;
    const res = await fetch(`/api/admin/parents/${showEdit.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (res.ok) {
      setMsg({ ok: true, text: "Parent updated successfully." });
      loadParents();
      setTimeout(() => setShowEdit(null), 900);
    } else {
      setMsg({ ok: false, text: data.message || "Failed to update parent." });
    }
    setSaving(false);
  };

  const handleDelete = async (p) => {
    if (!confirm(`Delete "${p.fullName}" (${p.username})? This cannot be undone.`)) return;
    await fetch(`/api/admin/parents/${p.id}`, { method: "DELETE" });
    loadParents();
  };

  const toggleStudent = (id) =>
    setLinkedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const fld = key => e => setForm(f => ({ ...f, [key]: e.target.value }));

  const visibleStudents = allStudents.filter(s =>
    !studentSearch ||
    s.fullName.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.grade.toLowerCase().includes(studentSearch.toLowerCase())
  );

  // ── student linker (shared by add + edit) ─────────────────────────────────

  const StudentLinker = () => (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 8 }}>
        Link Students{" "}
        <span style={{ fontSize: 11, color: "#9ca3af", textTransform: "none", fontWeight: 500 }}>({linkedIds.length} selected)</span>
      </label>
      <input
        type="text"
        placeholder="Search by name or grade…"
        value={studentSearch}
        onChange={e => setStudentSearch(e.target.value)}
        style={{ width: "100%", padding: "8px 12px", border: "1.5px solid #e5e7eb", borderRadius: 7, fontSize: 13, outline: "none", marginBottom: 8, boxSizing: "border-box", background: "#f9fafb" }}
      />
      <div style={{ maxHeight: 200, overflowY: "auto", border: "1px solid #e5e7eb", borderRadius: 8 }}>
        {allStudents.length === 0 ? (
          <div style={{ padding: 16, textAlign: "center", color: "#9ca3af", fontSize: 13 }}>No students in the system yet.</div>
        ) : visibleStudents.length === 0 ? (
          <div style={{ padding: 16, textAlign: "center", color: "#9ca3af", fontSize: 13 }}>No students match your search.</div>
        ) : visibleStudents.map(s => (
          <label key={s.id} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "9px 12px", cursor: "pointer",
            borderBottom: "1px solid #f3f4f6",
            background: linkedIds.includes(s.id) ? "#f0fdf4" : "#fff",
          }}>
            <input
              type="checkbox"
              checked={linkedIds.includes(s.id)}
              onChange={() => toggleStudent(s.id)}
              style={{ width: 15, height: 15, accentColor: "#16a34a", cursor: "pointer" }}
            />
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#111" }}>{s.fullName}</span>
              <span style={{ fontSize: 11, color: "#9ca3af", marginLeft: 6 }}>{s.username}</span>
            </div>
            <GradeTag grade={s.grade} />
          </label>
        ))}
      </div>
    </div>
  );

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <div>

      {/* Page header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#111" }}>Parents</h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6b7280" }}>
            Manage parent accounts and their linked children.
          </p>
        </div>
        <button onClick={openAdd} style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "10px 20px", background: "#001D3D", color: "#F0D264",
          border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700,
          cursor: "pointer", whiteSpace: "nowrap",
        }}>
          <i className="fas fa-user-plus" /> Add New Parent
        </button>
      </div>

      {/* API error banner */}
      {apiError && (
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "12px 16px", borderRadius: 8, marginBottom: 20,
          background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626",
        }}>
          <i className="fas fa-exclamation-circle" />
          <span style={{ fontSize: 13, fontWeight: 600 }}>Could not load parents: {apiError}</span>
          <button onClick={loadParents} style={{
            marginLeft: "auto", padding: "5px 12px",
            background: "#dc2626", color: "#fff", border: "none",
            borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: "pointer",
          }}>Retry</button>
        </div>
      )}

      {/* Stat cards — always show real totals from the full dataset */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 24 }}>
        {STAT_CARDS.map(card => (
          <div key={card.key}
            onClick={() => setFilter(card.key)}
            style={{
              background: card.bg, border: `1px solid ${card.border}`,
              borderRadius: 10, padding: "16px 20px", cursor: "pointer",
              outline: filter === card.key ? `2px solid ${card.color}` : "none",
              outlineOffset: 2, transition: "transform .15s",
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={e => e.currentTarget.style.transform = ""}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: card.color, textTransform: "uppercase", letterSpacing: ".6px" }}>{card.label}</div>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: `${card.color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <i className={card.icon} style={{ fontSize: 13, color: card.color }} />
              </div>
            </div>
            <div style={{ fontSize: 30, fontWeight: 900, color: card.color, lineHeight: 1 }}>
              {loading ? <span style={{ fontSize: 16, color: card.color, opacity: .5 }}>…</span> : card.count}
            </div>
          </div>
        ))}
      </div>

      {/* Search & filter bar */}
      <div style={{
        background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10,
        padding: "14px 18px", marginBottom: 16,
        display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center",
      }}>
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
              fontSize: 13, outline: "none", boxSizing: "border-box", background: "#f9fafb",
            }}
          />
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {[
            { key: "all",      label: "All"          },
            { key: "linked",   label: "Has Children" },
            { key: "unlinked", label: "No Children"  },
          ].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)} style={{
              padding: "7px 14px", borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: "pointer",
              border: filter === f.key ? "1.5px solid #001D3D" : "1.5px solid #e5e7eb",
              background: filter === f.key ? "#001D3D" : "#f9fafb",
              color: filter === f.key ? "#F0D264" : "#6b7280",
              transition: "all .15s",
            }}>{f.label}</button>
          ))}
        </div>
        {(search || filter !== "all") && (
          <button onClick={() => { setSearch(""); setFilter("all"); }} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "8px 14px", background: "#fff",
            border: "1.5px solid #fecaca", borderRadius: 7,
            fontSize: 12, fontWeight: 700, color: "#dc2626", cursor: "pointer",
          }}>
            <i className="fas fa-times" /> Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                {["#", "Full Name", "Username", "Linked Children", "Children Detail", "Joined", "Actions"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 800, color: "#6b7280", textTransform: "uppercase", letterSpacing: ".6px", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ padding: "48px 16px", textAlign: "center", color: "#9ca3af" }}>
                    <i className="fas fa-spinner fa-spin" style={{ fontSize: 20, marginBottom: 8, display: "block" }} />
                    Loading parents…
                  </td>
                </tr>
              ) : displayed.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: "48px 16px", textAlign: "center", color: "#9ca3af" }}>
                    <i className="fas fa-users" style={{ fontSize: 28, marginBottom: 10, display: "block", opacity: .4 }} />
                    {allParents.length === 0
                      ? "No parents yet. Click \"Add New Parent\" to get started."
                      : "No parents match the current filters."}
                  </td>
                </tr>
              ) : displayed.map((p, i) => (
                <tr key={p.id}
                  style={{ borderBottom: "1px solid #f3f4f6" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#fafafa"}
                  onMouseLeave={e => e.currentTarget.style.background = ""}
                >
                  <td style={{ padding: "13px 16px", color: "#9ca3af", fontSize: 12 }}>{i + 1}</td>
                  <td style={{ padding: "13px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: "50%",
                        background: "#eff6ff", border: "1.5px solid #bfdbfe",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 13, fontWeight: 800, color: "#2563eb", flexShrink: 0,
                      }}>
                        {p.fullName.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 600, color: "#111" }}>{p.fullName}</span>
                    </div>
                  </td>
                  <td style={{ padding: "13px 16px", color: "#6b7280", fontFamily: "monospace", fontSize: 13 }}>{p.username}</td>
                  <td style={{ padding: "13px 16px" }}><ChildrenPill count={p.children.length} /></td>
                  <td style={{ padding: "13px 16px" }}>
                    {p.children.length === 0 ? (
                      <span style={{ color: "#d1d5db", fontSize: 12 }}>—</span>
                    ) : (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {p.children.map(c => (
                          <span key={c.id} style={{
                            display: "inline-flex", alignItems: "center", gap: 5,
                            padding: "3px 9px", borderRadius: 20,
                            background: "#f9fafb", border: "1px solid #e5e7eb",
                            fontSize: 12, color: "#374151", fontWeight: 500,
                          }}>
                            <i className="fas fa-user-graduate" style={{ fontSize: 9, color: "#9ca3af" }} />
                            {c.fullName}
                            <GradeTag grade={c.grade} />
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: "13px 16px", color: "#9ca3af", fontSize: 12, whiteSpace: "nowrap" }}>
                    {new Date(p.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td style={{ padding: "13px 16px" }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => openEdit(p)} style={{
                        display: "inline-flex", alignItems: "center", gap: 5,
                        padding: "6px 12px", background: "#eff6ff",
                        border: "1px solid #bfdbfe", borderRadius: 6,
                        fontSize: 12, fontWeight: 600, color: "#2563eb", cursor: "pointer",
                      }}>
                        <i className="fas fa-pen" style={{ fontSize: 10 }} /> Edit
                      </button>
                      <button onClick={() => handleDelete(p)} style={{
                        display: "inline-flex", alignItems: "center", gap: 5,
                        padding: "6px 12px", background: "#fef2f2",
                        border: "1px solid #fecaca", borderRadius: 6,
                        fontSize: 12, fontWeight: 600, color: "#dc2626", cursor: "pointer",
                      }}>
                        <i className="fas fa-trash" style={{ fontSize: 10 }} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && displayed.length > 0 && (
          <div style={{ padding: "12px 16px", borderTop: "1px solid #f3f4f6", fontSize: 12, color: "#9ca3af", background: "#fafafa" }}>
            Showing <strong style={{ color: "#374151" }}>{displayed.length}</strong> of <strong style={{ color: "#374151" }}>{totalAll}</strong> parent{totalAll !== 1 ? "s" : ""}
          </div>
        )}
      </div>

      {/* ── ADD MODAL ── */}
      {showAdd && (
        <Modal title="Add New Parent" onClose={() => setShowAdd(false)} wide>
          <MsgBox msg={msg} />
          <form onSubmit={handleAdd}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <FormField label="Full Name" value={form.fullName} onChange={fld("fullName")} placeholder="e.g. Jane Doe" required />
              <FormField label="Username" value={form.username} onChange={fld("username")} placeholder="e.g. jane_doe" required />
            </div>
            <FormField label="Password" type="password" value={form.password} onChange={fld("password")} placeholder="Minimum 6 characters" required />
            <StudentLinker />
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button type="submit" disabled={saving} style={{
                flex: 1, padding: "11px", background: "#001D3D", color: "#F0D264",
                border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700,
                cursor: saving ? "not-allowed" : "pointer", opacity: saving ? .7 : 1,
              }}>
                {saving ? "Adding…" : "Add Parent"}
              </button>
              <button type="button" onClick={() => setShowAdd(false)} style={{
                padding: "11px 20px", background: "#f3f4f6", color: "#374151",
                border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer",
              }}>Cancel</button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── EDIT MODAL ── */}
      {showEdit && (
        <Modal title={`Edit: ${showEdit.fullName}`} onClose={() => setShowEdit(null)} wide>
          <MsgBox msg={msg} />
          <form onSubmit={handleEdit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <FormField label="Full Name" value={form.fullName} onChange={fld("fullName")} placeholder="Full name" required />
              <FormField label="Username (read only)" value={form.username} disabled />
            </div>
            <FormField label="New Password (leave blank to keep current)" type="password" value={form.password} onChange={fld("password")} placeholder="Enter new password to change" />
            <StudentLinker />
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
                border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer",
              }}>Cancel</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
