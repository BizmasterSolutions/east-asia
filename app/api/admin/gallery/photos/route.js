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
    const photos = await prisma.galleryPhoto.findMany({ orderBy: { uploadedAt: "desc" } });
    return NextResponse.json(photos);
  } catch (err) {
    console.error("[gallery photos GET]", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}

export async function POST(req) {
  if (!(await auth())) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  try {
    const { imagePath, category } = await req.json();
    if (!imagePath) return NextResponse.json({ message: "imagePath is required." }, { status: 400 });
    if (!category) return NextResponse.json({ message: "category is required." }, { status: 400 });
    const photo = await prisma.galleryPhoto.create({ data: { imagePath, category } });
    return NextResponse.json(photo, { status: 201 });
  } catch (err) {
    console.error("[gallery photos POST]", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
