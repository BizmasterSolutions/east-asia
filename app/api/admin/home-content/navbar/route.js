import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/prisma";

const NAVBAR_KEYS = ["navbar_bg_color", "navbar_text_color", "navbar_link_color"];

const NAVBAR_DEFAULTS = {
  navbar_bg_color: "#ffffff",
  navbar_text_color: "#222222",
  navbar_link_color: "#222222",
};

export async function GET() {
  try {
    const token = (await cookies()).get("admin_token")?.value;
    if (!token || !(await verifyToken(token))) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const rows = await prisma.schoolSetting.findMany({
      where: { key: { in: NAVBAR_KEYS } },
    });

    const data = { ...NAVBAR_DEFAULTS };
    for (const row of rows) data[row.key] = row.value;

    return NextResponse.json(data);
  } catch (err) {
    console.error("[home-content/navbar GET]", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const token = (await cookies()).get("admin_token")?.value;
    if (!token || !(await verifyToken(token))) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();

    await Promise.all(
      NAVBAR_KEYS.filter((key) => body[key] !== undefined).map((key) =>
        prisma.schoolSetting.upsert({
          where: { key },
          create: { key, value: String(body[key]) },
          update: { value: String(body[key]) },
        })
      )
    );

    return NextResponse.json({ message: "Navbar settings updated successfully." });
  } catch (err) {
    console.error("[home-content/navbar PUT]", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
