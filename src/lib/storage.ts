import { put } from "@vercel/blob";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

function safeFileName(input: string) {
  return input.replace(/[^a-zA-Z0-9._-]/g, "-");
}

export async function saveUpload(file: File, folder: string): Promise<{ url: string; key: string }> {
  const name = `${randomUUID()}-${safeFileName(file.name)}`;
  const key = `${folder}/${name}`;

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
