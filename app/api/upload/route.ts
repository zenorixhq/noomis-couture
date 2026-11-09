import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import sharp from "sharp";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folderType = (formData.get("folder") as string) || "images";
    const isHeroExplicit = formData.get("isHero") === "true";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const safeFolder = folderType === "videos" ? "videos" : folderType === "images" ? "images" : "screenshots";
    const originalName = file.name || "upload";
    let ext = path.extname(originalName).toLowerCase() || (safeFolder === "videos" ? ".mp4" : ".jpg");
    const cleanBase = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 30);

    const isHero = isHeroExplicit || originalName.toLowerCase().includes("hero") || folderType === "hero";
    const isImage = safeFolder !== "videos" && (file.type?.startsWith("image/") || [".jpg", ".jpeg", ".png", ".webp", ".avif"].includes(ext));

    const bytes = await file.arrayBuffer();
    let buffer = Buffer.from(bytes);
    let mimeType = file.type || "image/jpeg";

    // Maintain low data footprint: Automatically compress all images EXCEPT hero image!
    if (isImage && !isHero) {
      try {
        const compressed = await sharp(buffer)
          .rotate() // Auto-orient based on EXIF
          .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
          .webp({ quality: 80, effort: 4 })
          .toBuffer();

        buffer = compressed;
        mimeType = "image/webp";
        ext = ".webp";
      } catch (sharpErr) {
        console.warn("Sharp image compression fallback to original buffer:", sharpErr);
      }
    }

    const fileName = `${cleanBase}-${Date.now()}${ext}`;

    // 1. If Vercel Blob is configured
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const blob = await put(`uploads/${safeFolder}/${fileName}`, buffer, {
          access: "public",
          contentType: mimeType,
          addRandomSuffix: true,
        });

        return NextResponse.json({
          success: true,
          url: blob.url,
          fileName,
          size: buffer.length,
          provider: "vercel-blob",
        });
      } catch (blobErr: any) {
        console.error("Vercel Blob upload failed, falling back:", blobErr);
      }
    }

    // 2. In local development or writable environments: save to /public/uploads
    try {
      const uploadDir = path.join(process.cwd(), "public", "uploads", safeFolder);
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, buffer);

      const publicUrl = `/uploads/${safeFolder}/${fileName}`;
      return NextResponse.json({
        success: true,
        url: publicUrl,
        fileName,
        size: buffer.length,
        provider: "local-fs",
      });
    } catch (fsErr: any) {
      console.warn("Local filesystem write skipped:", fsErr.message);
    }

    // 3. Fallback for serverless data URLs if under 2MB
    if (safeFolder !== "videos" && buffer.length <= 2 * 1024 * 1024) {
      const dataUrl = `data:${mimeType};base64,${buffer.toString("base64")}`;
      return NextResponse.json({
        success: true,
        url: dataUrl,
        fileName,
        size: buffer.length,
        provider: "data-url",
      });
    }

    // 4. Neon PostgreSQL Database Cloud Media Storage
    try {
      const fileId = `${Date.now()}-${cleanBase}${ext}`;
      const base64Data = buffer.toString("base64");

      await prisma.mediaStorage.upsert({
        where: { id: fileId },
        create: {
          id: fileId,
          fileName,
          mimeType,
          data: base64Data,
          size: buffer.length,
        },
        update: {
          data: base64Data,
          size: buffer.length,
        },
      });

      const publicUrl = `/api/media/${encodeURIComponent(fileId)}`;
      return NextResponse.json({
        success: true,
        url: publicUrl,
        fileName,
        size: buffer.length,
        provider: "database",
      });
    } catch (dbErr: any) {
      console.error("Database media storage fallback failed:", dbErr);
    }

    return NextResponse.json(
      { error: "Image upload failed. Please try again." },
      { status: 400 }
    );
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: err.message || "Failed to upload file" }, { status: 500 });
  }
}
