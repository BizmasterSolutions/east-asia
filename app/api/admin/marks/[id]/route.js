import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/prisma";

async function auth() {
  const token = (await cookies()).get("admin_token")?.value;
  if (!token) return false;
  try { return !!(await verifyToken(token)); } catch { return false; }
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

export async function PUT(req, { params }) {
  if (!(await auth())) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  try {
    const { marks, grade, teacherRemarks } = await req.json();
    const mark = await prisma.mark.update({
      where: { id: parseInt(params.id) },
      data: { marks: parseFloat(marks), grade: grade || autoGrade(marks), teacherRemarks: teacherRemarks || null },
      include: { subject: true },
    });
    return NextResponse.json(mark);
  } catch (err) {
    console.error("[admin marks PUT]", err);
    return NextResponse.json({ message: err?.message || "Internal server error." }, { status: 500 });
  }
}

export async function DELETE(_, { params }) {
  if (!(await auth())) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  try {
    await prisma.mark.delete({ where: { id: parseInt(params.id) } });
    return NextResponse.json({ message: "Deleted." });
  } catch (err) {
    console.error("[admin marks DELETE]", err);
    return NextResponse.json({ message: err?.message || "Internal server error." }, { status: 500 });
  }
}
