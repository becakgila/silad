import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma'
import ajuanStatusType from "@/types/model/ajuanStatus";
import fs from 'node:fs'
import path from 'node:path'
import { getToken } from "next-auth/jwt";

export async function GET(request: NextRequest) {
    try {

        const { searchParams } = new URL(request.url);

        const ajuan_id = searchParams.get('ajuan_id') || "";

        const data: ajuanStatusType[] = await prisma.ajuan_status.findMany({ where: { ajuan_id } })

        const serialized = data.map((data) => ({
            ...data,
            user_id: data.user_id.toString(),            
        }))        
        
        return Response.json({ message: "berhasil mendapatkan ajuan status!!!", data: serialized }, {
            status: 200,            
        });
    } catch (error) {
        console.error("Unable to connect to the database:", error);
        return new Response(JSON.stringify({ message: error }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}

export async function POST(req: NextRequest) {

    try {
        const form = await req.formData()
    const file = form.get('file') as File;
    const ajuan_id = form.get('ajuan_id');
    const progress = form.get('progress') as string;
    
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        
    const user_id : bigint = BigInt(token?.id as string) ;

    let savedFilename: string | null = null;
    let savedRelativePath: string | null = null;
    let detectedFileSize: number | null = null;

    if (file && typeof file.arrayBuffer === 'function') {

        const pathSave = "uploads/ajuanStatus";
        const uploadsDir = path.join(process.cwd(), 'public', ...pathSave.split("/"))
        await fs.promises.mkdir(uploadsDir, { recursive: true })

        const originalName = path.basename(file.name || 'uploaded')
        const safeName = originalName.replace(/[^a-zA-Z0-9.\-_]/g, '_')
        const filename = `${Date.now()}-${safeName}`
        const filePath = path.join(uploadsDir, filename)

        const buffer = Buffer.from(await file.arrayBuffer())
        await fs.promises.writeFile(filePath, buffer)

        savedFilename = filename
        savedRelativePath = `/${pathSave}/${filename}`
        detectedFileSize = buffer.length
    }

    const createData: any = {
        ajuan_id,
        user_id,
        progress: Number(progress),
        
    }

    if (savedRelativePath) createData.dok_url = savedRelativePath

    const ajuan_status = await prisma.ajuan_status.create({
        data: createData
    })

    const serialized = {
        ...ajuan_status,
        user_id: user_id.toString(),        
    }

    console.log(serialized);     

    return new Response(JSON.stringify({
        data: serialized,
        message: "POST ajuan status berhasil!!!"
    }))
    } catch (error) {

        const err = error as Error
        console.log(err.message);        

        return NextResponse.json({
            message: "POST ajuan status gagal!!!",
            data: err,        
        }, {status: 500})
        
    }
}