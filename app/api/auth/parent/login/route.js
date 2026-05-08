import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { signToken } from "@/lib/auth";

export async function POST(req) {
  try {
    const { username, password } = await req.json();
    if (!username || !password)
      return NextResponse.json({ message: "Username and password are required." }, { status: 400 });

    const parent = await prisma.parent.findUnique({ where: { username } });
    if (!parent || !(await bcrypt.compare(password, parent.passwordHash)))
      return NextResponse.json({ message: "Invalid credentials." }, { status: 401 });

    const token = await signToken({ id: parent.id, username: parent.username, fullName: parent.fullName, role: "parent" });

    const response = NextResponse.json({ message: "Login successful." }, { status: 200 });
    response.cookies.set("parent_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch (err) {
    console.error("[parent/login]", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
