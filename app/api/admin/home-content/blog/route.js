import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/prisma";

const HEADING_KEYS = ["blog_subtitle", "blog_heading"];
const HEADING_DEFAULTS = {
  blog_subtitle: "LATEST NEWS & BLOG",
  blog_heading: "Our latest Blog And News.",
};

async function auth() {
  const token = (await cookies()).get("admin_token")?.value;
  return token && (await verifyToken(token));
}

function toSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function GET() {
  try {
    if (!(await auth())) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    const [items, rows] = await Promise.all([
      prisma.blogPost.findMany({ orderBy: { publishedAt: "desc" } }),
      prisma.schoolSetting.findMany({ where: { key: { in: HEADING_KEYS } } }),
    ]);
    const heading = { ...HEADING_DEFAULTS };
    for (const row of rows) heading[row.key] = row.value;
    return NextResponse.json({ heading, items });
  } catch (err) {
    console.error("[home-content/blog GET]", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    if (!(await auth())) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    const { title, slug, category, categoryColor, description, imagePath, author } = await req.json();
    if (!title || !category || !description) return NextResponse.json({ message: "Title, category and description are required." }, { status: 400 });
    const finalSlug = slug || toSlug(title);
    const item = await prisma.blogPost.create({
      data: { title, slug: finalSlug, category, categoryColor: categoryColor || "light_blue", description, imagePath: imagePath || null, author: author || null },
    });
    return NextResponse.json(item, { status: 201 });
  } catch (err) {
    if (err.code === "P2002") return NextResponse.json({ message: "A post with this slug already exists." }, { status: 409 });
    console.error("[home-content/blog POST]", err);
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
    console.error("[home-content/blog PUT]", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
