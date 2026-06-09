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
    const items = await prisma.downloadableFile.findMany({ orderBy: { uploadedAt: "desc" } });
    return NextResponse.json(items);
  } catch (err) {
    console.error("[admin downloads GET]", err);
    return NextResponse.json({ message: err?.message || "Internal server error." }, { status: 500 });
  }
}

export async function POST(req) {
  if (!(await auth())) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  try {
    const { title, grade, category, filePath } = await req.json();
    if (!title || !grade || !category || !filePath) {
      return NextResponse.json({ message: "Title, grade, category and file are required." }, { status: 400 });
    }
    const item = await prisma.downloadableFile.create({
      data: { title, grade, category, filePath },
    });
    return NextResponse.json(item, { status: 201 });
  } catch (err) {
    console.error("[admin downloads POST]", err);
    return NextResponse.json({ message: err?.message || "Internal server error." }, { status: 500 });
  }
}
