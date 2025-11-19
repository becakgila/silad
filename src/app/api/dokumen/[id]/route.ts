import { NextRequest } from "next/server";
import prisma from '@/lib/prisma'
import path from "node:path";
import fs from 'node:fs';


export async function PATCH(request: NextRequest, { params } : { params: { id: string } }) {
  try {
    const idData = (await params).id;

    if (!idData) {
      return new Response(JSON.stringify({ message: "id is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // fetch existing dokumen to allow deleting previous file if replaced
    const existing = await prisma.dokumen.findUnique({ where: { dokumen_id: idData } });
    if (!existing) {
      return new Response(JSON.stringify({ message: 'dokumen not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    const contentType = request.headers.get('content-type') || '';
    const updateData: any = {};

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const dokumenName = formData.get('dokumen_name')?.toString();
      const dokumenType = formData.get('dokumen_type')?.toString();
      const dokumenSizeField = formData.get('dokumen_size')?.toString();
      const file = formData.get('dokumen_template') as File | null;

      if (dokumenName !== undefined && dokumenName !== '') updateData.dokumen_name = dokumenName;
      if (dokumenType !== undefined) updateData.dokumen_type = dokumenType;

      if (file && typeof file.arrayBuffer === 'function') {
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'dokumen');
        await fs.promises.mkdir(uploadsDir, { recursive: true });

        const originalName = path.basename(file.name || 'uploaded');
        const safeName = originalName.replace(/[^a-zA-Z0-9.\-_]/g, '_');
        const filename = `${Date.now()}-${safeName}`;
        const filePath = path.join(uploadsDir, filename);

        const buffer = Buffer.from(await file.arrayBuffer());
        await fs.promises.writeFile(filePath, buffer);

        const savedRelativePath = `/uploads/dokumen/${filename}`;
        updateData.dokumen_template = savedRelativePath;
        updateData.dokumen_size = buffer.length;

        // remove previous file if it exists and is different
        if (existing.dokumen_template) {
          try {
            const prevPath = path.join(process.cwd(), 'public', existing.dokumen_template.replace(/^\//, ''));
            if (prevPath !== filePath) {
              await fs.promises.unlink(prevPath).catch(() => {});
            }
          } catch (e) {
            // ignore unlink errors
          }
        }
      } else if (dokumenSizeField) {
        updateData.dokumen_size = Number(dokumenSizeField);
      }
    } else {
      // assume JSON body
      const body = await request.json();
      if (body.dokumen_name !== undefined) updateData.dokumen_name = body.dokumen_name;
      if (body.dokumen_type !== undefined) updateData.dokumen_type = body.dokumen_type;
      if (body.dokumen_size !== undefined) updateData.dokumen_size = Number(body.dokumen_size);
    }

    const updated = await prisma.dokumen.update({
      where: { dokumen_id: idData },
      data: updateData,
    });

    return new Response(JSON.stringify({
      message: "data updated successfully",
      data: updated
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error : unknown) {
    if (error instanceof Error) {      

      console.log(error);
      
      return new Response(JSON.stringify({ message: "Error updating data", error: error.message }), {
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

export async function DELETE(request: NextRequest, { params } : { params: { id: string } }) {
  try {
    const idData = (await params).id;
    if (!idData) {
      return new Response(JSON.stringify({ message: "id is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    } 
    const dokumenData= await prisma.dokumen.delete({
      where: { dokumen_id: idData }
    });     
    

     const filePath = path.join(process.cwd(), 'public', dokumenData.dokumen_template); // Adjust path as needed

    await fs.promises.unlink(filePath); // Using promises for async operation


    return new Response(JSON.stringify({ 
        message: "Dokumen deleted successfully"        
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });    
  } catch (error : unknown) {
    if (error instanceof Error) {
      console.log(error);
      return new Response(JSON.stringify({ message: "Error deleting data", error: error.message }), {
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