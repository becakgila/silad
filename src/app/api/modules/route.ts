import { NextRequest } from "next/server";
import prisma from '@/lib/prisma'
import { moduls_modul_akses } from "@/generated/prisma";
import { fa } from "zod/v4/locales";
import { use } from "react";

export async function GET(request: NextRequest) {
  try {

    const { searchParams } = new URL(request.url);

    const search = searchParams.get('search') || "";

    // Parse pagination params. If not provided, keep undefined so Prisma returns all rows.
    const takeParam = searchParams.get('take');
    const pageParam = searchParams.get('page');

    const userIdParam = searchParams.get('userId');

    const take: number | undefined = takeParam ? Number(takeParam) : undefined;
    const page: number | undefined = pageParam ? Number(pageParam) : undefined;

    // Compute skip only when take is provided. If page is missing, default to page 1 (skip = 0).
    const skip: number | undefined = (typeof take === 'number' && !isNaN(take))
      ? ((page && !isNaN(page) && page > 0) ? (page - 1) * take : 0)
      : undefined;

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

    // Build findMany options and only include take/skip when take is a positive number.
    const findManyOptions: any = {
      orderBy: { modul_urut: 'asc' },
      where: whereClause,
      include: {
        user_haks: userIdParam ? {
          where: {
            user_id: Number(userIdParam), // filter array of user_haks by user_id
          },
        } : false,
      },
    };

    if (typeof take === 'number' && !isNaN(take) && take > 0) {
      findManyOptions.take = take;
      // include skip (0 is valid) when take is provided
      findManyOptions.skip = typeof skip === 'number' && !isNaN(skip) ? skip : 0;
    }

    const data = await prisma.moduls.findMany(findManyOptions);

    const dataCount = await prisma.moduls.count({
      where: whereClause,
    });


    const serializedData = data.map((item: any) => {

      const serializedHaks = userIdParam ? {
        user_haks: item.user_haks.map((hak: any) => ({
          ...hak,
          hakid: hak.hakid.toString(),
          modul_id: hak.modul_id.toString(),
        }))
      } : {};

      return ({
        ...item,
        modul_id: item.modul_id.toString(), // Convert BigInt to string,            
        ...serializedHaks

      })
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
    // throw new Error(error instanceof Error ? error.message : "Unknown error");;

    console.log(error);


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