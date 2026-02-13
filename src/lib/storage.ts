import { put, del } from "@vercel/blob";
import { mkdir, writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

function safeFileName(input: string) {
  return input.replace(/[^a-zA-Z0-9._-]/g, "-");
}

export async function saveUpload(file: File, folder: string): Promise<{ url: string; key: string }> {
  const name = `${randomUUID()}-${safeFileName(file.name)}`;
  const key = `${folder}/${name}`;

  // In production, we strictly require Vercel Blob.
  if (process.env.NODE_ENV === "production") {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      throw new Error("Server configuration error: Missing blob storage token.");
    }
    const blob = await put(key, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    return { url: blob.url, key };
  }

  // In development, we can try Vercel Blob if token is present, otherwise fallback to local.
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(key, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    return { url: blob.url, key };
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, name), bytes);
  return { url: `/uploads/${folder}/${name}`, key };
}

export async function deleteUpload(url: string) {
  // If use provided a generic Vercel Blob URL
  if (url.startsWith("https") && process.env.BLOB_READ_WRITE_TOKEN) {
    await del(url, { token: process.env.BLOB_READ_WRITE_TOKEN });
    return;
  }

  // Local fallback
  if (url.startsWith("/uploads/")) {
    const filePath = path.join(process.cwd(), "public", url);
    try {
      await unlink(filePath);
    } catch (e) {
      console.warn("Failed to delete local file:", filePath);
    }
  }
}
