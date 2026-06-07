import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/prisma";

const ABOUT_KEYS = [
  "about_subtitle",
  "about_heading",
  "about_description",
  "about_bullets",
  "about_cta_link",
  "about_main_img",
  "about_top_img",
  "about_top_heading",
  "about_top_description",
  "about_stat_number",
  "about_stat_label",
];

export const ABOUT_DEFAULTS = {
  about_subtitle: "OUR About Us",
  about_heading: "District is Made of about Students Childhood.",
  about_description: "Business tailored it design, management & support services business agency elit, sed do eiusmod tempor.",
  about_bullets: JSON.stringify([
    "Business school's Institut constructivism.",
    "We give management school best.",
    "Media in this school solution.",
    "Business school's Institut constructivism.",
    "We give management school best.",
  ]),
  about_cta_link: "/about",
  about_main_img: "images/about_img.png",
  about_top_img: "images/about_top_img.jpg",
  about_top_heading: "Study Off Flexibly",
  about_top_description: "We can provide you with a reliable handyan in Please input an email address down below school.",
  about_stat_number: "183k+",
  about_stat_label: "Complete Projects",
};

async function auth() {
  const token = (await cookies()).get("admin_token")?.value;
  return token && (await verifyToken(token));
}

export async function GET() {
  try {
    if (!(await auth())) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    const rows = await prisma.schoolSetting.findMany({ where: { key: { in: ABOUT_KEYS } } });
    const data = { ...ABOUT_DEFAULTS };
    for (const row of rows) data[row.key] = row.value;
    return NextResponse.json(data);
  } catch (err) {
    console.error("[home-content/about GET]", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    if (!(await auth())) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    const body = await req.json();
    await Promise.all(
      ABOUT_KEYS.filter((k) => body[k] !== undefined).map((k) =>
        prisma.schoolSetting.upsert({
          where: { key: k },
          create: { key: k, value: String(body[k]) },
          update: { value: String(body[k]) },
        })
      )
    );
    return NextResponse.json({ message: "About section updated successfully." });
  } catch (err) {
    console.error("[home-content/about PUT]", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
