import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fakultas_id = searchParams.get('fakultas_id');

    let whereClause: any = {};

    console.log(fakultas_id, 'fakultas id');
    
    
    if (fakultas_id) {
      whereClause = {
        fakultas_id: BigInt(fakultas_id),
      };
    }

    const data = await prisma.prodi.findMany({
      where: whereClause,
      select: {
        prodi_id: true,
        prodi_name: true,
      },
    });
    
    const serializedData = data.map((item: any) => {
      return {
        value: item.prodi_id,
        label: item.prodi_name,
      };
    });

    return new Response(JSON.stringify({
      message: "Prodi retrieved successfully",
      data: serializedData,
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Unable to fetch prodi:", error);
    return new Response(JSON.stringify({ message: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
