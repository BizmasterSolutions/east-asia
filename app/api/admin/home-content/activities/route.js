import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/prisma";

const ACTIVITY_KEYS = [
  "activity_subtitle",
  "activity_heading",
  "activity_description",
  "activity_img",
  "activity_items",
];

export const ACTIVITY_DEFAULTS = {
  activity_subtitle: "OUR Best ACTIVITIES",
  activity_heading: "We School Be Happy With Our Activities.",
  activity_description: "Business tailored it design, management & support services business agency elit, sed do eiusmod tempor.",
  activity_img: "Untitled design.png",
  activity_items: JSON.stringify([
    { icon: "fa fa-book", title: "Parenting Bill", color: "light_blue" },
    { icon: "fa fa-graduation-cap", title: "Engineering", color: "green" },
    { icon: "fa fa-university", title: "Sports Training", color: "orange" },
    { icon: "fa fa-book-medical", title: "School Directly", color: "blue" },
  ]),
};

async function auth() {
  const token = (await cookies()).get("admin_token")?.value;
  return token && (await verifyToken(token));
}

export async function GET() {
  try {
    if (!(await auth())) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    const rows = await prisma.schoolSetting.findMany({ where: { key: { in: ACTIVITY_KEYS } } });
    const data = { ...ACTIVITY_DEFAULTS };
    for (const row of rows) data[row.key] = row.value;
    return NextResponse.json(data);
  } catch (err) {
    console.error("[home-content/activities GET]", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    if (!(await auth())) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    const body = await req.json();
    await Promise.all(
      ACTIVITY_KEYS.filter((k) => body[k] !== undefined).map((k) =>
        prisma.schoolSetting.upsert({
          where: { key: k },
          create: { key: k, value: String(body[k]) },
          update: { value: String(body[k]) },
        })
      )
    );
    return NextResponse.json({ message: "Activities section updated." });
  } catch (err) {
    console.error("[home-content/activities PUT]", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
