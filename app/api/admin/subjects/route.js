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
    const subjects = await prisma.subject.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json(subjects);
  } catch (err) {
    console.error("[admin subjects GET]", err);
    return NextResponse.json({ message: err?.message || "Internal server error." }, { status: 500 });
  }
}

export async function POST(req) {
  if (!(await auth())) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  try {
    const { name } = await req.json();
    if (!name?.trim()) return NextResponse.json({ message: "Subject name is required." }, { status: 400 });
    const existing = await prisma.subject.findUnique({ where: { name: name.trim() } });
    if (existing) return NextResponse.json(existing);
    const subject = await prisma.subject.create({ data: { name: name.trim() } });
    return NextResponse.json(subject, { status: 201 });
  } catch (err) {
    console.error("[admin subjects POST]", err);
    return NextResponse.json({ message: err?.message || "Internal server error." }, { status: 500 });
  }
}
