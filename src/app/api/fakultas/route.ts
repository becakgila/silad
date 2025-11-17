import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const data = await prisma.fakultas.findMany({
      select: {
        fakultas_id: true,
        fakultas_name: true,
      },
    });
    
    const serializedData = data.map((item: any) => {
      return {
        value: item.fakultas_id.toString(),
        label: item.fakultas_name,
      };
    });

    return new Response(JSON.stringify({
      message: "Fakultas retrieved successfully",
      data: serializedData,
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Unable to fetch fakultas:", error);
    return new Response(JSON.stringify({ message: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
