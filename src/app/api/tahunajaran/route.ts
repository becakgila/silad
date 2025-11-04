import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  try {

    const { searchParams } = new URL(request.url);



    const search = searchParams.get('search') || "";
    const take: number = Number(searchParams.get('take')) || 10;
    const page: number = Number(searchParams.get('page')) || 1;

    const skip = (page - 1) * take;

    const whereClause = {
      // OR: [
        // {
        //   modul_name: {
        //     contains: search,
        //   }
        // },
        // {
        //   modul_url: {
        //     contains: search,
        //   }
        // },
        // {
        //   modul_simbol: {
        //     contains: search,
        //   }
        // },
        // {
        //   modul_akses: {
        //     in: Object.values(moduls_modul_akses).filter(s =>
        //       s.toLowerCase().includes(search)
        //     ),
        //   }
        // },

      // ]
    }

    const data = await prisma.users.findMany({
      take: take,
      skip: skip,
      where: whereClause,
    });

    const serializedData = data.map((item: any) => ({
      ...item,
      id: item.id.toString() // Convert BigInt to string,

    }));

    const dataCount = await prisma.users.count({
      where: whereClause,
    });


    return new Response(JSON.stringify({
      message: "Route is working",
      data: serializedData,
      total: dataCount
    }), {
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
