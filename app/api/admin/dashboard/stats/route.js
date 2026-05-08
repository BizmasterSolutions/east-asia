import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const token = (await cookies()).get("admin_token")?.value;
    if (!token || !(await verifyToken(token))) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const [totalStudents, totalParents, pendingInquiries, openVacancies] =
      await Promise.all([
        prisma.student.count(),
        prisma.parent.count(),
        prisma.inquiry.count({ where: { status: "pending" } }),
        prisma.jobApplication.count({ where: { status: "new" } }),
      ]);

    return NextResponse.json({
      totalStudents,
      totalParents,
      pendingInquiries,
      openVacancies,
    });
  } catch (err) {
    console.error("[dashboard/stats]", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
