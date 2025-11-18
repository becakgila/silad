import prisma from '@/lib/prisma'
import { NextRequest } from 'next/server';

export async function GET(request: Request){

    const { searchParams } = new URL(request.url);

    const layanan_id = searchParams.get('layanan_id') || "";

    const whereClause = {
        ...(layanan_id ? {
            layanan_id
        } : {}),
    }

    const data = await prisma.dokumen.findMany({
        where: whereClause
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

    const body = await request.json();
     
    const check = await prisma.dokumen.findFirst({
      where: { 
        dokumen_name: body.dokumen_name,
        layanan_id: layanan_id
      }
    })    
    
    if (check) {
      return new Response(JSON.stringify({ message: "dokumen sudah ada di database" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const addData = await prisma.dokumen.create({
      data: {        
        ...body,
        layanan_id,
        dokumen_size: Number(body.dokumen_size)
      }
    });

    const serialized = {
      ...addData,      
    };    

    return new Response(JSON.stringify({
      message: "Data added successfully",
      data: serialized
    }), {
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