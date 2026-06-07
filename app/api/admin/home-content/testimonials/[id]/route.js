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
    const { name, designation, description, imagePath } = await req.json();
    const item = await prisma.testimonial.update({
      where: { id },
      data: { name, designation, description, imagePath: imagePath ?? undefined },
    });
    return NextResponse.json(item);
  } catch (err) {
    console.error("[home-content/testimonials/[id] PUT]", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    if (!(await auth())) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    const id = parseInt(params.id);
    await prisma.testimonial.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted." });
  } catch (err) {
    console.error("[home-content/testimonials/[id] DELETE]", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
