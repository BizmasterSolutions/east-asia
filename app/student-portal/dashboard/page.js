import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import StudentSidebar from "@/component/student/StudentSidebar";

export const metadata = {
  title: "Student Dashboard – East Asian International School",
};

const CATEGORIES = [
  { key: "term-paper", label: "Term Papers", icon: "📝", color: "#6366f1" },
  { key: "mock", label: "Mock Papers", icon: "📋", color: "#0891b2" },
  { key: "past", label: "Past Papers", icon: "📚", color: "#16a34a" },
  { key: "revision", label: "Revision Papers", icon: "✏️", color: "#ea580c" },
  { key: "timetable", label: "Timetables", icon: "📅", color: "#c8a000" },
];

export default async function StudentDashboard() {
  const token = (await cookies()).get("student_token")?.value;
  if (!token) redirect("/student-portal/login");

  const payload = await verifyToken(token);
  if (!payload || payload.role !== "student") redirect("/student-portal/login");

  const { fullName, grade } = payload;

  const [downloads, exams, announcements] = await Promise.all([
    prisma.downloadableFile.findMany({ where: { grade }, orderBy: { uploadedAt: "desc" } }),
    prisma.examSchedule.findMany({ where: { grade }, orderBy: { examDate: "asc" } }),
    prisma.announcement.findMany({
      where: { target: { in: ["all", "students"] } },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  const initials = fullName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  const nextExam = exams[0] ?? null;
  const stats = [
    { label: "Available Files", value: downloads.length, icon: "📄", color: "#6366f1", bg: "#eef2ff" },
    { label: "Upcoming Exams", value: exams.length, icon: "📝", color: "#0891b2", bg: "#e0f2fe" },
    { label: "Announcements", value: announcements.length, icon: "📢", color: "#c8a000", bg: "#fffbeb" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f3f4f6", fontFamily: "'Segoe UI', sans-serif" }}>

      <StudentSidebar fullName={fullName} grade={grade} />

      {/* Main */}
      <main style={{ flex: 1, overflow: "auto", minWidth: 0 }}>

        {/* Top bar */}
        <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "0 32px", height: "60px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 10 }}>
          <h1 style={{ fontSize: "17px", fontWeight: 700, color: "#111827", margin: 0 }}>Student Dashboard</h1>
          <span style={{ fontSize: "12px", color: "#9ca3af" }}>{today}</span>
        </div>

        <div style={{ padding: "28px 32px" }}>

          {/* ── HERO SECTION ──────────────────────────────── */}
          <section id="overview" style={{ marginBottom: "32px" }}>
            {/* Welcome banner */}
            <div style={{
              background: "linear-gradient(120deg, #111827 0%, #1e3a5f 60%, #c8a000 100%)",
              borderRadius: "16px",
              padding: "32px 36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "24px",
              marginBottom: "20px",
              overflow: "hidden",
              position: "relative",
            }}>
              {/* Decorative circles */}
              <div style={{ position: "absolute", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(200,160,0,0.08)", top: "-60px", right: "200px" }} />
              <div style={{ position: "absolute", width: "140px", height: "140px", borderRadius: "50%", background: "rgba(255,255,255,0.04)", bottom: "-40px", right: "80px" }} />

              <div style={{ position: "relative", zIndex: 1 }}>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", margin: "0 0 6px", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  Welcome back
                </p>
                <h2 style={{ color: "#fff", fontSize: "26px", fontWeight: 800, margin: "0 0 8px" }}>
                  {fullName}
                </h2>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                  <span style={{ background: "rgba(200,160,0,0.25)", color: "#fcd34d", border: "1px solid rgba(200,160,0,0.4)", padding: "4px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: 600 }}>
                    {grade}
                  </span>
                  <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px" }}>
                    {nextExam
                      ? `Next exam: ${nextExam.examName} on ${new Date(nextExam.examDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`
                      : "No upcoming exams"}
                  </span>
                </div>
              </div>

              {/* Avatar */}
              <div style={{
                width: "72px", height: "72px", borderRadius: "50%",
                background: "linear-gradient(135deg,#c8a000,#e6c200)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, fontSize: "26px", fontWeight: 800, color: "#fff",
                boxShadow: "0 0 0 4px rgba(200,160,0,0.25)",
                position: "relative", zIndex: 1,
              }}>
                {initials}
              </div>
            </div>

            {/* Stat cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
              {stats.map(({ label, value, icon, color, bg }) => (
                <div key={label} style={{ background: "#fff", borderRadius: "12px", padding: "20px 24px", border: "1px solid #e5e7eb", display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>
                    {icon}
                  </div>
                  <div>
                    <p style={{ fontSize: "11px", color: "#9ca3af", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>{label}</p>
                    <p style={{ fontSize: "28px", fontWeight: 800, color, margin: 0, lineHeight: 1 }}>{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── NOTICES BOARD ─────────────────────────────── */}
          <section id="notices" style={{ marginBottom: "32px" }}>
            <SectionHeader title="Notices Board" icon="📢" count={announcements.length} />
            {announcements.length === 0 ? (
              <Empty text="No announcements at this time." />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {announcements.map((a) => (
                  <div key={a.id} style={{
                    background: "#fff",
                    border: "1px solid #e5e7eb",
                    borderLeft: "4px solid #c8a000",
                    borderRadius: "10px",
                    padding: "16px 20px",
                    display: "flex",
                    gap: "14px",
                    alignItems: "flex-start",
                  }}>
                    <div style={{ width: "36px", height: "36px", background: "#fffbeb", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>
                      📢
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <strong style={{ fontSize: "14px", color: "#111827", display: "block", marginBottom: "4px" }}>{a.title}</strong>
                      <p style={{ margin: 0, color: "#6b7280", fontSize: "13px", lineHeight: 1.6 }}>{a.body}</p>
                      <span style={{ display: "inline-block", marginTop: "8px", fontSize: "11px", color: "#9ca3af", background: "#f9fafb", padding: "2px 8px", borderRadius: "4px" }}>
                        {new Date(a.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ── EXAM SCHEDULE ─────────────────────────────── */}
          <section id="exams" style={{ marginBottom: "32px" }}>
            <SectionHeader title="Exam Schedule" icon="🗓️" count={exams.length} />
            {exams.length === 0 ? (
              <Empty text="No upcoming exams scheduled for your grade." />
            ) : (
              <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#111827" }}>
                      {["#", "Exam Name", "Subject", "Date", "Days Left"].map((h) => (
                        <th key={h} style={{ padding: "13px 18px", textAlign: "left", color: "rgba(255,255,255,0.7)", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {exams.map((e, i) => {
                      const daysLeft = Math.ceil((new Date(e.examDate) - new Date()) / (1000 * 60 * 60 * 24));
                      const urgency = daysLeft <= 7 ? "#ef4444" : daysLeft <= 14 ? "#f59e0b" : "#16a34a";
                      return (
                        <tr key={e.id} style={{ borderTop: "1px solid #f3f4f6", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                          <td style={{ padding: "13px 18px", fontSize: "13px", color: "#9ca3af", fontWeight: 600 }}>{i + 1}</td>
                          <td style={{ padding: "13px 18px", fontSize: "14px", color: "#111827", fontWeight: 500 }}>{e.examName}</td>
                          <td style={{ padding: "13px 18px", fontSize: "14px", color: "#374151" }}>{e.subject}</td>
                          <td style={{ padding: "13px 18px", fontSize: "14px", color: "#374151" }}>
                            {new Date(e.examDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                          </td>
                          <td style={{ padding: "13px 18px" }}>
                            <span style={{ background: `${urgency}18`, color: urgency, padding: "3px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: 600 }}>
                              {daysLeft > 0 ? `${daysLeft}d` : daysLeft === 0 ? "Today" : "Past"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* ── DOWNLOAD CENTRE ───────────────────────────── */}
          <section id="downloads" style={{ marginBottom: "32px" }}>
            <SectionHeader title="Download Centre" icon="📥" count={downloads.length} />
            {downloads.length === 0 ? (
              <Empty text="No files available for your grade yet." />
            ) : (
              CATEGORIES.map(({ key, label, icon, color }) => {
                const files = downloads.filter((f) => f.category === key);
                if (files.length === 0) return null;
                return (
                  <div key={key} style={{ marginBottom: "24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                      <span style={{ fontSize: "16px" }}>{icon}</span>
                      <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#374151", margin: 0 }}>{label}</h3>
                      <span style={{ background: "#f3f4f6", color: "#6b7280", fontSize: "11px", padding: "1px 8px", borderRadius: "10px", fontWeight: 600 }}>
                        {files.length}
                      </span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "12px" }}>
                      {files.map((file) => (
                        <div key={file.id} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "18px", display: "flex", flexDirection: "column", gap: "12px" }}>
                          <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                            <div style={{ width: "40px", height: "40px", background: `${color}15`, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>
                              📄
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{ fontSize: "13px", fontWeight: 600, color: "#111827", margin: 0, lineHeight: 1.4, wordBreak: "break-word" }}>{file.title}</p>
                              <p style={{ fontSize: "11px", color: "#9ca3af", margin: "4px 0 0" }}>
                                {new Date(file.uploadedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                              </p>
                            </div>
                          </div>
                          <a
                            href={file.filePath}
                            download
                            style={{ display: "block", textAlign: "center", padding: "8px", background: color, color: "#fff", borderRadius: "8px", textDecoration: "none", fontSize: "13px", fontWeight: 600 }}
                          >
                            ↓ Download
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </section>

        </div>
      </main>
    </div>
  );
}

function SectionHeader({ title, icon, count }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
      <span style={{ fontSize: "20px" }}>{icon}</span>
      <h2 style={{ fontSize: "17px", fontWeight: 700, color: "#111827", margin: 0 }}>{title}</h2>
      {count > 0 && (
        <span style={{ background: "#111827", color: "#fff", fontSize: "11px", padding: "2px 8px", borderRadius: "10px", fontWeight: 600 }}>
          {count}
        </span>
      )}
    </div>
  );
}

function Empty({ text }) {
  return (
    <div style={{ background: "#fff", border: "1px dashed #d1d5db", borderRadius: "12px", padding: "32px", textAlign: "center" }}>
      <p style={{ color: "#9ca3af", fontSize: "14px", margin: 0 }}>{text}</p>
    </div>
  );
}
