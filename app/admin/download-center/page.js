import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import DownloadCenterAdminSection from "@/component/admin/download-center/DownloadCenterAdminSection";

export const metadata = { title: "Admin — Download Center" };

export default async function AdminDownloadCenterPage() {
  const token = (await cookies()).get("admin_token")?.value;
  if (!token || !(await verifyToken(token))) redirect("/admin/login");
  return <DownloadCenterAdminSection />;
}
