import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { deleteUploadThingFileByUrl } from "@/lib/uploadthing";

async function auth() {
  const token = (await cookies()).get("admin_token")?.value;
  if (!token) return false;
  try { return !!(await verifyToken(token)); } catch { return false; }
}

export async function GET(_, { params }) {
  if (!(await auth())) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  try {
    const item = await prisma.examSchedule.findUnique({ where: { id: parseInt(params.id) } });
    if (!item) return NextResponse.json({ message: "Not found." }, { status: 404 });
    return NextResponse.json(item);
  } catch (err) {
    console.error("[admin exam-schedule GET id]", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  if (!(await auth())) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  try {
    const { grade, examName, examDate, pdfPath } = await req.json();
    if (!grade || !examName || !examDate) {
      return NextResponse.json({ message: "Grade, exam name and date are required." }, { status: 400 });
    }
    const item = await prisma.examSchedule.update({
      where: { id: parseInt(params.id) },
      data: { grade, examName, examDate: new Date(examDate), pdfPath: pdfPath || null },
    });
    return NextResponse.json(item);
  } catch (err) {
    console.error("[admin exam-schedule PUT]", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}

export async function DELETE(_, { params }) {
  if (!(await auth())) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  try {
    const deleted = await prisma.examSchedule.delete({ where: { id: parseInt(params.id) } });
    await deleteUploadThingFileByUrl(deleted.pdfPath);
    return NextResponse.json({ message: "Deleted." });
  } catch (err) {
    console.error("[admin exam-schedule DELETE]", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
