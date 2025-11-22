import prisma from '@/lib/prisma'
import ajuanDokType from '@/types/model/ajuanDok';
import { NextRequest } from "next/server";
import fs from 'node:fs'
import path from 'node:path'

export async function GET(req: Request) {



}

export async function POST(req: NextRequest) {

  const formData = await req.formData();

  const file = formData.get('file') as File | null;
  const ajuan_id = formData.get('ajuan_id')?.toString();
  const dokumen_id = formData.get('dokumen_id')?.toString();

  let savedFilename: string | null = null;
  let savedRelativePath: string | null = null;
  let detectedFileSize: number | null = null;

  if (file && typeof file.arrayBuffer === 'function') {
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'ajuanDok')
    await fs.promises.mkdir(uploadsDir, { recursive: true })

    const originalName = path.basename(file.name || 'uploaded')
    const safeName = originalName.replace(/[^a-zA-Z0-9.\-_]/g, '_')
    const filename = `${Date.now()}-${safeName}`
    const filePath = path.join(uploadsDir, filename)

    const buffer = Buffer.from(await file.arrayBuffer())
    await fs.promises.writeFile(filePath, buffer)

    savedFilename = filename
    savedRelativePath = `/uploads/ajuanDok/${filename}`
    detectedFileSize = buffer.length
  }

  const createData: any = {
    ajuan_id,
    dokumen_id,
  }

  if (savedRelativePath) createData.dokumen_url = savedRelativePath

  const addData = await prisma.ajuan_dok.create({ data: createData })

  const serialized = { ...addData }

  return new Response(JSON.stringify({
    data: serialized,
    message: "ajuan dok berhasil di buat"
  }))
}

export async function PATCH(req: NextRequest) {

  const formData = await req.formData();

  const file = formData.get('file') as File | null;
  const ajuan_id = formData.get('ajuan_id')?.toString();
  const dokumen_id = formData.get('dokumen_id')?.toString();  

  const check : ajuanDokType = await prisma.ajuan_dok.findFirst({
    where: {
      ajuan_id,
      dokumen_id
    }
  })

  if(!check){
    return new Response(JSON.stringify(
      {        
        message: "data tidak ada di database"
      }
    ))
  }

  let savedFilename: string | null = null;
  let savedRelativePath: string | null = null;
  let detectedFileSize: number | null = null;

  if (file && typeof file.arrayBuffer === 'function') {
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'ajuanDok')
    await fs.promises.mkdir(uploadsDir, { recursive: true })

    const originalName = path.basename(file.name || 'uploaded')
    const safeName = originalName.replace(/[^a-zA-Z0-9.\-_]/g, '_')
    const filename = `${Date.now()}-${safeName}`
    const filePath = path.join(uploadsDir, filename)

    const buffer = Buffer.from(await file.arrayBuffer())
    await fs.promises.writeFile(filePath, buffer)

    savedFilename = filename
    savedRelativePath = `/uploads/ajuanDok/${filename}`
    detectedFileSize = buffer.length

    if (check.dokumen_url) {
            try {
              const prevPath = path.join(process.cwd(), 'public', check.dokumen_url.replace(/^\//, ''));
              if (prevPath !== filePath) {
                await fs.promises.unlink(prevPath).catch(() => {});
              }
            } catch (e) {
              // ignore unlink errors
            }
  }
  }

  const updateData: any = {
    
  }

  if (savedRelativePath) updateData.dokumen_url = savedRelativePath

  const updatedData = await prisma.ajuan_dok.update({ 
    where: {
      ajuan_id,
      dokumen_id
    },
    data: updateData 
  })

  const serialized = { ...updatedData }

  return new Response(JSON.stringify({
    data: serialized,
    message: "ajuan dok berhasil di update"
  }))
}