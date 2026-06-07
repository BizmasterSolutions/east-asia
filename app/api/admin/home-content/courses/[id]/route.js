import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/prisma";

async function auth() {
  const token = (await cookies()).get("admin_token")?.value;
  return token && (await verifyToken(token));
}

export async function PUT(req, { params }) {
  try {
    if (!(await auth())) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    const id = parseInt(params.id);
    const body = await req.json();
    const { title, desc, imagePath, color, sortOrder } = body;
    const item = await prisma.courseWork.update({
      where: { id },
      data: { title, desc, imagePath: imagePath ?? undefined, color: color ?? undefined, sortOrder: sortOrder ?? undefined },
    });
    return NextResponse.json(item);
  } catch (err) {
    console.error("[home-content/courses/[id] PUT]", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    if (!(await auth())) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    const id = parseInt(params.id);
    await prisma.courseWork.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted." });
  } catch (err) {
    console.error("[home-content/courses/[id] DELETE]", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
