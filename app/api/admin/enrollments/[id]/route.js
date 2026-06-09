import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/prisma";

async function auth() {
  const token = (await cookies()).get("admin_token")?.value;
  if (!token) return false;
  try { return !!(await verifyToken(token)); } catch { return false; }
}

export async function DELETE(_, { params }) {
  if (!(await auth())) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  try {
    await prisma.studentSubject.delete({ where: { id: parseInt(params.id) } });
    return NextResponse.json({ message: "Removed." });
  } catch (err) {
    console.error("[admin enrollments DELETE]", err);
    return NextResponse.json({ message: err?.message || "Internal server error." }, { status: 500 });
  }
}
