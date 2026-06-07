import { cookies, headers } from "next/headers";
import { verifyToken } from "@/lib/auth";
import AdminSidebar from "@/component/admin/AdminSidebar";
import "@/public/css/admin.css";

export default async function AdminLayout({ children }) {
  const pathname = (await headers()).get("x-pathname") ?? "";
  if (pathname === "/admin/login") return <>{children}</>;

  const token = (await cookies()).get("admin_token")?.value;
  let isAuthenticated = false;
  if (token) {
    try {
      isAuthenticated = !!(await verifyToken(token));
    } catch {
      isAuthenticated = false;
    }
  }

  if (!isAuthenticated) return <>{children}</>;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f0f2f5", fontFamily: "'Rubik', sans-serif" }}>
      {/* Fixed sidebar */}
      <div style={{ position: "fixed", top: 0, left: 0, width: "255px", height: "100vh", zIndex: 300, flexShrink: 0 }}>
        <AdminSidebar />
      </div>

      {/* Main content pushed right of sidebar */}
      <div style={{ marginLeft: "255px", flex: 1, minWidth: 0, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <header className="ea-admin-header">
          <span className="ea-header-title">
            East Asian International School &mdash;{" "}
            <span>Admin Portal</span>
          </span>
          <div className="ea-header-user">
            <div className="ea-header-avatar">
              <i className="fas fa-user-shield" />
            </div>
            <span className="ea-header-username">Admin</span>
          </div>
        </header>
        <div style={{ flex: 1, padding: "36px 40px" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
