import { NextRequest } from "next/server";
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {

    const data = await prisma.moduls.findMany({      
      orderBy: {
        modul_urut: 'asc', 
      }
    });        

    const serializedData = data.map((item: any) => ({
      ...item,
      modul_id: item.modul_id.toString() // Convert BigInt to string
    }));                 

    return new Response(JSON.stringify({ 
        message: "Route is working",
        data: serializedData
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });    
  } catch (error) {
    
  }
}