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

  const stats = [
    {
      title: "Total Students",
      value: totalStudents,
      href: "/admin/students",
      icon: "fas fa-user-graduate",
      gold: false,
    },
    {
      title: "Total Parents",
      value: totalParents,
      href: "/admin/parents",
      icon: "fas fa-users",
      gold: false,
    },
    {
      title: "Pending Inquiries",
      value: pendingInquiries,
      href: "/admin/inquiries",
      icon: "fas fa-envelope",
      gold: true,
    },
    {
      title: "Open Vacancies",
      value: openVacancies,
      href: "/admin/careers",
      icon: "fas fa-briefcase",
      gold: false,
    },
  ];

  const actions = [
    { label: "Home Content", href: "/admin/home-content", icon: "fas fa-image" },
    { label: "Inquiries", href: "/admin/inquiries", icon: "fas fa-envelope" },
    { label: "Gallery", href: "/admin/gallery", icon: "fas fa-images" },
    { label: "Announcements", href: "/admin/announcements", icon: "fas fa-bullhorn" },
    { label: "Careers", href: "/admin/careers", icon: "fas fa-briefcase" },
  ];

  return (
    <div className="ea-dashboard">
      <h1 className="ea-page-title">Dashboard</h1>
      <p className="ea-page-subtitle">Welcome back, Admin. Here&apos;s a quick overview.</p>

      {/* Stat Cards */}
      <div className="ea-stat-grid">
        {stats.map((s) => (
          <Link key={s.title} href={s.href} className={`ea-stat-card${s.gold ? " gold" : ""}`}>
            <div className="ea-stat-card-inner">
              <div>
                <p className="ea-stat-label">{s.title}</p>
                <h2 className="ea-stat-value">{s.value}</h2>
              </div>
              <div className="ea-stat-icon">
                <i className={s.icon} />
              </div>
            </div>
            <p className="ea-stat-link">
              View details <i className="fas fa-arrow-right" style={{ fontSize: 10 }} />
            </p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="ea-panel">
        <h3 className="ea-panel-heading">Quick Actions</h3>
        <div className="ea-action-row">
          {actions.map((a) => (
            <Link key={a.href} href={a.href} className="ea-action-btn">
              <i className={a.icon} />
              {a.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
