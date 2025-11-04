import prisma from '@/lib/prisma'
import { NextRequest } from 'next/server';
type UrlParams =  { 

  params : {
    id : string;
    
  }
}

export async function GET(request: Request, { params } : UrlParams) {
  try {        
    
    const {id} = params;


  // Prisma `users.id` is a BigInt in the schema; convert the incoming id to BigInt
  const uid = BigInt(id as unknown as string);
  const data = await prisma.users.findUnique({ where: { id: uid } })

    return new Response(JSON.stringify({ message: data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error ) {
    console.error("Unable to connect to the database:", error);
     return new Response(JSON.stringify({ message: error }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function PATCH(request: NextRequest, { params } : { params: { id: string } }) {
  try {
    const body = await request.json();    
    const id = (await params).id;    

    if (!id) {
      return new Response(JSON.stringify({ message: "userId is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }    
    const updatedUser = await prisma.users.update({
      where: { id: BigInt(id) },
      data: body
    });

    const serializedUser = {
      ...updatedUser,
      id: updatedUser.id.toString()
    };    

    

    return new Response(JSON.stringify({ 
        message: "User updated successfully",
        data: serializedUser
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });    
  } catch (error : unknown) {
    if (error instanceof Error) {      

      console.log(error);
      
      return new Response(JSON.stringify({ message: "Error updating User", error: error.message }), {
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
      return new Response(JSON.stringify({ message: "User ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    } 
    await prisma.users.delete({
      where: { id: BigInt(id) }
    }); 

    return new Response(JSON.stringify({ 
        message: "User deleted successfully"        
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });    
  } catch (error : unknown) {
    if (error instanceof Error) {
      console.log(error);
      return new Response(JSON.stringify({ message: "Error deleting User", error: error.message }), {
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
