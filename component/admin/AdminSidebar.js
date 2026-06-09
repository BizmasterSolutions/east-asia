"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  {
    group: "Overview",
    items: [
      { label: "Dashboard", href: "/admin/dashboard", icon: "fas fa-tachometer-alt" },
    ],
  },
  {
    group: "Content",
    items: [
      { label: "Home Content", href: "/admin/home-content", icon: "fas fa-home" },
    ],
  },
  {
    group: "People",
    items: [
      { label: "Students", href: "/admin/students", icon: "fas fa-user-graduate" },
      { label: "Parents", href: "/admin/parents", icon: "fas fa-users" },
    ],
  },
  {
    group: "Academics",
    items: [
      { label: "Academics", href: "/admin/academics", icon: "fas fa-book" },
    ],
  },
  {
    group: "Management",
    items: [
      { label: "Events", href: "/admin/events", icon: "fas fa-calendar-alt" },
      { label: "Announcements", href: "/admin/announcements", icon: "fas fa-bullhorn" },
      { label: "Gallery", href: "/admin/gallery", icon: "fas fa-images" },
      { label: "Careers", href: "/admin/careers", icon: "fas fa-briefcase" },
      { label: "Inquiries", href: "/admin/inquiries", icon: "fas fa-envelope" },
    ],
  },
  {
    group: "System",
    items: [
      { label: "Settings", href: "/admin/settings", icon: "fas fa-cog" },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="ea-admin-sidebar" style={{ width: "255px", height: "100vh" }}>
      {/* Brand */}
      <div className="ea-sidebar-brand">
        <Link href="/admin/dashboard">
          <span className="ea-sidebar-brand-logo-wrap">
            <img src="/Logo mod.png" alt="East Asian" />
          </span>
          <span style={{ display: "flex", flexDirection: "column" }}>
            <span className="ea-sidebar-brand-label">Admin Panel</span>
            <span className="ea-sidebar-brand-name">East Asian<br />Int&apos;l School</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="ea-sidebar-nav">
        {NAV.map((group) => (
          <div key={group.group} className="ea-nav-group">
            <span className="ea-nav-group-label">{group.group}</span>
            {group.items.map((item) => {
              const active =
                item.href === "/admin/dashboard"
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`ea-nav-link${active ? " active" : ""}`}
                >
                  <i className={item.icon} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="ea-sidebar-footer">
        <button
          type="button"
          className="ea-logout-btn"
          onClick={async () => {
            await fetch("/api/auth/admin/logout", { method: "POST" });
            window.location.href = "/admin/login";
          }}
        >
          <i className="fas fa-sign-out-alt" />
          Logout
        </button>
      </div>
    </aside>
  );
}
