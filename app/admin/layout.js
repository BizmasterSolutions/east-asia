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
    <div className="ea-admin-shell">
      <AdminSidebar />
      <div className="ea-admin-main">
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
        <div className="ea-admin-content">
          {children}
        </div>
      </div>
    </div>
  );
}
