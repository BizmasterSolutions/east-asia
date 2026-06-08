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

export async function GET(req) {
  if (!(await auth())) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() || "";
    const grade  = searchParams.get("grade")?.trim()  || "";

    const where = {
      ...(grade  && { grade }),
      ...(search && {
        OR: [
          { fullName: { contains: search, mode: "insensitive" } },
          { username: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    const students = await prisma.student.findMany({
      where,
      orderBy: [{ grade: "asc" }, { fullName: "asc" }],
      select: { id: true, username: true, fullName: true, grade: true, createdAt: true },
    });
    return NextResponse.json(students);
  } catch (err) {
    console.error("[admin/students GET]", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}

export async function POST(req) {
  if (!(await auth())) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  try {
    const { fullName, username, password, grade } = await req.json();
    if (!fullName || !username || !password || !grade)
      return NextResponse.json({ message: "All fields are required." }, { status: 400 });

    const exists = await prisma.student.findUnique({ where: { username } });
    if (exists) return NextResponse.json({ message: "Username already taken." }, { status: 409 });

    const passwordHash = await bcrypt.hash(password, 12);
    const student = await prisma.student.create({
      data: { fullName, username, passwordHash, grade },
      select: { id: true, username: true, fullName: true, grade: true, createdAt: true },
    });
    return NextResponse.json(student, { status: 201 });
  } catch (err) {
    console.error("[admin/students POST]", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
