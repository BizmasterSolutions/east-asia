import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/prisma";

async function auth() {
  const token = (await cookies()).get("admin_token")?.value;
  if (!token) return false;
  try { return !!(await verifyToken(token)); } catch { return false; }
}

export async function GET(req) {
  if (!(await auth())) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  try {
    const { searchParams } = new URL(req.url);
    const studentId = parseInt(searchParams.get("studentId"));
    if (!studentId) return NextResponse.json({ message: "studentId required." }, { status: 400 });
    const enrollments = await prisma.studentSubject.findMany({
      where: { studentId },
      include: { subject: true },
      orderBy: { subject: { name: "asc" } },
    });
    return NextResponse.json(enrollments);
  } catch (err) {
    console.error("[admin enrollments GET]", err);
    return NextResponse.json({ message: err?.message || "Internal server error." }, { status: 500 });
  }
}

export async function POST(req) {
  if (!(await auth())) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  try {
    const { studentId, subjectId } = await req.json();
    if (!studentId || !subjectId) return NextResponse.json({ message: "studentId and subjectId required." }, { status: 400 });
    const existing = await prisma.studentSubject.findUnique({ where: { studentId_subjectId: { studentId, subjectId } } });
    if (existing) return NextResponse.json(existing);
    const enrollment = await prisma.studentSubject.create({
      data: { studentId, subjectId },
      include: { subject: true },
    });
    return NextResponse.json(enrollment, { status: 201 });
  } catch (err) {
    console.error("[admin enrollments POST]", err);
    return NextResponse.json({ message: err?.message || "Internal server error." }, { status: 500 });
  }
}
