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
    const { title, body } = await req.json();
    const item = await prisma.newsItem.update({ where: { id }, data: { title, body } });
    return NextResponse.json(item);
  } catch (err) {
    console.error("[news PUT]", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}

export async function DELETE(_, { params }) {
  if (!(await auth())) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  try {
    await prisma.newsItem.delete({ where: { id: parseInt(params.id) } });
    return NextResponse.json({ message: "Deleted." });
  } catch (err) {
    console.error("[news DELETE]", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
