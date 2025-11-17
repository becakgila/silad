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
              layanan_jenis: {
                contains: search,
              }
            },
    
          ]
        }

    const data = await prisma.layanan.findMany({
      take: take,
      skip: skip,
      where: whereClause,
    });
    
    console.log(data)

    const serializedData = data.map((item: any) => {
      return {
        ...item,
        layanan_id: item.layanan_id.toString(),
      };
    });

    const dataCount = await prisma.layanan.count({
      where: whereClause,
    });

    return new Response(JSON.stringify({
      message: "layanan retrieved successfully",
      data: serializedData,
      total: dataCount
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Unable to fetch layanan:", error);
    return new Response(JSON.stringify({ message: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();

     
    const check = await prisma.layanan.findFirst({
      where: { 
        layanan_jenis: body.layanan_jenis,
        layanan_lvl: body.layanan_lvl,
      }
    })

    console.log(check, body);
    

    if (check) {
      return new Response(JSON.stringify({ message: "layanan sudah ada di database" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }



    const addData = await prisma.layanan.create({
      data: {
        layanan_jenis: body.layanan_jenis,
        ...body
      }
    });

    const serializedModul = {
      ...addData,
      layanan_id: addData.layanan_id.toString()
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
  const { layanan_id, ...updateData } = await request.json();
  try {

    const updatedlayanan = await prisma.layanan.upsert({
      where: { layanan_id },
      create: { layanan_id, ...updateData },
      update: { ...updateData },
    });
    return new Response(JSON.stringify({
      message: "layanan updated successfully",
      data: updatedlayanan
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  catch (error) {
    console.error("Error updating layanan:", error);
    return new Response(JSON.stringify({ message: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}



