import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest, { params } : { params: { id: string } }) {
  try {

    const layanan_template_id = params.id;

    const data = await prisma.layanan_template.findUnique({
      where:{
        layanan_template_id,
      }
    })
    
    return NextResponse.json(
      {
        data,
        messages : "Berhasil mendapatkan data layanan template."
      }
    )
  } catch (error) {

    const err = error as Error

    return NextResponse.json(
      { 
        messages : "error dalam mengambil data layanan template!!!",
        error: err.message, 
      },
      {
        status: 500,
      }
    )
  }
}