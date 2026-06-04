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

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "30px" }}>Dashboard</h1>

      {/* Overview Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
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
    </div>
  );
}
