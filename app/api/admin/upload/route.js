import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { unlink, access } from "fs/promises";
import path from "path";
import { utapi, extractUploadThingKey } from "@/lib/uploadthing";

const ALLOWED_EXT = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

async function fileExists(filePath) {
  try { await access(filePath); return true; } catch { return false; }
}

async function deleteOldFile(oldUrl) {
  if (!oldUrl) return;

  if (String(oldUrl).startsWith("/uploads/")) {
    try {
      const abs = path.join(process.cwd(), "public", oldUrl);
      if (await fileExists(abs)) {
        await unlink(abs);
        console.log("[upload] Deleted old file:", oldUrl);
      }
    } catch (e) {
      console.error("[upload] Could not delete old file:", e.message);
    }
    return;
  }

  const key = extractUploadThingKey(oldUrl);
  if (key) {
    try {
      await utapi.deleteFiles(key);
    } catch (e) {
      console.error("[upload] Could not delete old UploadThing file:", e.message);
    }
  }
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
      return NextResponse.json({ message: "File too large. Max size is 5 MB." }, { status: 400 });
    }

    const ext = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXT.includes(ext)) {
      return NextResponse.json({ message: "Only image files are allowed (jpg, png, webp, gif, avif)." }, { status: 400 });
    }

    const { data, error } = await utapi.uploadFiles(file);
    if (error) {
      console.error("[upload] UploadThing error:", error);
      return NextResponse.json({ message: "Upload failed." }, { status: 500 });
    }

    // Delete the old image only after the new one is uploaded successfully
    if (oldUrl) await deleteOldFile(oldUrl);

    return NextResponse.json({ url: data.ufsUrl });
  } catch (err) {
    console.error("[upload]", err);
    return NextResponse.json({ message: "Upload failed." }, { status: 500 });
  }
}
