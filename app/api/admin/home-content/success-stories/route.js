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
    const stories = await prisma.successStory.findMany({ orderBy: { id: "desc" } });
    return NextResponse.json(stories);
  } catch (err) {
    console.error("[stories GET]", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}

export async function POST(req) {
  if (!(await auth())) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  try {
    const { studentName, description, imagePath } = await req.json();
    if (!studentName || !description) {
      return NextResponse.json({ message: "studentName and description are required." }, { status: 400 });
    }
    const story = await prisma.successStory.create({
      data: { studentName, description, imagePath: imagePath || null },
    });
    return NextResponse.json(story, { status: 201 });
  } catch (err) {
    console.error("[stories POST]", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
