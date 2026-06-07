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
    const videos = await prisma.galleryVideo.findMany({ orderBy: { id: "desc" } });
    return NextResponse.json(videos);
  } catch (err) {
    console.error("[gallery videos GET]", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}

export async function POST(req) {
  if (!(await auth())) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  try {
    const { youtubeUrl, title } = await req.json();
    if (!youtubeUrl) return NextResponse.json({ message: "youtubeUrl is required." }, { status: 400 });
    if (!title) return NextResponse.json({ message: "title is required." }, { status: 400 });
    const video = await prisma.galleryVideo.create({ data: { youtubeUrl, title } });
    return NextResponse.json(video, { status: 201 });
  } catch (err) {
    console.error("[gallery videos POST]", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
