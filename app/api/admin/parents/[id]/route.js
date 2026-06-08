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
    const { fullName, password, studentIds } = await req.json();
    if (!fullName)
      return NextResponse.json({ message: "Full name is required." }, { status: 400 });

    const data = { fullName };
    if (password) data.passwordHash = await bcrypt.hash(password, 12);

    const parent = await prisma.parent.update({ where: { id }, data });

    // sync linked children if studentIds array provided
    if (Array.isArray(studentIds)) {
      await prisma.parentChild.deleteMany({ where: { parentId: id } });
      if (studentIds.length > 0) {
        await prisma.parentChild.createMany({
          data: studentIds.map(studentId => ({ parentId: id, studentId })),
          skipDuplicates: true,
        });
      }
    }

    const updated = await prisma.parent.findUnique({
      where: { id },
      select: {
        id: true, username: true, fullName: true, createdAt: true,
        children: { select: { student: { select: { id: true, fullName: true, grade: true } } } },
      },
    });
    return NextResponse.json({ ...updated, children: updated.children.map(c => c.student) });
  } catch (err) {
    console.error("[admin/parents PUT]", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  if (!(await auth())) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  try {
    const id = parseInt((await params).id);
    await prisma.parent.delete({ where: { id } });
    return NextResponse.json({ message: "Parent deleted." });
  } catch (err) {
    console.error("[admin/parents DELETE]", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
