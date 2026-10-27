import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { getCurrentUser } from "@/lib/auth";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { error: "Unauthorized: authentication required to upload evidence" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No image file provided in upload" },
        { status: 400 }
      );
    }

    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: `Invalid file type (${file.type}). Allowed types: JPG, PNG, WEBP.`,
        },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds maximum limit of 5MB.`,
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Validate magic bytes to prevent file disguise attacks
    const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8;
    const isPng =
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47;
    const isWebp =
      buffer.toString("utf8", 0, 4) === "RIFF" &&
      buffer.toString("utf8", 8, 12) === "WEBP";

    if (!isJpeg && !isPng && !isWebp) {
      return NextResponse.json(
        { error: "Corrupted or invalid image payload rejected." },
        { status: 400 }
      );
    }

    // Determine extension
    let extension = "jpg";
    if (isPng) extension = "png";
    if (isWebp) extension = "webp";

    const uniqueId = crypto.randomBytes(12).toString("hex");
    const filename = `civic-${Date.now()}-${uniqueId}.${extension}`;

    let publicUrl = "";

    // Upload to Vercel Blob if configured, else fall back to local disk
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { put } = await import("@vercel/blob");
      const blob = await put(`evidence/${filename}`, buffer, {
        access: "public",
        contentType: file.type,
      });
      publicUrl = blob.url;
    } else {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadDir, { recursive: true });
      const filePath = path.join(uploadDir, filename);
      await writeFile(filePath, buffer);
      publicUrl = `/uploads/${filename}`;
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
      sizeBytes: file.size,
      mimeType: file.type,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error during evidence upload" },
      { status: 500 }
    );
  }
}
