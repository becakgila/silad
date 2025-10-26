import prisma from '@/lib/prisma'
import { headers } from 'next/headers';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get the token
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });    

    const auth = await prisma.user_haks.findMany({
      where: {
        user_id: parseInt(token!.id as string),                
      },
    });  

    const data = await prisma.moduls.findMany({
      where: {
        modul_id: { in: auth.map((a : any) => a.modul_id)},
      },
      orderBy: {
        modul_urut: 'asc', 
      }
    });
    
    console.log(data);

    // Convert BigInt to string for JSON serialization
    const serializedData = data.map((item: any) => ({
      ...item,
      modul_id: item.modul_id.toString() // Convert BigInt to string
    }));

    return new Response(JSON.stringify({ data: serializedData }), {
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
