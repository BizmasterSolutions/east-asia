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
    const slides = await prisma.slideshow.findMany({ orderBy: { sortOrder: "asc" } });
    return NextResponse.json(slides);
  } catch (err) {
    console.error("[slideshow GET]", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}

export async function POST(req) {
  if (!(await auth())) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  try {
    const { imagePath, caption, sortOrder } = await req.json();
    if (!imagePath) return NextResponse.json({ message: "imagePath is required." }, { status: 400 });
    const slide = await prisma.slideshow.create({
      data: { imagePath, caption: caption || null, sortOrder: sortOrder ?? 0 },
    });
    return NextResponse.json(slide, { status: 201 });
  } catch (err) {
    console.error("[slideshow POST]", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
