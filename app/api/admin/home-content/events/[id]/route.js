import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { deleteUploadThingFileByUrl } from "@/lib/uploadthing";

async function auth() {
  const token = (await cookies()).get("admin_token")?.value;
  if (!token) return false;
  try { return !!(await verifyToken(token)); } catch { return false; }
}

export async function PUT(req, { params }) {
  if (!(await auth())) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  try {
    const id = parseInt(params.id);
    const { title, description, eventDate } = await req.json();
    const event = await prisma.event.update({
      where: { id },
      data: { title, description: description || null, eventDate: new Date(eventDate) },
    });
    return NextResponse.json(event);
  } catch (err) {
    console.error("[events PUT]", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}

export async function DELETE(_, { params }) {
  if (!(await auth())) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  try {
    const deleted = await prisma.event.delete({ where: { id: parseInt(params.id) } });
    await deleteUploadThingFileByUrl(deleted.imagePath);
    return NextResponse.json({ message: "Deleted." });
  } catch (err) {
    console.error("[events DELETE]", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
