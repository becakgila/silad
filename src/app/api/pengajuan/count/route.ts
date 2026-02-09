import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {

    try {

        const data = await prisma.ajuan.count();

        return NextResponse.json({ count: data }, { status: 200 });
        
    } catch (error) {
        return NextResponse.json({ error: "Failed to count ajuan" }, { status: 500 });
    }

}