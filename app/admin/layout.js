import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import AdminSidebar from "@/component/admin/AdminSidebar";

export default async function AdminLayout({ children }) {
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
    <div style={{ display: "flex", minHeight: "100vh", background: "#f9fafb" }}>
      <AdminSidebar />
      <main style={{ flex: 1, minWidth: 0, overflowY: "auto" }}>
        {children}
      </main>
    </div>
  );
}
