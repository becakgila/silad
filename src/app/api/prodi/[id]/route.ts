import { NextRequest } from "next/server";
import prisma from '@/lib/prisma'


export async function PATCH(request: NextRequest, { params } : { params: { id: string } }) {
  try {
    const body = await request.json();    
    const id = (await params).id;    

    if (!id) {
      return new Response(JSON.stringify({ message: "id params is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }    
    const updatedModul = await prisma.prodi.update({
      where: { prodi_id: id },
      include: {
        fakultas: true,
        dosen: true
      },
      data: body
    });

    const serializedModul = {
      ...updatedModul,
        fakultas_id: updatedModul.fakultas_id.toString(),
        fakultas: {
          ...updatedModul.fakultas,
          fakultas_id: updatedModul.fakultas.fakultas_id.toString(),
        }
    };    

    

    return new Response(JSON.stringify({ 
        message: "Modul update successfully",
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
    const id = (await params).id;
    if (!id) {
      return new Response(JSON.stringify({ message: "id is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    } 
    await prisma.prodi.delete({
      where: { prodi_id: id }
    }); 
    return new Response(JSON.stringify({ 
        message: "prodi deleted successfully"        
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });    
  } catch (error : unknown) {
    if (error instanceof Error) {
      console.log(error);
      return new Response(JSON.stringify({ message: "Error deleting prodi", error: error.message }), {
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