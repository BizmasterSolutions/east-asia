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
    const { title, slug, category, categoryColor, description, imagePath, author } = await req.json();
    const item = await prisma.blogPost.update({
      where: { id },
      data: { title, slug, category, categoryColor, description, imagePath: imagePath ?? undefined, author: author ?? undefined },
    });
    return NextResponse.json(item);
  } catch (err) {
    if (err.code === "P2002") return NextResponse.json({ message: "A post with this slug already exists." }, { status: 409 });
    console.error("[home-content/blog/[id] PUT]", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    if (!(await auth())) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    const id = parseInt(params.id);
    await prisma.blogPost.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted." });
  } catch (err) {
    console.error("[home-content/blog/[id] DELETE]", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
