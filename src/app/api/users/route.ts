import models from "@/helper/database"

export async function GET(request: Request) {
  try {        

    const data = await models.users.findAll()

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
