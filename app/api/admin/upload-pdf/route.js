import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { unlink, access } from "fs/promises";
import path from "path";
import { utapi, extractUploadThingKey } from "@/lib/uploadthing";

const MAX_SIZE = 20 * 1024 * 1024; // 20 MB

async function fileExists(filePath) {
  try { await access(filePath); return true; } catch { return false; }
}

async function deleteOldFile(oldUrl) {
  if (!oldUrl) return;

  if (String(oldUrl).startsWith("/uploads/")) {
    try {
      const abs = path.join(process.cwd(), "public", oldUrl);
      if (await fileExists(abs)) await unlink(abs);
    } catch (e) {
      console.error("[upload-pdf] Could not delete old file:", e.message);
    }
    return;
  }

  const key = extractUploadThingKey(oldUrl);
  if (key) {
    try {
      await utapi.deleteFiles(key);
    } catch (e) {
      console.error("[upload-pdf] Could not delete old UploadThing file:", e.message);
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
      return NextResponse.json({ message: "File too large. Max size is 20 MB." }, { status: 400 });
    }

    const ext = path.extname(file.name).toLowerCase();
    if (ext !== ".pdf") {
      return NextResponse.json({ message: "Only PDF files are allowed." }, { status: 400 });
    }

    const { data, error } = await utapi.uploadFiles(file);
    if (error) {
      console.error("[upload-pdf] UploadThing error:", error);
      return NextResponse.json({ message: "Upload failed." }, { status: 500 });
    }

    if (oldUrl) await deleteOldFile(oldUrl);

    return NextResponse.json({ url: data.ufsUrl });
  } catch (err) {
    console.error("[upload-pdf]", err);
    return NextResponse.json({ message: "Upload failed." }, { status: 500 });
  }
}
