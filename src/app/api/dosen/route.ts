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
              dosen_name: {
                contains: search,
              }
            },
    
          ]
        }

    const data = await prisma.dosen.findMany({
      where: whereClause,
    });

    
    
    // const serializedData = data.map((item: any) => {
    //   return {
    //     ...item,
    //     dosen_id: item.dosen_id.toString(),
    //   };
    // });    

    const dataCount = await prisma.dosen.count({
      where: whereClause,
    });

    return new Response(JSON.stringify({
      message: "dosen retrieved successfully",
      data: data,
      total: dataCount
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Unable to fetch dosen:", error);
    return new Response(JSON.stringify({ message: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();

     
    const check = await prisma.dosen.findFirst({
      where: { 
        dosen_name: body.dosen_name,
      }
    })

    console.log(check, body);
    

    if (check) {
      return new Response(JSON.stringify({ message: "dosen sudah ada di database" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }



    const addData = await prisma.dosen.create({
      data: {
        dosen_name: body.dosen_name,
        ...body
      }
    });

    const serializedModul = {
      ...addData,
      dosen_id: addData.dosen_id.toString()
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
  const { dosen_id, ...updateData } = await request.json();
  try {

    const updateddosen = await prisma.dosen.upsert({
      where: { dosen_id },
      create: { dosen_id, ...updateData },
      update: { ...updateData },
    });
    return new Response(JSON.stringify({
      message: "dosen updated successfully",
      data: updateddosen
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  catch (error) {
    console.error("Error updating dosen:", error);
    return new Response(JSON.stringify({ message: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}



