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
    const announcements = await prisma.announcement.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(announcements);
  } catch (err) {
    console.error("[admin announcements GET]", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}

export async function POST(req) {
  if (!(await auth())) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  try {
    const { title, body, target } = await req.json();
    if (!title || !body) return NextResponse.json({ message: "Title and body are required." }, { status: 400 });
    const announcement = await prisma.announcement.create({
      data: { title, body, target: target || "all" },
    });
    return NextResponse.json(announcement, { status: 201 });
  } catch (err) {
    console.error("[admin announcements POST]", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
