import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import EventsAdminSection from "@/component/admin/events/EventsAdminSection";

export const metadata = { title: "Admin — Events" };

export default async function AdminEventsPage() {
  const token = (await cookies()).get("admin_token")?.value;
  if (!token || !(await verifyToken(token))) redirect("/admin/login");
  return <EventsAdminSection />;
}
