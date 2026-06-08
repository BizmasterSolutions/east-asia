import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import StudentsAdminSection from "@/component/admin/students/StudentsAdminSection";

export const metadata = { title: "Students – Admin" };

export default async function AdminStudentsPage() {
  const token = (await cookies()).get("admin_token")?.value;
  if (!token || !(await verifyToken(token))) redirect("/admin/login");
  return <StudentsAdminSection />;
}
