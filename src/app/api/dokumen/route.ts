import prisma from '@/lib/prisma'
import { NextRequest } from 'next/server';
import fs from 'node:fs'
import path from 'node:path'

export async function GET(request: NextRequest){

    const { searchParams } = new URL(request.url);

    const layanan_id = searchParams.get('layanan_id') || "";

    const whereClause = layanan_id ? { layanan: { layanan_id } } : {}

    const data = await prisma.dokumen.findMany({
        where: whereClause,
        include: {
          ajuan_dok: true
        }
    });

    return new Response(
        JSON.stringify({
            message: "dokumen retrieved successfully",
            data: data,
        })
    );
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {

    const { searchParams } = new URL(request.url);

    const layanan_id = searchParams.get('layanan_id') || "";
    const formData = await request.formData();

    // Extract fields from the formData
    const dokumenName = formData.get('dokumen_name')?.toString() || '';
    const dokumenType = formData.get('dokumen_type')?.toString() || '';
    const dokumenSize = formData.get('dokumen_size')?.toString() || '';
    const file = formData.get('dokumen_template') as File | null;

    // Validate required fields
    if (!dokumenName) {
      return new Response(JSON.stringify({ message: 'dokumen_name is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
    }

    // If a file is provided, save it to disk (public/uploads/dokumen)
    let savedFilename: string | null = null;
    let savedRelativePath: string | null = null;
    let detectedFileSize: number | null = null;

    if (file && typeof file.arrayBuffer === 'function') {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'dokumen')
      await fs.promises.mkdir(uploadsDir, { recursive: true })

      const originalName = path.basename(file.name || 'uploaded')
      const safeName = originalName.replace(/[^a-zA-Z0-9.\-_]/g, '_')
      const filename = `${Date.now()}-${safeName}`
      const filePath = path.join(uploadsDir, filename)

      const buffer = Buffer.from(await file.arrayBuffer())
      await fs.promises.writeFile(filePath, buffer)

      savedFilename = filename
      savedRelativePath = `/uploads/dokumen/${filename}`
      detectedFileSize = buffer.length
    }

    // Check for duplicate by name + layanan_id
    const check = await prisma.dokumen.findFirst({
      where: {
        dokumen_name: dokumenName,
        ...(layanan_id ? { layanan: { layanan_id } } : {}),
      }
    })

    if (check) {
      return new Response(JSON.stringify({ message: "dokumen sudah ada di database" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Build create payload
    const createData: any = {
      dokumen_name: dokumenName,
      dokumen_type: dokumenType || undefined,
      dokumen_size: Number(dokumenSize || detectedFileSize || 0),
      layanan_id
    }

    if (savedRelativePath) createData.dokumen_template = savedRelativePath    

    const addData = await prisma.dokumen.create({ data: createData })

    const serialized = { ...addData }

    return new Response(JSON.stringify({ message: "Data added successfully", data: serialized }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {

      console.log(error);

      return new Response(JSON.stringify({ message: "Error added data", error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ message: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}