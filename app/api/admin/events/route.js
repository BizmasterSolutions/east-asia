import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/prisma";

async function auth() {
  const token = (await cookies()).get("admin_token")?.value;
  if (!token) return false;
  try { return !!(await verifyToken(token)); } catch { return false; }
}

function makeSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now();
}

export async function GET() {
  if (!(await auth())) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  try {
    const events = await prisma.event.findMany({ orderBy: { eventDate: "asc" } });
    return NextResponse.json(events);
  } catch (err) {
    console.error("[admin events GET]", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}

export async function POST(req) {
  if (!(await auth())) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  try {
    const { title, description, eventDate, category, location, time, organizerName, color, imagePath } = await req.json();
    if (!title || !eventDate) return NextResponse.json({ message: "Title and date are required." }, { status: 400 });
    const event = await prisma.event.create({
      data: {
        title,
        description: description || null,
        eventDate: new Date(eventDate),
        category: category || "School",
        location: location || "",
        time: time || "",
        organizerName: organizerName || null,
        color: color || "blue",
        imagePath: imagePath || null,
        slug: makeSlug(title),
      },
    });
    return NextResponse.json(event, { status: 201 });
  } catch (err) {
    console.error("[admin events POST]", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
