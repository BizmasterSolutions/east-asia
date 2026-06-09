import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import StudentSidebar from "@/component/student/StudentSidebar";

export const metadata = { title: "My Exam Results – East Asian International School" };

const GRADE_ORDER = ["A+", "A", "B+", "B", "C", "D", "F"];

const GRADE_META = {
  "A+": { color: "#15803d", bg: "#f0fdf4", border: "#bbf7d0", label: "Excellent",    min: 90 },
  "A":  { color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0", label: "Very Good",    min: 80 },
  "B+": { color: "#0891b2", bg: "#e0f2fe", border: "#bae6fd", label: "Good",         min: 70 },
  "B":  { color: "#0369a1", bg: "#e0f2fe", border: "#bae6fd", label: "Above Average",min: 60 },
  "C":  { color: "#d97706", bg: "#fffbeb", border: "#fde68a", label: "Average",      min: 50 },
  "D":  { color: "#ea580c", bg: "#fff7ed", border: "#fed7aa", label: "Below Average",min: 40 },
  "F":  { color: "#dc2626", bg: "#fef2f2", border: "#fecaca", label: "Fail",         min: 0  },
};

export default async function StudentResultsPage() {
  const token = (await cookies()).get("student_token")?.value;
  if (!token) redirect("/student-portal/login");

  const payload = await verifyToken(token);
  if (!payload || payload.role !== "student") redirect("/student-portal/login");

  const { id: studentId, fullName, grade } = payload;

  const marks = await prisma.mark.findMany({
    where: { studentId },
    include: { subject: true },
    orderBy: [{ term: "asc" }, { subject: { name: "asc" } }],
  });

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  const initials = fullName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  // ── Group: grade → term → marks ────────────────────────────────────────
  const byGrade = {};
  for (const m of marks) {
    const g = m.grade || "F";
    if (!byGrade[g]) byGrade[g] = {};
    if (!byGrade[g][m.term]) byGrade[g][m.term] = [];
    byGrade[g][m.term].push(m);
  }

  const overallAvg = marks.length
    ? Math.round(marks.reduce((s, m) => s + m.marks, 0) / marks.length * 10) / 10
    : null;

  const allTerms  = [...new Set(marks.map((m) => m.term))].sort();
  const termAvgs  = allTerms.map((term) => {
    const tm = marks.filter((m) => m.term === term);
    return { term, avg: Math.round(tm.reduce((s, m) => s + m.marks, 0) / tm.length * 10) / 10 };
  });

  const gradeKeys = GRADE_ORDER.filter((g) => byGrade[g]);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f3f4f6", fontFamily: "'Segoe UI', sans-serif" }}>
      <StudentSidebar fullName={fullName} grade={grade} />

      <main style={{ flex: 1, overflow: "auto", minWidth: 0 }}>

        {/* Top bar */}
        <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "0 32px", height: "60px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 10 }}>
          <h1 style={{ fontSize: "17px", fontWeight: 700, color: "#111827", margin: 0 }}>My Exam Results</h1>
          <span style={{ fontSize: "12px", color: "#9ca3af" }}>{today}</span>
        </div>

        <div style={{ padding: "28px 32px" }}>

          {/* ── HERO BANNER ─────────────────────────────────── */}
          <div style={{
            background: "linear-gradient(120deg,#111827 0%,#1e3a5f 55%,#16a34a 100%)",
            borderRadius: "16px", padding: "28px 36px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            gap: "24px", marginBottom: "28px", position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(22,163,74,0.07)", top: "-60px", right: "200px" }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 6px" }}>Academic Report</p>
              <h2 style={{ color: "#fff", fontSize: "24px", fontWeight: 800, margin: "0 0 8px" }}>{fullName}</h2>
              <span style={{ background: "rgba(200,160,0,0.25)", color: "#fcd34d", border: "1px solid rgba(200,160,0,0.4)", padding: "4px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: 600 }}>{grade}</span>
            </div>

            <div style={{ display: "flex", gap: "14px", position: "relative", zIndex: 1, flexWrap: "wrap", justifyContent: "flex-end" }}>
              {overallAvg !== null && (
                <div style={{ textAlign: "center", background: "rgba(255,255,255,0.06)", borderRadius: "12px", padding: "14px 20px", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 4px" }}>Overall</p>
                  <p style={{ color: overallAvg >= 75 ? "#4ade80" : overallAvg >= 50 ? "#fcd34d" : "#f87171", fontSize: "30px", fontWeight: 800, margin: 0, lineHeight: 1 }}>{overallAvg}%</p>
                </div>
              )}
              {termAvgs.map(({ term, avg }) => (
                <div key={term} style={{ textAlign: "center", background: "rgba(255,255,255,0.06)", borderRadius: "12px", padding: "14px 18px", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 4px" }}>{term}</p>
                  <p style={{ color: avg >= 75 ? "#4ade80" : avg >= 50 ? "#fcd34d" : "#f87171", fontSize: "22px", fontWeight: 800, margin: 0, lineHeight: 1 }}>{avg}%</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── GRADE SUMMARY CHIPS ─────────────────────────── */}
          {marks.length > 0 && (
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "28px" }}>
              {gradeKeys.map((g) => {
                const meta  = GRADE_META[g] || GRADE_META["F"];
                const count = Object.values(byGrade[g]).flat().length;
                return (
                  <a key={g} href={`#grade-${g}`} style={{ textDecoration: "none" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", background: meta.bg, border: `1.5px solid ${meta.border}`, borderRadius: "30px", cursor: "pointer" }}>
                      <span style={{ fontSize: "18px", fontWeight: 800, color: meta.color }}>{g}</span>
                      <span style={{ fontSize: "12px", color: meta.color, fontWeight: 600 }}>{meta.label}</span>
                      <span style={{ background: meta.color, color: "#fff", fontSize: "11px", fontWeight: 700, padding: "1px 8px", borderRadius: "10px" }}>{count}</span>
                    </div>
                  </a>
                );
              })}
            </div>
          )}

          {/* ── NO RESULTS ──────────────────────────────────── */}
          {marks.length === 0 && (
            <div style={{ background: "#fff", border: "2px dashed #e5e7eb", borderRadius: "16px", padding: "64px 32px", textAlign: "center" }}>
              <p style={{ fontSize: "48px", margin: "0 0 16px" }}>📊</p>
              <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#111827", margin: "0 0 8px" }}>No Results Yet</h3>
              <p style={{ color: "#9ca3af", fontSize: "14px", margin: 0 }}>Your exam results will appear here once your teacher records them.</p>
            </div>
          )}

          {/* ── GRADE-WISE SECTIONS ─────────────────────────── */}
          {gradeKeys.map((g) => {
            const meta    = GRADE_META[g] || GRADE_META["F"];
            const termMap = byGrade[g];
            const termList = Object.keys(termMap).sort();
            const allInGrade = Object.values(termMap).flat();
            const gradeAvg = Math.round(allInGrade.reduce((s, m) => s + m.marks, 0) / allInGrade.length * 10) / 10;

            return (
              <div key={g} id={`grade-${g}`} style={{ marginBottom: "28px" }}>
                {/* Grade header */}
                <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
                  <div style={{ width: "52px", height: "52px", borderRadius: "12px", background: meta.bg, border: `2px solid ${meta.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: "22px", fontWeight: 900, color: meta.color }}>{g}</span>
                  </div>
                  <div>
                    <h2 style={{ fontSize: "18px", fontWeight: 800, color: "#111827", margin: "0 0 2px" }}>
                      Grade {g} — <span style={{ color: meta.color }}>{meta.label}</span>
                    </h2>
                    <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>
                      {allInGrade.length} result{allInGrade.length !== 1 ? "s" : ""} · Average {gradeAvg}%
                    </p>
                  </div>
                  <div style={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
                    {termList.map((t) => (
                      <span key={t} style={{ background: "#f3f4f6", color: "#374151", fontSize: "11px", fontWeight: 600, padding: "3px 10px", borderRadius: "20px" }}>{t}</span>
                    ))}
                  </div>
                </div>

                {/* Term-wise breakdown inside this grade */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {termList.map((term) => {
                    const termMarks = termMap[term];
                    return (
                      <div key={term} style={{ background: "#fff", border: `1px solid ${meta.border}`, borderLeft: `4px solid ${meta.color}`, borderRadius: "12px", overflow: "hidden" }}>
                        {/* Term label */}
                        <div style={{ padding: "10px 20px", background: meta.bg, borderBottom: `1px solid ${meta.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontSize: "14px" }}>🗓️</span>
                            <span style={{ fontSize: "13px", fontWeight: 700, color: meta.color }}>{term}</span>
                          </div>
                          <span style={{ fontSize: "12px", color: meta.color, fontWeight: 600 }}>
                            {termMarks.length} subject{termMarks.length !== 1 ? "s" : ""}
                          </span>
                        </div>

                        {/* Subjects table */}
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                          <thead>
                            <tr style={{ background: "#fafafa" }}>
                              {["Subject", "Marks", "Grade", "Teacher Remarks"].map((h) => (
                                <th key={h} style={{ padding: "9px 18px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {termMarks.map((m, i) => (
                              <tr key={m.id} style={{ borderTop: "1px solid #f3f4f6", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                                <td style={{ padding: "12px 18px", fontSize: "14px", fontWeight: 600, color: "#111827" }}>{m.subject.name}</td>
                                <td style={{ padding: "12px 18px" }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <span style={{ fontSize: "15px", fontWeight: 800, color: meta.color }}>{m.marks}</span>
                                    <div style={{ flex: 1, height: "6px", background: "#f3f4f6", borderRadius: "3px", maxWidth: "80px" }}>
                                      <div style={{ height: "100%", width: `${m.marks}%`, background: meta.color, borderRadius: "3px" }} />
                                    </div>
                                  </div>
                                </td>
                                <td style={{ padding: "12px 18px" }}>
                                  <span style={{ background: meta.bg, color: meta.color, border: `1px solid ${meta.border}`, padding: "3px 12px", borderRadius: "12px", fontSize: "12px", fontWeight: 800 }}>{m.grade}</span>
                                </td>
                                <td style={{ padding: "12px 18px", fontSize: "13px", color: "#6b7280" }}>{m.teacherRemarks || "—"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

        </div>
      </main>
    </div>
  );
}
