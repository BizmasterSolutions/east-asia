"use client";
import { useState } from "react";
import Image from "next/image";

const NAV = [
  { id: "overview", icon: "▦", label: "Overview" },
  { id: "notices", icon: "📢", label: "Notices Board" },
  { id: "exams", icon: "🗓️", label: "Exam Schedule" },
  { id: "downloads", icon: "📥", label: "Download Centre" },
];

export default function StudentSidebar({ fullName, grade }) {
  const [active, setActive] = useState("overview");
  const [collapsed, setCollapsed] = useState(false);

  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <aside style={{
      width: collapsed ? "72px" : "260px",
      minWidth: collapsed ? "72px" : "260px",
      background: "#111827",
      minHeight: "100vh",
      height: "100vh",
      position: "sticky",
      top: 0,
      display: "flex",
      flexDirection: "column",
      transition: "width 0.2s ease, min-width 0.2s ease",
      overflow: "hidden",
      zIndex: 20,
    }}>

      {/* Brand */}
      <div style={{ padding: "16px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: "72px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", overflow: "hidden", flex: 1 }}>
          {collapsed ? (
            <Image
              src="/Logo mod.png"
              alt="East Asian Logo"
              width={40}
              height={40}
              style={{ objectFit: "contain", flexShrink: 0 }}
            />
          ) : (
            <Image
              src="/Logo mod.png"
              alt="East Asian International School"
              width={160}
              height={52}
              style={{ objectFit: "contain", objectPosition: "left center" }}
            />
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", fontSize: "18px", padding: "2px 4px", flexShrink: 0, lineHeight: 1 }}
          title={collapsed ? "Expand" : "Collapse"}
        >
          {collapsed ? "›" : "‹"}
        </button>
      </div>

      {/* Student Profile */}
      <div style={{ padding: "18px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "42px", height: "42px", background: "linear-gradient(135deg,#c8a000,#e6c200)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 0 0 3px rgba(200,160,0,0.2)" }}>
            <span style={{ color: "#fff", fontWeight: 700, fontSize: "15px" }}>{initials}</span>
          </div>
          {!collapsed && (
            <div style={{ overflow: "hidden" }}>
              <p style={{ color: "#f9fafb", fontWeight: 600, fontSize: "14px", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{fullName}</p>
              <span style={{ display: "inline-block", background: "rgba(200,160,0,0.15)", color: "#c8a000", fontSize: "10px", padding: "2px 8px", borderRadius: "10px", fontWeight: 600, marginTop: "3px", whiteSpace: "nowrap" }}>
                {grade}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 10px" }}>
        {!collapsed && (
          <p style={{ color: "#4b5563", fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", padding: "0 8px", marginBottom: "8px", marginTop: "4px" }}>
            Navigation
          </p>
        )}
        {NAV.map(({ id, icon, label }) => {
          const isActive = active === id;
          return (
            <a
              key={id}
              href={`#${id}`}
              onClick={() => setActive(id)}
              title={collapsed ? label : undefined}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: collapsed ? "11px" : "10px 12px",
                borderRadius: "8px",
                marginBottom: "4px",
                textDecoration: "none",
                background: isActive ? "rgba(200,160,0,0.12)" : "transparent",
                color: isActive ? "#c8a000" : "#9ca3af",
                fontWeight: isActive ? 600 : 400,
                fontSize: "14px",
                justifyContent: collapsed ? "center" : "flex-start",
                borderLeft: isActive ? "3px solid #c8a000" : "3px solid transparent",
              }}
            >
              <span style={{ fontSize: "16px", flexShrink: 0 }}>{icon}</span>
              {!collapsed && <span style={{ whiteSpace: "nowrap" }}>{label}</span>}
            </a>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: "14px 10px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <form action="/api/auth/student/logout" method="POST">
          <button
            type="submit"
            title={collapsed ? "Logout" : undefined}
            style={{
              width: "100%",
              padding: collapsed ? "10px" : "9px 12px",
              background: "rgba(239,68,68,0.08)",
              color: "#f87171",
              border: "1px solid rgba(239,68,68,0.15)",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              justifyContent: collapsed ? "center" : "flex-start",
              gap: "8px",
            }}
          >
            <span style={{ fontSize: "15px" }}>⏻</span>
            {!collapsed && "Logout"}
          </button>
        </form>
      </div>
    </aside>
  );
}
