import { NextRequest } from "next/server";
import prisma from '@/lib/prisma'
import { moduls_modul_akses } from "@/generated/prisma";

export async function GET(request: NextRequest) {
  try {

    const { searchParams } = new URL(request.url);

    const search = searchParams.get('search') || "";
    const take: number = Number(searchParams.get('take')) || 10;
    const page: number = Number(searchParams.get('page')) || 1;

    const skip = (page - 1) * take;

    const whereClause = {
      OR: [
        {
          modul_name: {
            contains: search,
          }
        },
        {
          modul_url: {
            contains: search,
          }
        },
        {
          modul_simbol: {
            contains: search,
          }
        },
        {
          modul_akses: {
            in: Object.values(moduls_modul_akses).filter(s =>
              s.toLowerCase().includes(search)
            ),
          }
        },

      ]
    }

    const data = await prisma.moduls.findMany({
      orderBy: {
        modul_urut: 'asc',
      },
      take: take,
      skip: skip,
      where: whereClause,
    });

    const dataCount = await prisma.moduls.count({
      where: whereClause,
    });

    const serializedData = data.map((item: any) => ({
      ...item,
      modul_id: item.modul_id.toString() // Convert BigInt to string,

    }));

    return new Response(JSON.stringify({
      message: "Route is working",
      data: serializedData,
      total: dataCount
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // throw new Error(error instanceof Error ? error.message : "Unknown error");;

    return new Response(JSON.stringify({ message: "Error fetching moduls", data: [], error: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();



    const addModul = await prisma.moduls.create({
      data: {
        modul_induk: 0,
        modul_aktif: "yes",        
        modul_akses: "Prodi",
        modul_newtab: "no",
        modul_id_sms: "255",
        ...body
      }
    });

    const serializedModul = {
      ...addModul,
      modul_id: addModul.modul_id.toString()
    };    



    return new Response(JSON.stringify({
      message: "Modul created successfully",
      data: serializedModul
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {

      console.log(error);

      return new Response(JSON.stringify({ message: "Error creating modul", error: error.message }), {
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