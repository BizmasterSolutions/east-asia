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

export async function DELETE(_, { params }) {
  if (!(await auth())) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  try {
    const deleted = await prisma.downloadableFile.delete({ where: { id: parseInt(params.id) } });
    await deleteUploadThingFileByUrl(deleted.filePath);
    return NextResponse.json({ message: "Deleted." });
  } catch (err) {
    console.error("[admin downloads DELETE]", err);
    return NextResponse.json({ message: err?.message || "Internal server error." }, { status: 500 });
  }
}
