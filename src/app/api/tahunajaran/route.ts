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
      // OR: [
      //   {
      //     tahun_awal: {
      //       contains: search,
      //     }
      //   },
      //   {
      //     tahun_akhir: {
      //       contains: search,
      //     }
      //   },
      //   {
      //     semester: {
      //       contains: search,
      //     }
      //   },
      //   {
      //     start_date: {
      //       contains: search,
      //     }
      //   },
      //   {
      //     end_date: {
      //       contains: search,
      //     }
      //   },

      // ]
    }

    const data = await prisma.tahun_ajaran.findMany({
      take: take,
      skip: skip,
      where: whereClause,
    });

    const serializedData = data.map((item: any) => ({
      ...item,
      tahun_ajaran_id: item.tahun_ajaran_id.toString() // Convert BigInt to string,

    }));

    const dataCount = await prisma.tahun_ajaran.count({
      where: whereClause,
    });


    return new Response(JSON.stringify({
      message: "Route is working",
      data: serializedData,
      total: dataCount
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    return new Response(JSON.stringify({ message: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();

     
    const check = await prisma.tahun_ajaran.findFirst({
      where: { 
        tahun_awal: body.tahun_awal, 
        tahun_akhir: body.tahun_akhir, 
        semester: body.semester 
      }
    })

    console.log(check, body);
    

    if (check) {
      return new Response(JSON.stringify({ message: "Tahun Ajaran sudah ada di database" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }



    const addData = await prisma.tahun_ajaran.create({
      data: {
        tahun_awal: "0000",
        tahun_akhir: "0000",        
        semester: "gasal",
        start_date: "0000-00-00",
        end_date: "0000-00-00",
        created_at: new Date(),
        updated_at: new Date(),
        ...body
      }
    });

    const serializedModul = {
      ...addData,
      tahun_ajaran_id: addData.tahun_ajaran_id.toString()
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