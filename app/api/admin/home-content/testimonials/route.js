import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/prisma";

const HEADING_KEYS = ["testimonial_subtitle", "testimonial_heading"];
const HEADING_DEFAULTS = {
  testimonial_subtitle: "OUR Testimonials",
  testimonial_heading: "We have helped create clients say me.",
};

async function auth() {
  const token = (await cookies()).get("admin_token")?.value;
  return token && (await verifyToken(token));
}

export async function GET() {
  try {
    if (!(await auth())) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    const [items, rows] = await Promise.all([
      prisma.testimonial.findMany({ orderBy: { id: "desc" } }),
      prisma.schoolSetting.findMany({ where: { key: { in: HEADING_KEYS } } }),
    ]);
    const heading = { ...HEADING_DEFAULTS };
    for (const row of rows) heading[row.key] = row.value;
    return NextResponse.json({ heading, items });
  } catch (err) {
    console.error("[home-content/testimonials GET]", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    if (!(await auth())) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    const { name, designation, description, imagePath } = await req.json();
    if (!name || !description) return NextResponse.json({ message: "Name and description are required." }, { status: 400 });
    const item = await prisma.testimonial.create({ data: { name, designation: designation || "", description, imagePath: imagePath || null } });
    return NextResponse.json(item, { status: 201 });
  } catch (err) {
    console.error("[home-content/testimonials POST]", err);
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
    console.error("[home-content/testimonials PUT]", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
