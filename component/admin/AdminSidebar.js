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
      { label: "Home Hero", href: "/admin/home-content", icon: "fas fa-image" },
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
    <aside
      style={{
        width: 240,
        minHeight: "100vh",
        background: "#1e1b4b",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        position: "sticky",
        top: 0,
        alignSelf: "flex-start",
        height: "100vh",
        overflowY: "auto",
      }}
    >
      {/* Brand */}
      <div
        style={{
          padding: "24px 20px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Link
          href="/admin/dashboard"
          style={{ textDecoration: "none" }}
        >
          <p style={{ color: "#a5b4fc", fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 2px" }}>
            Admin Panel
          </p>
          <h2 style={{ color: "#fff", fontSize: 16, fontWeight: 700, margin: 0, lineHeight: 1.3 }}>
            East Asian<br />Int&apos;l School
          </h2>
        </Link>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "16px 0" }}>
        {NAV.map((group) => (
          <div key={group.group} style={{ marginBottom: 8 }}>
            <p
              style={{
                color: "rgba(165,180,252,0.5)",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "6px 20px 4px",
                margin: 0,
              }}
            >
              {group.group}
            </p>
            {group.items.map((item) => {
              const active =
                item.href === "/admin/dashboard"
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "9px 20px",
                    textDecoration: "none",
                    color: active ? "#fff" : "#a5b4fc",
                    background: active ? "rgba(99,102,241,0.35)" : "transparent",
                    borderLeft: active ? "3px solid #818cf8" : "3px solid transparent",
                    fontSize: 14,
                    fontWeight: active ? 600 : 400,
                    transition: "background 0.15s",
                  }}
                >
                  <i
                    className={item.icon}
                    style={{ width: 16, textAlign: "center", fontSize: 13, opacity: active ? 1 : 0.7 }}
                  />
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <form action="/api/auth/admin/logout" method="POST">
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "9px 16px",
              background: "rgba(239,68,68,0.15)",
              color: "#fca5a5",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 8,
              justifyContent: "center",
            }}
          >
            <i className="fas fa-sign-out-alt" />
            Logout
          </button>
        </form>
      </div>
    </aside>
  );
}
