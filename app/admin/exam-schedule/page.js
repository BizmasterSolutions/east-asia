import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import ExamScheduleAdminSection from "@/component/admin/exam-schedule/ExamScheduleAdminSection";

export const metadata = { title: "Admin — Exam Schedule" };

export default async function AdminExamSchedulePage() {
  const token = (await cookies()).get("admin_token")?.value;
  if (!token || !(await verifyToken(token))) redirect("/admin/login");
  return <ExamScheduleAdminSection />;
}
