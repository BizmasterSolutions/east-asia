import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import AnnouncementsAdminSection from "@/component/admin/announcements/AnnouncementsAdminSection";

export const metadata = { title: "Admin — Announcements" };

export default async function AdminAnnouncementsPage() {
  const token = (await cookies()).get("admin_token")?.value;
  if (!token || !(await verifyToken(token))) redirect("/admin/login");
  return <AnnouncementsAdminSection />;
}
