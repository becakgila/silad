
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {

    try {

        const year = req.nextUrl.searchParams.get('year');

        if (!year) {
            return NextResponse.json({ message: "Year parameter is required" }, { status: 400 });
        }

        const yearNumber = parseInt(year);
        const startDate = new Date(`${year}-01-01`);
        const endDate = new Date(`${year}-12-31`);

        // Get all ajuan records for the specified year
        const ajuanData = await prisma?.ajuan.findMany({
            where: {
                created_at: {
                    gte: startDate,
                    lte: endDate,
                }
            },
            select: {
                created_at: true
            }
        });

        // Initialize array with 12 months (0 counts)
        const monthlyCounts = new Array(12).fill(0);

        // Count submissions by month
        ajuanData?.forEach((item: { created_at: { getMonth: () => any; }; }) => {
            if (item.created_at) {
                const month = item.created_at.getMonth();
                monthlyCounts[month]++;
            }
        });            

        return NextResponse.json(monthlyCounts);    
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error in month route"}, { status: 500 });            
    }
}