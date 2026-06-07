import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/prisma";

async function auth() {
  const token = (await cookies()).get("admin_token")?.value;
  if (!token) return false;
  try { return !!(await verifyToken(token)); } catch { return false; }
}

export async function GET(_, { params }) {
  if (!(await auth())) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  try {
    const event = await prisma.event.findUnique({ where: { id: parseInt(params.id) } });
    if (!event) return NextResponse.json({ message: "Not found." }, { status: 404 });
    return NextResponse.json(event);
  } catch (err) {
    console.error("[admin events GET id]", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  if (!(await auth())) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  try {
    const id = parseInt(params.id);
    const { title, description, eventDate, category, location, time, organizerName, color, imagePath } = await req.json();
    if (!title || !eventDate) return NextResponse.json({ message: "Title and date are required." }, { status: 400 });
    const event = await prisma.event.update({
      where: { id },
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
      },
    });
    return NextResponse.json(event);
  } catch (err) {
    console.error("[admin events PUT]", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}

export async function DELETE(_, { params }) {
  if (!(await auth())) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  try {
    await prisma.event.delete({ where: { id: parseInt(params.id) } });
    return NextResponse.json({ message: "Deleted." });
  } catch (err) {
    console.error("[admin events DELETE]", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
