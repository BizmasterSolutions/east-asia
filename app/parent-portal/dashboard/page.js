import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import ParentSidebar from "@/component/parent/ParentSidebar";
import ChildSelector from "@/component/parent/ChildSelector";
import MarksChart from "@/component/parent/MarksChart";
import TermTrendChart from "@/component/parent/TermTrendChart";
import OverallProgress from "@/component/parent/OverallProgress";

export const metadata = { title: "Parent Dashboard – East Asian International School" };

// ── helpers ──────────────────────────────────────────────────────────────────

function calcTrend(termAverages) {
  if (termAverages.length < 2) return { label: "Not enough data", icon: "➡️", color: "#6b7280" };
  const diff = termAverages.at(-1).avg - termAverages.at(-2).avg;
  if (diff > 5)  return { label: "Improving",        icon: "📈", color: "#16a34a" };
  if (diff < -5) return { label: "Needs Attention",  icon: "📉", color: "#ef4444" };
  return            { label: "Stable",             icon: "➡️", color: "#f59e0b" };
}

function gradeColor(g) {
  if (!g) return "#6b7280";
  const f = g[0].toUpperCase();
  if (f === "A") return "#16a34a";
  if (f === "B") return "#0891b2";
  if (f === "C") return "#f59e0b";
  return "#ef4444";
}

// ── page ─────────────────────────────────────────────────────────────────────

