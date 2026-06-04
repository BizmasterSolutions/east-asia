import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/prisma";

async function auth() {
  const token = (await cookies()).get("admin_token")?.value;
  if (!token) return false;
  try { return !!(await verifyToken(token)); } catch { return false; }
}

export async function PUT(req, { params }) {
  if (!(await auth())) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  try {
    const id = parseInt(params.id);
    const { caption, sortOrder } = await req.json();
    const slide = await prisma.slideshow.update({
      where: { id },
      data: { caption: caption ?? null, sortOrder: sortOrder ?? 0 },
    });
    return NextResponse.json(slide);
  } catch (err) {
    console.error("[slideshow PUT]", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}

export async function DELETE(_, { params }) {
  if (!(await auth())) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  try {
    const id = parseInt(params.id);
    await prisma.slideshow.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted." });
  } catch (err) {
    console.error("[slideshow DELETE]", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
