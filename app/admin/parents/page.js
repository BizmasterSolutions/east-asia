import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import ParentsAdminSection from "@/component/admin/parents/ParentsAdminSection";

export const metadata = { title: "Parents – Admin" };

export default async function AdminParentsPage() {
  const token = (await cookies()).get("admin_token")?.value;
  if (!token || !(await verifyToken(token))) redirect("/admin/login");
  return <ParentsAdminSection />;
}
