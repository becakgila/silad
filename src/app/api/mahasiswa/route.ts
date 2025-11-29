import prisma from '@/lib/prisma'
import { create } from 'domain';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';
import { includes } from 'zod';

export async function GET(request: NextRequest) {
  try {

    const { searchParams } = new URL(request.url);

    const search = searchParams.get('search') || "";
    const take: number = Number(searchParams.get('take')) || 10;
    const page: number = Number(searchParams.get('page')) || 1;

    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    const user_id : bigint = BigInt(token?.id as string); 

    const skip = (page - 1) * take;

    const whereClause : any = {
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

    if((token?.level as string).toLowerCase() === "fakultas"){
      const user = await prisma.users.findUnique()
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
        prodi: {
          ...item.prodi,
          fakultas_id: item.prodi.fakultas_id.toString()
        }
      };
    });  
    console.log(serializedData);

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

export async function PUT(request: Request) {
  const { nim, ...updateData } = await request.json();
  try {

    const updatedMahasiswa = await prisma.mahasiswa.upsert({
      where: { nim },
      create: { nim, ...updateData },
      update: { ...updateData },
    });
    return new Response(JSON.stringify({
      message: "Mahasiswa updated successfully",
      data: updatedMahasiswa
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  catch (error) {
    console.error("Error updating mahasiswa:", error);
    return new Response(JSON.stringify({ message: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