export default async function ParentDashboard({ searchParams }) {
  const token = (await cookies()).get("parent_token")?.value;
  if (!token) redirect("/parent-portal/login");

  const payload = await verifyToken(token);
  if (!payload || payload.role !== "parent") redirect("/parent-portal/login");

  // Fetch all parent's children
  const parentChildren = await prisma.parentChild.findMany({
    where: { parentId: payload.id },
    include: { student: true },
    orderBy: { id: "asc" },
  });

  if (parentChildren.length === 0) {
    return <NoChildrenView fullName={payload.fullName} />;
  }

  const childList = parentChildren.map((pc) => ({ id: pc.student.id, fullName: pc.student.fullName, grade: pc.student.grade }));
  const selectedId = parseInt(searchParams?.child) || childList[0].id;
  const child = childList.find((c) => c.id === selectedId) ?? childList[0];

  // Fetch child data in parallel
  const [rawMarks, reportCards, rawAttendance, exams, announcements] = await Promise.all([
    prisma.mark.findMany({ where: { studentId: child.id }, include: { subject: true }, orderBy: [{ term: "asc" }] }),
    prisma.reportCard.findMany({ where: { studentId: child.id }, orderBy: { term: "asc" } }),
    Promise.resolve([]),
    prisma.examSchedule.findMany({ where: { grade: child.grade }, orderBy: { examDate: "asc" } }),
    prisma.announcement.findMany({ where: { target: { in: ["all", "parents"] } }, orderBy: { createdAt: "desc" }, take: 8 }),
  ]);

  // ── Process marks ─────────────────────────────────────────────────────────
  const allTerms    = [...new Set(rawMarks.map((m) => m.term))].sort();
  const allSubjects = [...new Set(rawMarks.map((m) => m.subject.name))].sort();

  // marksBySubject[subjectName][term] = { marks, grade, remarks }
  const marksBySubject = {};
  for (const m of rawMarks) {
    const s = m.subject.name;
    if (!marksBySubject[s]) marksBySubject[s] = {};
    marksBySubject[s][m.term] = { marks: m.marks, grade: m.grade, remarks: m.teacherRemarks ?? "" };
  }

  const overallAvg = rawMarks.length
    ? Math.round(rawMarks.reduce((s, m) => s + m.marks, 0) / rawMarks.length * 10) / 10
    : null;

  // Per-subject averages
  const subjectAvgs = allSubjects.map((subj) => {
    const vals = Object.values(marksBySubject[subj]).map((v) => v.marks);
    return { subject: subj, avg: Math.round(vals.reduce((a, b) => a + b, 0) / vals.length * 10) / 10 };
  });
  const strongest = subjectAvgs.length ? [...subjectAvgs].sort((a, b) => b.avg - a.avg)[0] : null;
  const weakest   = subjectAvgs.length ? [...subjectAvgs].sort((a, b) => a.avg - b.avg)[0] : null;

  // Term averages for trend
  const termAverages = allTerms.map((term) => {
    const termMarks = rawMarks.filter((m) => m.term === term);
    return { term, avg: Math.round(termMarks.reduce((s, m) => s + m.marks, 0) / termMarks.length * 10) / 10 };
  });
  const trend = calcTrend(termAverages);

  const today = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f1f5f9", fontFamily: "'Segoe UI', sans-serif" }}>
      <ParentSidebar fullName={payload.fullName} />

      <main style={{ flex: 1, overflow: "auto", minWidth: 0 }}>
        {/* Top bar */}
        <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "0 32px", height: "60px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 10 }}>
          <h1 style={{ fontSize: "17px", fontWeight: 700, color: "#111827", margin: 0 }}>Parent Dashboard</h1>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <ChildSelector children={childList} selectedId={child.id} />
            <span style={{ fontSize: "12px", color: "#9ca3af" }}>{today}</span>
          </div>
        </div>

        <div style={{ padding: "28px 32px" }}>

          {/* ── HERO ──────────────────────────────────────────── */}
          <section id="overview" style={{ marginBottom: "28px" }}>
            <div style={{ background: "linear-gradient(120deg,#0f172a 0%,#1e3a5f 55%,#0891b2 100%)", borderRadius: "16px", padding: "30px 36px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "20px", position: "relative", overflow: "hidden", marginBottom: "20px" }}>
              <div style={{ position: "absolute", width: "220px", height: "220px", borderRadius: "50%", background: "rgba(8,145,178,0.07)", top: "-80px", right: "220px" }} />
              <div style={{ position: "absolute", width: "150px", height: "150px", borderRadius: "50%", background: "rgba(255,255,255,0.04)", bottom: "-50px", right: "80px" }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 6px" }}>Academic Overview</p>
                <h2 style={{ color: "#fff", fontSize: "24px", fontWeight: 800, margin: "0 0 10px" }}>{child.fullName}</h2>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <span style={{ background: "rgba(8,145,178,0.25)", color: "#67e8f9", border: "1px solid rgba(8,145,178,0.4)", padding: "4px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: 600 }}>{child.grade}</span>
                  <span style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)", padding: "4px 14px", borderRadius: "20px", fontSize: "12px" }}>
                    {trend.icon} {trend.label}
                  </span>
                </div>
              </div>
              <div style={{ display: "flex", gap: "16px", position: "relative", zIndex: 1 }}>
                {overallAvg !== null && (
                  <div style={{ textAlign: "center", background: "rgba(255,255,255,0.06)", borderRadius: "12px", padding: "16px 20px", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 4px" }}>Overall Avg</p>
                    <p style={{ color: overallAvg >= 75 ? "#4ade80" : overallAvg >= 50 ? "#fcd34d" : "#f87171", fontSize: "32px", fontWeight: 800, margin: 0, lineHeight: 1 }}>{overallAvg}%</p>
                  </div>
                )}
              </div>
            </div>

            {/* Stats row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px" }}>
              {[
                { label: "Strongest Subject", value: strongest?.subject ?? "—", sub: strongest ? `${strongest.avg}% avg` : "", icon: "🏆", color: "#16a34a", bg: "#f0fdf4" },
                { label: "Weakest Subject",   value: weakest?.subject  ?? "—", sub: weakest  ? `${weakest.avg}% avg`  : "", icon: "⚠️",  color: "#ea580c", bg: "#fff7ed" },
                { label: "Grade Trend",       value: trend.label, icon: trend.icon, color: trend.color, bg: "#f9fafb" },
              ].map(({ label, value, sub, icon, color, bg }) => (
                <div key={label} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "18px", display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "10px", background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>{icon}</div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: "10px", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600, margin: "0 0 3px" }}>{label}</p>
                    <p style={{ fontSize: "16px", fontWeight: 700, color, margin: 0, wordBreak: "break-word" }}>{value}</p>
                    {sub && <p style={{ fontSize: "11px", color: "#9ca3af", margin: "2px 0 0" }}>{sub}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── ACADEMICS ─────────────────────────────────────── */}
          <section id="academics" style={{ marginBottom: "28px" }}>
            <SectionHeader title="Academic Performance" icon="📊" />

            {/* Charts row: Performance Graph + Term Comparison + Overall Progress */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
              <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "20px 24px" }}>
                <p style={{ fontSize: "14px", fontWeight: 600, color: "#374151", margin: "0 0 4px" }}>Performance Graph</p>
                <p style={{ fontSize: "12px", color: "#9ca3af", margin: "0 0 16px" }}>Marks per subject by term</p>
                <MarksChart subjects={allSubjects} terms={allTerms} marksBySubject={marksBySubject} />
              </div>
              <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "20px 24px" }}>
                <p style={{ fontSize: "14px", fontWeight: 600, color: "#374151", margin: "0 0 4px" }}>Term Comparison Chart</p>
                <p style={{ fontSize: "12px", color: "#9ca3af", margin: "0 0 16px" }}>Subject trends across terms</p>
                <TermTrendChart subjects={allSubjects} terms={allTerms} marksBySubject={marksBySubject} />
              </div>
            </div>

            {/* Subject Summary Cards + Overall Progress */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "16px", marginBottom: "16px" }}>
              {/* Subject Summary Cards */}
              <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "20px 24px" }}>
                <p style={{ fontSize: "14px", fontWeight: 600, color: "#374151", margin: "0 0 16px" }}>Subject Summary Cards</p>
                {subjectAvgs.length === 0 ? (
                  <p style={{ color: "#9ca3af", fontSize: "13px" }}>No data yet.</p>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "10px" }}>
                    {subjectAvgs.sort((a, b) => b.avg - a.avg).map((s, i) => {
                      const isTop = i === 0;
                      const isLow = i === subjectAvgs.length - 1;
                      const color = s.avg >= 75 ? "#16a34a" : s.avg >= 50 ? "#f59e0b" : "#ef4444";
                      return (
                        <div key={s.subject} style={{ border: `1px solid ${isTop ? "#16a34a" : isLow ? "#ef4444" : "#e5e7eb"}`, borderRadius: "10px", padding: "14px", background: isTop ? "#f0fdf4" : isLow ? "#fef2f2" : "#fafafa" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                            <p style={{ fontSize: "13px", fontWeight: 600, color: "#374151", margin: 0, lineHeight: 1.3 }}>{s.subject}</p>
                            {isTop && <span style={{ fontSize: "14px" }}>🏆</span>}
                            {isLow && <span style={{ fontSize: "14px" }}>⚠️</span>}
                          </div>
                          <p style={{ fontSize: "22px", fontWeight: 800, color, margin: "0 0 6px", lineHeight: 1 }}>{s.avg}%</p>
                          <div style={{ height: "5px", background: "#e5e7eb", borderRadius: "3px" }}>
                            <div style={{ height: "100%", width: `${s.avg}%`, background: color, borderRadius: "3px" }} />
                          </div>
                          <p style={{ fontSize: "10px", color: "#9ca3af", margin: "5px 0 0", fontWeight: 600 }}>
                            {isTop ? "BEST SUBJECT" : isLow ? "NEEDS FOCUS" : "Average across terms"}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Overall Progress Ring */}
              <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "20px 24px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "20px" }}>
                <p style={{ fontSize: "14px", fontWeight: 600, color: "#374151", margin: 0 }}>Overall Average</p>
                <OverallProgress value={overallAvg} />
                {termAverages.length > 0 && (
                  <div style={{ width: "100%" }}>
                    <p style={{ fontSize: "11px", color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>Per Term</p>
                    {termAverages.map((ta) => (
                      <div key={ta.term} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                        <span style={{ fontSize: "11px", color: "#6b7280", width: "52px", flexShrink: 0 }}>{ta.term}</span>
                        <div style={{ flex: 1, height: "6px", background: "#f3f4f6", borderRadius: "3px" }}>
                          <div style={{ height: "100%", width: `${ta.avg}%`, background: ta.avg >= 75 ? "#16a34a" : ta.avg >= 50 ? "#f59e0b" : "#ef4444", borderRadius: "3px" }} />
                        </div>
                        <span style={{ fontSize: "11px", fontWeight: 700, color: "#374151", width: "36px", textAlign: "right" }}>{ta.avg}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Marks tables per term */}
            <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", overflow: "hidden" }}>
              <div style={{ padding: "16px 24px", borderBottom: "1px solid #f3f4f6" }}>
                <p style={{ fontSize: "14px", fontWeight: 600, color: "#374151", margin: 0 }}>Marks by Term — {child.fullName}</p>
              </div>

              {/* Marks table */}
              {allTerms.map((term) => {
                const termMarks = rawMarks.filter((m) => m.term === term);
                if (!termMarks.length) return null;
                return (
                  <div key={term} style={{ padding: "0" }}>
                    <div style={{ padding: "12px 24px", background: "#f8fafc", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "13px", fontWeight: 700, color: "#374151" }}>{term}</span>
                      <span style={{ fontSize: "12px", color: "#6b7280" }}>
                        Avg: {Math.round(termMarks.reduce((s, m) => s + m.marks, 0) / termMarks.length * 10) / 10}%
                      </span>
                    </div>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ background: "#f9fafb" }}>
                          {["Subject", "Marks", "Grade", "Teacher Remarks"].map((h) => (
                            <th key={h} style={{ padding: "10px 20px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {termMarks.map((m, i) => (
                          <tr key={m.id} style={{ borderTop: "1px solid #f3f4f6", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                            <td style={{ padding: "11px 20px", fontSize: "14px", color: "#111827", fontWeight: 500 }}>{m.subject.name}</td>
                            <td style={{ padding: "11px 20px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <span style={{ fontSize: "14px", fontWeight: 700, color: m.marks >= 75 ? "#16a34a" : m.marks >= 50 ? "#f59e0b" : "#ef4444" }}>{m.marks}</span>
                                <div style={{ flex: 1, height: "6px", background: "#f3f4f6", borderRadius: "3px", maxWidth: "80px" }}>
                                  <div style={{ height: "100%", width: `${m.marks}%`, background: m.marks >= 75 ? "#16a34a" : m.marks >= 50 ? "#f59e0b" : "#ef4444", borderRadius: "3px" }} />
                                </div>
                              </div>
                            </td>
                            <td style={{ padding: "11px 20px" }}>
                              <span style={{ background: gradeColor(m.grade) + "18", color: gradeColor(m.grade), padding: "3px 10px", borderRadius: "10px", fontSize: "12px", fontWeight: 700 }}>{m.grade}</span>
                            </td>
                            <td style={{ padding: "11px 20px", fontSize: "13px", color: "#6b7280" }}>{m.teacherRemarks || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })}

              {rawMarks.length === 0 && (
                <div style={{ padding: "40px", textAlign: "center" }}>
                  <p style={{ color: "#9ca3af", fontSize: "14px", margin: 0 }}>No marks recorded yet.</p>
                </div>
              )}
            </div>
          </section>

          {/* ── REPORT CARDS ──────────────────────────────────── */}
          <section id="reports" style={{ marginBottom: "28px" }}>
            <SectionHeader title="Report Cards" icon="📁" />
            {reportCards.length === 0 ? (
              <Empty text="No report cards uploaded yet." />
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "14px" }}>
                {reportCards.map((rc) => (
                  <div key={rc.id} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "20px", textAlign: "center" }}>
                    <div style={{ fontSize: "36px", marginBottom: "10px" }}>📄</div>
                    <p style={{ fontSize: "14px", fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>{rc.term}</p>
                    <p style={{ fontSize: "11px", color: "#9ca3af", margin: "0 0 14px" }}>
                      {new Date(rc.uploadedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                    <a href={rc.filePath} download style={{ display: "block", padding: "8px", background: "#0891b2", color: "#fff", borderRadius: "8px", textDecoration: "none", fontSize: "13px", fontWeight: 600 }}>
                      ↓ Download PDF
                    </a>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ── NOTICES & EXAMS ───────────────────────────────── */}
          <section id="notices" style={{ marginBottom: "28px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>

              {/* Announcements */}
              <div>
                <SectionHeader title="Announcements" icon="📢" />
                {announcements.length === 0 ? <Empty text="No announcements." /> : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {announcements.map((a) => (
                      <div key={a.id} style={{ background: "#fff", border: "1px solid #e5e7eb", borderLeft: "4px solid #0891b2", borderRadius: "10px", padding: "14px 18px" }}>
                        <strong style={{ fontSize: "14px", color: "#111827" }}>{a.title}</strong>
                        <p style={{ margin: "5px 0 0", fontSize: "13px", color: "#6b7280", lineHeight: 1.5 }}>{a.body}</p>
                        <span style={{ display: "block", marginTop: "6px", fontSize: "11px", color: "#9ca3af" }}>
                          {new Date(a.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Exam schedule */}
              <div>
                <SectionHeader title="Upcoming Exams" icon="🗓️" />
                {exams.length === 0 ? <Empty text="No exams scheduled." /> : (
                  <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", overflow: "hidden" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ background: "#0f172a" }}>
                          {["Exam", "Subject", "Date"].map((h) => (
                            <th key={h} style={{ padding: "11px 16px", textAlign: "left", color: "rgba(255,255,255,0.65)", fontSize: "11px", fontWeight: 600, textTransform: "uppercase" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {exams.map((e, i) => (
                          <tr key={e.id} style={{ borderTop: "1px solid #f3f4f6", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                            <td style={{ padding: "10px 16px", fontSize: "13px", color: "#111827", fontWeight: 500 }}>{e.examName}</td>
                            <td style={{ padding: "10px 16px", fontSize: "13px", color: "#374151" }}>{e.subject}</td>
                            <td style={{ padding: "10px 16px", fontSize: "13px", color: "#374151" }}>
                              {new Date(e.examDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>
          </section>

        </div>
      </main>
    </div>
  );
}

// ── sub-components ────────────────────────────────────────────────────────────

function SectionHeader({ title, icon }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
      <span style={{ fontSize: "18px" }}>{icon}</span>
      <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#111827", margin: 0 }}>{title}</h2>
    </div>
  );
}

function Empty({ text }) {
  return (
    <div style={{ background: "#fff", border: "1px dashed #d1d5db", borderRadius: "12px", padding: "28px", textAlign: "center" }}>
      <p style={{ color: "#9ca3af", fontSize: "14px", margin: 0 }}>{text}</p>
    </div>
  );
}

function NoChildrenView({ fullName }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
      <div style={{ textAlign: "center", padding: "40px" }}>
        <p style={{ fontSize: "48px", marginBottom: "16px" }}>👨‍👧</p>
        <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#111827" }}>Hello, {fullName}</h2>
        <p style={{ color: "#6b7280", marginTop: "8px" }}>No children are linked to your account yet. Please contact the school admin.</p>
        <form action="/api/auth/parent/logout" method="POST" style={{ marginTop: "24px" }}>
          <button type="submit" style={{ padding: "10px 24px", background: "#0891b2", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600 }}>Logout</button>
        </form>
      </div>
    </div>
  );
}
