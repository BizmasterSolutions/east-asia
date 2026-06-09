import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/prisma";

async function auth() {
  const token = (await cookies()).get("admin_token")?.value;
  if (!token) return false;
  try { return !!(await verifyToken(token)); } catch { return false; }
}

export async function GET() {
  if (!(await auth())) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  try {
    const items = await prisma.examSchedule.findMany({ orderBy: [{ examDate: "asc" }, { grade: "asc" }] });
    return NextResponse.json(items);
  } catch (err) {
    console.error("[admin exam-schedule GET]", err);
    return NextResponse.json({ message: err?.message || "Internal server error." }, { status: 500 });
  }
}

export async function POST(req) {
  if (!(await auth())) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  try {
    const { grade, examName, examDate, pdfPath } = await req.json();
    if (!grade || !examName || !examDate) {
      return NextResponse.json({ message: "Grade, exam name and date are required." }, { status: 400 });
    }
    const item = await prisma.examSchedule.create({
      data: { grade, examName, examDate: new Date(examDate), pdfPath: pdfPath || null },
    });
    return NextResponse.json(item, { status: 201 });
  } catch (err) {
    console.error("[admin exam-schedule POST]", err);
    return NextResponse.json({ message: err.message || "Internal server error." }, { status: 500 });
  }
}
