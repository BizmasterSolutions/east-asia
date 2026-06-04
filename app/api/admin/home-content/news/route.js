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
    const items = await prisma.newsItem.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(items);
  } catch (err) {
    console.error("[news GET]", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}

export async function POST(req) {
  if (!(await auth())) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  try {
    const { title, body } = await req.json();
    if (!title || !body) return NextResponse.json({ message: "title and body are required." }, { status: 400 });
    const item = await prisma.newsItem.create({ data: { title, body } });
    return NextResponse.json(item, { status: 201 });
  } catch (err) {
    console.error("[news POST]", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
