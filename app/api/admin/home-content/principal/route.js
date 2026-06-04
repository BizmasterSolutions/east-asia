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
    const row = await prisma.schoolSetting.findUnique({ where: { key: "principal_welcome" } });
    return NextResponse.json({ content: row?.value ?? "" });
  } catch (err) {
    console.error("[principal GET]", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}

export async function PUT(req) {
  if (!(await auth())) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  try {
    const { content } = await req.json();
    await prisma.schoolSetting.upsert({
      where: { key: "principal_welcome" },
      create: { key: "principal_welcome", value: content ?? "" },
      update: { value: content ?? "" },
    });
    return NextResponse.json({ message: "Saved." });
  } catch (err) {
    console.error("[principal PUT]", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
