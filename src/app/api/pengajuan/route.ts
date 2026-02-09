import { prodi_prodi_jenjang } from '@/generated/prisma';
import prisma from '@/lib/prisma'
import { log } from 'console';
import { NextRequest, NextResponse } from 'next/server';
import { includes } from 'zod';
import { ta } from 'zod/v4/locales';

// Function to generate prodi ID
function generateProdiId(): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `PRODI-${timestamp}-${randomStr}`.toUpperCase();
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const layanan_id = searchParams.get('layanan_id') || "";
    const mahasiswa_id = searchParams.get('mahasiswa_id') || "";

    if(layanan_id && mahasiswa_id){
      const data = await prisma.ajuan.findFirst({
        where: {
          layanan_id: layanan_id,
          nim: mahasiswa_id
        },        
      });

      const serializedData = {
        ...data,
        tahun_ajaran_id: data?.tahun_ajaran_id.toString() || "",
      }

      return NextResponse.json({
        data: serializedData,
        messages: "success mengambil data pengajuan"
      })
    }

    const search = searchParams.get('search') || "";
    const take: number = Number(searchParams.get('take')) || 10;
    const page: number = Number(searchParams.get('page')) || 1;
    const skip = (page - 1) * take;

    const whereClause = {
      OR: [
        {
          nim: {
            contains: search,
          }
        },
        {
          mahasiswa: {
            nama: {
              contains: search,
            }
          }
        },
        {
          mahasiswa: {
            prodi: {
              prodi_name:{
                contains: search,
              }
            }
          }
        },
        {
          layanan: {
            layanan_jenis:{
              contains: search,
            }
          }
        },

      ]
    }

    const data = await prisma.ajuan.findMany({
      take: take,
      skip: skip,
      where: whereClause,
      include: {
        mahasiswa: {
          include: {
            prodi: true,
          }
        },
        layanan: true,
        tahun_ajaran:true
      }
    });
    
    const serializedData = data.map((item: any) => {
    
      return {
        ...item,
        tahun_ajaran_id: item.tahun_ajaran_id.toString(),
        tahun_ajaran: {
          ...item.tahun_ajaran,
          tahun_ajaran_id: item.tahun_ajaran.tahun_ajaran_id.toString(),
        }
        , mahasiswa: {
          ...item.mahasiswa,
          prodi:{
            ...item.mahasiswa.prodi,
            fakultas_id : item.mahasiswa.prodi.fakultas_id.toString()

          }
        }
      };
    });
    const dataCount = await prisma.ajuan.count({
      where: whereClause,
    });

    return new Response(JSON.stringify({
      message: "prodi retrieved successfully",
      data: serializedData,
      total: dataCount
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Unable to fetch prodi:", error);
    return new Response(JSON.stringify({ message: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();

    const check = await prisma.ajuan.findFirst({
      where: {
        prodi_name: body.prodi_name,
      }
    })

    if (check) {
      return new Response(JSON.stringify({ message: "prodi sudah ada di database" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const prodiId = body.prodi_id || generateProdiId();

    const addData = await prisma.ajuan.create({
      data: {
        prodi_id: prodiId,
        ...body
      }
    });

    const serializedModul = {
      ...addData,
      fakultas_id: addData.fakultas_id.toString()
    };

    return new Response(JSON.stringify({
      message: "Data added successfully",
      data: serializedModul
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
export async function PUT(request: Request) {
  const { prodi_id, ...updateData } = await request.json();
  try {

    const updatedprodi = await prisma.ajuan.upsert({
      where: { prodi_id },
      create: { prodi_id, ...updateData },
      update: { ...updateData },
    });
    return new Response(JSON.stringify({
      message: "prodi updated successfully",
      data: updatedprodi
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  catch (error) {
    console.error("Error updating prodi:", error);
    return new Response(JSON.stringify({ message: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}



