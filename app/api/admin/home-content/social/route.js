import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/prisma";

const SOCIAL_KEYS = ["social_facebook", "social_instagram", "social_twitter", "social_youtube", "social_linkedin"];

async function auth() {
  const token = (await cookies()).get("admin_token")?.value;
  if (!token) return false;
  try { return !!(await verifyToken(token)); } catch { return false; }
}

export async function GET() {
  if (!(await auth())) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  try {
    const rows = await prisma.schoolSetting.findMany({ where: { key: { in: SOCIAL_KEYS } } });
    const data = Object.fromEntries(SOCIAL_KEYS.map((k) => [k, ""]));
    for (const row of rows) data[row.key] = row.value;
    return NextResponse.json(data);
  } catch (err) {
    console.error("[social GET]", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}

export async function PUT(req) {
  if (!(await auth())) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  try {
    const body = await req.json();
    await Promise.all(
      SOCIAL_KEYS.filter((k) => body[k] !== undefined).map((k) =>
        prisma.schoolSetting.upsert({
          where: { key: k },
          create: { key: k, value: body[k] },
          update: { value: body[k] },
        })
      )
    );
    return NextResponse.json({ message: "Social links saved." });
  } catch (err) {
    console.error("[social PUT]", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
