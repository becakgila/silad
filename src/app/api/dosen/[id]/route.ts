import { NextRequest } from "next/server";
import prisma from '@/lib/prisma'


export async function PATCH(request: NextRequest, { params } : { params: { id: string } }) {
  try {
    const body = await request.json();    
    const idData = (await params).id;    

    if (!idData) {
      return new Response(JSON.stringify({ message: "idData is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }    
    const updated = await prisma.fakultas.update({
      where: { fakultas_id: BigInt(idData) },
      data: body
    });

    const serializedData = {
      ...updated,
      fakultas_id: updated.fakultas_id.toString()
    };    

    

    return new Response(JSON.stringify({ 
        message: "Modul cre successfully",
        data: serializedData
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });    
  } catch (error : unknown) {
    if (error instanceof Error) {      

      console.log(error);
      
      return new Response(JSON.stringify({ message: "Error updating modul", error: error.message }), {
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

export async function DELETE(request: NextRequest, { params } : { params: { id: string } }) {
  try {
    const idData = (await params).id;
    if (!idData) {
      return new Response(JSON.stringify({ message: "idData is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    } 
    await prisma.fakultas.delete({
      where: { fakultas_id: BigInt(idData) }
    }); 
    return new Response(JSON.stringify({ 
        message: "Modul deleted successfully"        
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });    
  } catch (error : unknown) {
    if (error instanceof Error) {
      console.log(error);
      return new Response(JSON.stringify({ message: "Error deleting data", error: error.message }), {
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