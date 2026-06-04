import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/prisma";

const HERO_KEYS = [
  "hero_subtitle",
  "hero_heading",
  "hero_heading_highlight",
  "hero_description",
  "hero_cta_text",
  "hero_cta_link",
  "hero_bg_image",
];

export const HERO_DEFAULTS = {
  hero_subtitle: "Welcome to East Asian!",
  hero_heading: "Students for a Brighter Future.",
  hero_heading_highlight: "Brighter",
  hero_description:
    "East Asian International School provides a nurturing environment where students grow academically and personally.",
  hero_cta_text: "Read More",
  hero_cta_link: "/about",
  hero_bg_image: "",
};

export async function GET() {
  try {
    const token = (await cookies()).get("admin_token")?.value;
    if (!token || !(await verifyToken(token))) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const rows = await prisma.schoolSetting.findMany({
      where: { key: { in: HERO_KEYS } },
    });

    const data = { ...HERO_DEFAULTS };
    for (const row of rows) data[row.key] = row.value;

    return NextResponse.json(data);
  } catch (err) {
    console.error("[home-content/hero GET]", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const token = (await cookies()).get("admin_token")?.value;
    if (!token || !(await verifyToken(token))) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();

    await Promise.all(
      HERO_KEYS.filter((key) => body[key] !== undefined).map((key) =>
        prisma.schoolSetting.upsert({
          where: { key },
          create: { key, value: String(body[key]) },
          update: { value: String(body[key]) },
        })
      )
    );

    return NextResponse.json({ message: "Hero content updated successfully." });
  } catch (err) {
    console.error("[home-content/hero PUT]", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
