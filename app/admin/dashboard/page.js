import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";

export const metadata = {
  title: "Admin Dashboard",
};

export default async function AdminDashboard() {
  const token = (await cookies()).get("admin_token")?.value;
  if (!token || !(await verifyToken(token))) redirect("/admin/login");

  const [totalStudents, totalParents, pendingInquiries, openVacancies] =
    await Promise.all([
      prisma.student.count(),
      prisma.parent.count(),
      prisma.inquiry.count({ where: { status: "pending" } }),
      prisma.jobApplication.count({ where: { status: "new" } }),
    ]);

  const cards = [
    { title: "Total Students", value: totalStudents, link: "/admin/students", color: "#4f46e5" },
    { title: "Total Parents", value: totalParents, link: "/admin/parents", color: "#0891b2" },
    { title: "Pending Inquiries", value: pendingInquiries, link: "/admin/inquiries", color: "#d97706" },
    { title: "Open Vacancies", value: openVacancies, link: "/admin/careers", color: "#16a34a" },
  ];

  const quickLinks = [
    { label: "Students", href: "/admin/students" },
    { label: "Parents", href: "/admin/parents" },
    { label: "Academics", href: "/admin/academics" },
    { label: "Inquiries", href: "/admin/inquiries" },
    { label: "Careers", href: "/admin/careers" },
    { label: "Gallery", href: "/admin/gallery" },
    { label: "Announcements", href: "/admin/announcements" },
    { label: "Settings", href: "/admin/settings" },
  ];

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 700 }}>Admin Dashboard</h1>
        <form action="/api/auth/admin/logout" method="POST">
          <button
            type="submit"
            style={{
              padding: "8px 20px",
              background: "#ef4444",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </form>
      </div>

      {/* Overview Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.link}
            style={{
              display: "block",
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "10px",
              padding: "24px",
              textDecoration: "none",
              color: "inherit",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              borderTop: `4px solid ${card.color}`,
            }}
          >
            <p style={{ fontSize: "13px", color: "#6b7280", margin: 0, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {card.title}
            </p>
            <h2 style={{ fontSize: "36px", fontWeight: 700, margin: "8px 0 0", color: card.color }}>
              {card.value}
            </h2>
          </Link>
        ))}
      </div>

      {/* Quick Links */}
      <div style={{ marginTop: "40px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px" }}>Management Sections</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                padding: "10px 22px",
                background: "#f3f4f6",
                borderRadius: "8px",
                textDecoration: "none",
                color: "#1f2937",
                fontWeight: 500,
                fontSize: "14px",
                border: "1px solid #e5e7eb",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
