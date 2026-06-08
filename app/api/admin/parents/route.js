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
    const filter = searchParams.get("filter")?.trim() || ""; // "linked" | "unlinked"

    const where = {
      ...(search && {
        OR: [
          { fullName: { contains: search, mode: "insensitive" } },
          { username: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    const parents = await prisma.parent.findMany({
      where,
      orderBy: { fullName: "asc" },
      select: {
        id: true, username: true, fullName: true, createdAt: true,
        children: {
          select: {
            student: { select: { id: true, fullName: true, grade: true } },
          },
        },
      },
    });

    const mapped = parents.map(p => ({
      ...p,
      children: p.children.map(c => c.student),
    }));

    const result =
      filter === "linked"   ? mapped.filter(p => p.children.length > 0) :
      filter === "unlinked" ? mapped.filter(p => p.children.length === 0) :
      mapped;

    return NextResponse.json(result);
  } catch (err) {
    console.error("[admin/parents GET]", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}

export async function POST(req) {
  if (!(await auth())) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  try {
    const { fullName, username, password } = await req.json();
    if (!fullName || !username || !password)
      return NextResponse.json({ message: "All fields are required." }, { status: 400 });

    const exists = await prisma.parent.findUnique({ where: { username } });
    if (exists) return NextResponse.json({ message: "Username already taken." }, { status: 409 });

    const passwordHash = await bcrypt.hash(password, 12);
    const parent = await prisma.parent.create({
      data: { fullName, username, passwordHash },
      select: { id: true, username: true, fullName: true, createdAt: true },
    });
    return NextResponse.json({ ...parent, children: [] }, { status: 201 });
  } catch (err) {
    console.error("[admin/parents POST]", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
