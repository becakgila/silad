import prisma from '@/lib/prisma'
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
