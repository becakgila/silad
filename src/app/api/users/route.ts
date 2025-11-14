import prisma from '@/lib/prisma'
import { id } from 'zod/v4/locales';

export async function GET(request: Request) {
  try {

    const { searchParams } = new URL(request.url);

    const search = searchParams.get('search') || "";
    const take: number = Number(searchParams.get('take')) || 10;
    const page: number = Number(searchParams.get('page')) || 1;
    const sortColumn = searchParams.get('sortColumn') || "";
    const sortDirection = searchParams.get('sortDirection') || "asc";

    console.log(sortColumn, sortDirection);
    

    const skip = (page - 1) * take;

    const whereClause = {
      OR: [
        {
          name: {
            contains: search,
          }
        },
        {
          nips: {
            contains: search,
          }
        },
        {
          email: {
            contains: search,
          }
        },
      //   {
      //     phone: {
      //       contains: search,
      //     }
      //   },
      //   {
      //     level: {
      //       contains: search,
      //     }
      //   },
      //   // {
      //   //   modul_akses: {
      //   //     in: Object.values(moduls_modul_akses).filter(s =>
      //   //       s.toLowerCase().includes(search)
      //   //     ),
      //   //   }
      //   // },

      ]
    }

    const data = await prisma.users.findMany({
      take: take,
      skip: skip,
      where: whereClause,
      include: {
        fakultas: true, // Include the fakultas relation
        prodi: true, // Include the fakultas relation
      },
      orderBy: sortColumn ? { [sortColumn]: sortDirection as 'asc' | 'desc' } : { id: 'asc' },
    });
    
    const serializedData = data.map((item: any) => {
      return { 
        ...item, 
        id: item.id.toString(),
        fakultas_id: item.fakultas_id.toString(),
        fakultas: item.fakultas ? {
          ...item.fakultas,
          fakultas_id: item.fakultas.fakultas_id.toString(),
        }: null,
        prodi: item.prodi ? {
          ...item.prodi,
          fakultas_id: item.prodi.fakultas_id.toString(),
        }: null,
      };
    });              

    const dataCount = await prisma.users.count({
      where: whereClause,
    });    

    console.log(serializedData);
    

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
