import prisma from '@/lib/prisma'
import { log } from 'console';
import { NextRequest } from 'next/server';
import { includes } from 'zod';

export async function GET(request: Request) {
  try {    
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || "";
    const take: number = Number(searchParams.get('take')) || 10;
    const page: number = Number(searchParams.get('page')) || 1;
    const skip = (page - 1) * take;
    
        const whereClause = {
          OR: [
            {
              prodi_name: {
                contains: search,
              }
            },
    
          ]
        }

    const data = await prisma.prodi.findMany({
      take: take,
      skip: skip,
      where: whereClause,
      include: {
        fakultas:true
      }
    });
    
    const serializedData = data.map((item: any) => {
      return {
        ...item,
        fakultas_id: item.fakultas_id.toString(),
        fakultas: {
          ...item.fakultas,
          fakultas_id:item.fakultas.fakultas_id.toString(),
        }
      };
    });
    console.log(serializedData)
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

    console.log(check, body);
    

    if (check) {
      return new Response(JSON.stringify({ message: "prodi sudah ada di database" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }



    const addData = await prisma.prodi.create({
      data: {
        prodi_name: body.prodi_name,
        ...body
      }
    });

    const serializedModul = {
      ...addData,
      prodi_id: addData.prodi_id.toString()
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



