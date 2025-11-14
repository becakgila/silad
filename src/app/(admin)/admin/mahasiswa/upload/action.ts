"use server";

import { writeFile, mkdir } from "fs/promises";
import path from "path";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

export async function uploadFile(files: File | null) {
  const file = files;

  // VALIDASI
  if (!file) return { error: "Tidak ada file yang diupload." };

  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  if (file.size > MAX_SIZE) return { error: "Maksimal ukuran file 5 MB." };

  const allowedTypes = [
    "application/pdf",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/csv"
  ];

  if (!allowedTypes.includes(file.type)) {
    return { error: "File harus PDF, Excel, atau CSV." };
  }

  // Convert File → Buffer
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Pastikan folder upload ada
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  // Rename file → timestamp.ext
  const ext = file.name.split(".").pop();
  const timestamp = Date.now();
  const storedName = `${timestamp}.${ext}`;

  const filePath = path.join(uploadDir, storedName);

  // Simpan file ke folder lokal
  await writeFile(filePath, buffer);

  // URL yang bisa diakses
  const url = `/uploads/${storedName}`;

  // SIMPAN META-DATA KE DATABASE
//   const saved = await prisma.uploadFile.create({
//     data: {
//       originalName: file.name,
//       storedName,
//       mimeType: file.type,
//       size: file.size,
//       url,
//     },
//   });

  return {
    success: true,
    message: "Upload berhasil dan metadata tersimpan!",
    // file: saved,
  };
}
