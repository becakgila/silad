import prisma from '@/lib/prisma'
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
          nim: {
            contains: search,
          }
        },
        {
          nik: {
            contains: search,
          }
        },
        {
          nama: {
            contains: search,
          }
        },
        {
          angkatan: {
            contains: search,
          }
        },
        {
          jalur_masuk: {
            contains: search,
          }
        },
        {
          no_hp: {
            contains: search,
          }
        },
        {
          email: {
            contains: search,
          }
        },
        {
          prodi: {
            prodi_name:{
              contains: search,
            }            
          }
        },
      ]
    }

    const data = await prisma.mahasiswa.findMany({
      take: take,
      skip: skip,
      where: whereClause,
      include:{
        prodi: true,
      }
    });

    const serializedData = data.map((item: any) => {
      return { 
        ...item, 
        prodi: item.prodi ? {
          ...item.prodi,
          fakultas_id: item.prodi.fakultas_id.toString(),
        }: null,
      };
    });  

    const dataCount = await prisma.mahasiswa.count({
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
