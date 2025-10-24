import models from "@/helper/database"
type UrlParams =  { 

  params : {
    id : string;
    
  }
}

export async function GET(request: Request, { params } : UrlParams) {
  try {        
    
    const {id} =  await params;
    // const id =  params.id;
    // const nama =  params.nama;

    const data = await models.users.findByPk(id)

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
