import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const data = await prisma.users.findMany();

    return new Response(JSON.stringify({ message: data }), {
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
