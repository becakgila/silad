import { NextRequest } from "next/server";
import prisma from '@/lib/prisma'


export async function PATCH(request: NextRequest, { params } : { params: { id: string } }) {
  try {
    const body = await request.json();    
    const modulId = (await params).id;    

    if (!modulId) {
      return new Response(JSON.stringify({ message: "modulId is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }    
    const updatedModul = await prisma.moduls.update({
      where: { modul_id: BigInt(modulId) },
      data: body
    });

    const serializedModul = {
      ...updatedModul,
      modul_id: updatedModul.modul_id.toString()
    };

    return new Response(JSON.stringify({ 
        message: "Modul updated successfully",
        data: serializedModul
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
    const modulId = (await params).id;
    if (!modulId) {
      return new Response(JSON.stringify({ message: "modulId is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    } 
    await prisma.moduls.delete({
      where: { modul_id: BigInt(modulId) }
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
      return new Response(JSON.stringify({ message: "Error deleting modul", error: error.message }), {
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