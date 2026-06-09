import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { writeFile, mkdir, unlink, access } from "fs/promises";
import path from "path";

const ALLOWED_EXT = [".pdf", ".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"];
const MAX_SIZE = 20 * 1024 * 1024; // 20 MB
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

async function fileExists(p) {
  try { await access(p); return true; } catch { return false; }
}

export async function POST(req) {
  try {
    const token = (await cookies()).get("admin_token")?.value;
    if (!token || !(await verifyToken(token))) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file");
    const oldUrl = formData.get("oldUrl") || null;

    if (!file || typeof file === "string") {
      return NextResponse.json({ message: "No file provided." }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ message: "File too large. Max 20 MB." }, { status: 400 });
    }

    const ext = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXT.includes(ext)) {
      return NextResponse.json({ message: "Allowed types: PDF, JPG, PNG, WEBP, GIF, AVIF." }, { status: 400 });
    }

    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    await mkdir(UPLOAD_DIR, { recursive: true });
    await writeFile(path.join(UPLOAD_DIR, filename), Buffer.from(await file.arrayBuffer()));

    if (oldUrl && String(oldUrl).startsWith("/uploads/")) {
      const abs = path.join(process.cwd(), "public", oldUrl);
      if (await fileExists(abs)) await unlink(abs);
    }

    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (err) {
    console.error("[upload-file]", err);
    return NextResponse.json({ message: "Upload failed." }, { status: 500 });
  }
}
