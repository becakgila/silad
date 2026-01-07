"use server";

import { writeFile, mkdir } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";
import * as XLSX from "xlsx";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

export async function uploadFile(files: File | null) {
  const file = files;

  // VALIDASI
  if (!file) return { error: "Tidak ada file yang diupload." };

  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  if (file.size > MAX_SIZE) return { error: "Maksimal ukuran file 5 MB." };

  const allowedTypes = [
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

  const workbook = XLSX.read(buffer);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet);
  const allowedHeaders = [
    "NIM",
    "NAMA",
    "NIK",
    "EMAIL",
    "NO TELEPON",
    "JENIS KELAMIN",
    "ANGKATAN",
    "JALUR MASUK",
    "TEMPAT LAHIR",
    "TANGGAL LAHIR",
    "AGAMA",
    "PRODI ID",
    "ALAMAT",
    "PRODI ID",
    "PROVINSI",
    "KOTA",
    "KECAMATAN"
  ];    // Hanya ambil kolom yang sesuai header
  const filtered = rows.map((row: any) => {
    const obj: any = {};
    allowedHeaders.forEach((h) => {
      obj[h] = row[h] ?? null; // aman jika header tidak ditemukan
    });
    return obj;
  });

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
  // console.log(filtered);
  return {
    success: true,
    message: "Upload berhasil dan metadata tersimpan!",
    totalRows: filtered.length,
    data: filtered,   // file: saved,
  };
}
