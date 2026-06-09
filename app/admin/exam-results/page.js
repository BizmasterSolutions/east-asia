import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import ExamResultsAdminSection from "@/component/admin/exam-results/ExamResultsAdminSection";

export const metadata = { title: "Admin — Exam Results" };

export default async function AdminExamResultsPage() {
  const token = (await cookies()).get("admin_token")?.value;
  if (!token || !(await verifyToken(token))) redirect("/admin/login");
  return <ExamResultsAdminSection />;
}
