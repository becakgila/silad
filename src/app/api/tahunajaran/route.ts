import { tahun_ajaran_semester } from '@/generated/prisma';
import prisma from '@/lib/prisma'
import { NextRequest } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const test = [tahun_ajaran_semester.gasal, tahun_ajaran_semester.genap];
    const search = searchParams.get("search")?.trim() || "";
    const take = Number(searchParams.get("take")) || 10;
    const page = Number(searchParams.get("page")) || 1;
    const skip = (page - 1) * take;

    const semesterSearch = test.filter((t) => t.includes(search));

    // 🧩 Detect US-style date: MM/DD/YYYY or MM-DD-YYYY
    const usDateRegex = /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/;
    let mysqlDateLike = `%${search}%`;

    const match = search.match(usDateRegex);
    if (match) {
      const [, month, day, year] = match;
      // Convert MM/DD/YYYY → YYYY-MM-DD
      const formatted = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      mysqlDateLike = `%${formatted}%`;
      console.log("Converted search date:", mysqlDateLike);
    }

    // 🧱 Build dynamic WHERE clause
    const semesterClause =
      semesterSearch.length > 0
        ? `OR semester IN (${semesterSearch.map(() => "?").join(", ")})`
        : "";

    const whereClause = `
      WHERE
        tahun_awal LIKE ? OR
        tahun_akhir LIKE ? OR
        CAST(start_date AS CHAR) LIKE ? OR
        CAST(end_date AS CHAR) LIKE ?
        ${semesterClause}
    `;

    const params = [
      `%${search}%`,
      `%${search}%`,
      mysqlDateLike,
      mysqlDateLike,
      ...semesterSearch,
    ];

    // 🧮 Count
    const countResult: any = await prisma.$queryRawUnsafe(
      `SELECT COUNT(*) AS total FROM tahun_ajaran ${whereClause}`,
      ...params
    );
    const total = countResult?.[0]?.total || 0;

    // 📦 Data
    const data: any = await prisma.$queryRawUnsafe(
      `
      SELECT *
      FROM tahun_ajaran
      ${whereClause}
      ORDER BY start_date DESC
      LIMIT ? OFFSET ?
      `,
      ...params,
      take,
      skip
    );

    const serializedData = data.map((item: any) => ({
      ...item,
      tahun_ajaran_id: item.tahun_ajaran_id.toString(),
    }));

    return new Response(
      JSON.stringify({
        message: "Route is working",
        total : Number(total),
        data: serializedData,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error fetching tahun_ajaran:", error);
    return new Response(
      JSON.stringify({ message: String(error) }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}




export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();

     
    const check = await prisma.tahun_ajaran.findFirst({
      where: { 
        tahun_awal: body.tahun_awal, 
        tahun_akhir: body.tahun_akhir, 
        semester: body.semester 
      }
    })

    console.log(check, body);
    

    if (check) {
      return new Response(JSON.stringify({ message: "Tahun Ajaran sudah ada di database" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }



    const addData = await prisma.tahun_ajaran.create({
      data: {
        tahun_awal: "0000",
        tahun_akhir: "0000",        
        semester: "gasal",
        start_date: "0000-00-00",
        end_date: "0000-00-00",
        created_at: new Date(),
        updated_at: new Date(),
        ...body
      }
    });

    const serializedModul = {
      ...addData,
      tahun_ajaran_id: addData.tahun_ajaran_id.toString()
    };    



    return new Response(JSON.stringify({
      message: "Data added successfully",
      data: serializedModul
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {

      console.log(error);

      return new Response(JSON.stringify({ message: "Error added data", error: error.message }), {
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