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
    const marks = await prisma.mark.findMany({
      where: { studentId },
      include: { subject: true },
      orderBy: [{ term: "asc" }, { subject: { name: "asc" } }],
    });
    return NextResponse.json(marks);
  } catch (err) {
    console.error("[admin marks GET]", err);
    return NextResponse.json({ message: err?.message || "Internal server error." }, { status: 500 });
  }
}

export async function POST(req) {
  if (!(await auth())) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  try {
    const { studentId, subjectId, term, marks, grade, teacherRemarks } = await req.json();
    if (!studentId || !subjectId || !term || marks === undefined || marks === null) {
      return NextResponse.json({ message: "studentId, subjectId, term and marks are required." }, { status: 400 });
    }
    const mark = await prisma.mark.upsert({
      where: { studentId_subjectId_term: { studentId, subjectId, term } },
      create: { studentId, subjectId, term, marks: parseFloat(marks), grade: grade || autoGrade(marks), teacherRemarks: teacherRemarks || null },
      update: { marks: parseFloat(marks), grade: grade || autoGrade(marks), teacherRemarks: teacherRemarks || null },
      include: { subject: true },
    });
    return NextResponse.json(mark, { status: 201 });
  } catch (err) {
    console.error("[admin marks POST]", err);
    return NextResponse.json({ message: err?.message || "Internal server error." }, { status: 500 });
  }
}

function autoGrade(marks) {
  const m = parseFloat(marks);
  if (m >= 90) return "A+";
  if (m >= 80) return "A";
  if (m >= 70) return "B+";
  if (m >= 60) return "B";
  if (m >= 50) return "C";
  if (m >= 40) return "D";
  return "F";
}
