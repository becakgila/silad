import prisma from '@/lib/prisma'
import { NextRequest } from 'next/server';

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
              fakultas_name: {
                contains: search,
              }
            },
    
          ]
        }

    const data = await prisma.fakultas.findMany({
      take: take,
      skip: skip,
      where: whereClause,
    });
    
    const serializedData = data.map((item: any) => {
      return {
        ...item,
        fakultas_id: item.fakultas_id.toString(),
      };
    });

    const dataCount = await prisma.fakultas.count({
      where: whereClause,
    });

    return new Response(JSON.stringify({
      message: "Fakultas retrieved successfully",
      data: serializedData,
      total: dataCount
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Unable to fetch fakultas:", error);
    return new Response(JSON.stringify({ message: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();

     
    const check = await prisma.fakultas.findFirst({
      where: { 
        fakultas_name: body.fakultas_name,
      }
    })

    console.log(check, body);
    

    if (check) {
      return new Response(JSON.stringify({ message: "Fakultas sudah ada di database" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }



    const addData = await prisma.fakultas.create({
      data: {
        fakultas_name: body.fakultas_name,
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
  const { fakultas_id, ...updateData } = await request.json();
  try {

    const updatedFakultas = await prisma.fakultas.upsert({
      where: { fakultas_id },
      create: { fakultas_id, ...updateData },
      update: { ...updateData },
    });
    return new Response(JSON.stringify({
      message: "Fakultas updated successfully",
      data: updatedFakultas
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  catch (error) {
    console.error("Error updating Fakultas:", error);
    return new Response(JSON.stringify({ message: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}



