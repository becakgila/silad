import { prodi_prodi_jenjang } from '@/generated/prisma';
import prisma from '@/lib/prisma'
import { log } from 'console';
import { NextRequest } from 'next/server';
import { includes } from 'zod';

// Function to generate prodi ID
function generateProdiId(): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `PRODI-${timestamp}-${randomStr}`.toUpperCase();
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || "";
    const fakultas_id = searchParams.get('fakultas_id') || "";
    const take: number = Number(searchParams.get('take')) || 0;
    const page: number = Number(searchParams.get('page')) || 0;
    const skip = (page - 1) * take;

    const whereClause = {
      ...(fakultas_id ?{
        fakultas_id
      } : {}),
      OR: [
        {
          prodi_name: {
            contains: search,
          }
        },
        {
          prodi_akreditasi: {
            contains: search,
          }
        },
        {
          fakultas: {
            fakultas_name: {
              contains: search,
            }
          }
        },
        {
          prodi_jenjang: {
            in: Object.values(prodi_prodi_jenjang).filter(s =>
                          s.toLowerCase().includes(search)
                        ),
          }
        }
      ]
    }

    const pagination = take ? {
      take: take,
      skip: skip,
    } : {}

    const data = await prisma.prodi.findMany({
      ...pagination,
      where: whereClause,
      include: {
        fakultas: true
      }
    });

    const serializedData = data.map((item: any) => {
      return {
        ...item,
        fakultas_id: item.fakultas_id.toString(),
        fakultas: {
          ...item.fakultas,
          fakultas_id: item.fakultas.fakultas_id.toString(),
        }
      };
    });
    // console.log(serializedData)
    const dataCount = await prisma.prodi.count({
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

    const check = await prisma.prodi.findFirst({
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

    const addData = await prisma.prodi.create({
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

    const updatedprodi = await prisma.prodi.upsert({
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



