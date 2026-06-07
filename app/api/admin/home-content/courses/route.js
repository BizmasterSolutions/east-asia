import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/prisma";

const HEADING_KEYS = ["courses_subtitle", "courses_heading"];
const HEADING_DEFAULTS = {
  courses_subtitle: "OUR Working now",
  courses_heading: "Complete About Students Advance Course.",
};

async function auth() {
  const token = (await cookies()).get("admin_token")?.value;
  return token && (await verifyToken(token));
}

export async function GET() {
  try {
    if (!(await auth())) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    const [items, rows] = await Promise.all([
      prisma.courseWork.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.schoolSetting.findMany({ where: { key: { in: HEADING_KEYS } } }),
    ]);
    const heading = { ...HEADING_DEFAULTS };
    for (const row of rows) heading[row.key] = row.value;
    return NextResponse.json({ heading, items });
  } catch (err) {
    console.error("[home-content/courses GET]", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    if (!(await auth())) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    const body = await req.json();
    const { title, desc, imagePath, color, sortOrder, courses_subtitle, courses_heading } = body;
    if (!title || !desc) return NextResponse.json({ message: "Title and description are required." }, { status: 400 });

    const [item] = await Promise.all([
      prisma.courseWork.create({ data: { title, desc, imagePath: imagePath || null, color: color || "orange", sortOrder: sortOrder ?? 0 } }),
      ...[
        courses_subtitle !== undefined ? prisma.schoolSetting.upsert({ where: { key: "courses_subtitle" }, create: { key: "courses_subtitle", value: courses_subtitle }, update: { value: courses_subtitle } }) : null,
        courses_heading !== undefined ? prisma.schoolSetting.upsert({ where: { key: "courses_heading" }, create: { key: "courses_heading", value: courses_heading }, update: { value: courses_heading } }) : null,
      ].filter(Boolean),
    ]);

    return NextResponse.json(item, { status: 201 });
  } catch (err) {
    console.error("[home-content/courses POST]", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    if (!(await auth())) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    const body = await req.json();
    const updates = HEADING_KEYS.filter((k) => body[k] !== undefined).map((k) =>
      prisma.schoolSetting.upsert({ where: { key: k }, create: { key: k, value: body[k] }, update: { value: body[k] } })
    );
    await Promise.all(updates);
    return NextResponse.json({ message: "Heading updated." });
  } catch (err) {
    console.error("[home-content/courses PUT]", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
