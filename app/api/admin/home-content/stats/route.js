import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/prisma";

const STATS_KEYS = ["stats_students", "stats_years", "stats_programmes"];

async function auth() {
  const token = (await cookies()).get("admin_token")?.value;
  if (!token) return false;
  try { return !!(await verifyToken(token)); } catch { return false; }
}

export async function GET() {
  if (!(await auth())) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  try {
    const rows = await prisma.schoolSetting.findMany({ where: { key: { in: STATS_KEYS } } });
    const data = { stats_students: "", stats_years: "", stats_programmes: "" };
    for (const row of rows) data[row.key] = row.value;
    return NextResponse.json(data);
  } catch (err) {
    console.error("[stats GET]", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}

export async function PUT(req) {
  if (!(await auth())) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  try {
    const body = await req.json();
    await Promise.all(
      STATS_KEYS.filter((k) => body[k] !== undefined).map((k) =>
        prisma.schoolSetting.upsert({
          where: { key: k },
          create: { key: k, value: String(body[k]) },
          update: { value: String(body[k]) },
        })
      )
    );
    return NextResponse.json({ message: "Stats saved." });
  } catch (err) {
    console.error("[stats PUT]", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
