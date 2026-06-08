import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

async function auth() {
  const token = (await cookies()).get("admin_token")?.value;
  if (!token) return false;
  try { return !!(await verifyToken(token)); } catch { return false; }
}

export async function PUT(req, { params }) {
  if (!(await auth())) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  try {
    const id = parseInt((await params).id);
    const { fullName, grade, password } = await req.json();
    if (!fullName || !grade)
      return NextResponse.json({ message: "Full name and grade are required." }, { status: 400 });

    const data = { fullName, grade };
    if (password) data.passwordHash = await bcrypt.hash(password, 12);

    const student = await prisma.student.update({
      where: { id },
      data,
      select: { id: true, username: true, fullName: true, grade: true, createdAt: true },
    });
    return NextResponse.json(student);
  } catch (err) {
    console.error("[admin/students PUT]", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  if (!(await auth())) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  try {
    const id = parseInt((await params).id);
    await prisma.student.delete({ where: { id } });
    return NextResponse.json({ message: "Student deleted." });
  } catch (err) {
    console.error("[admin/students DELETE]", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
