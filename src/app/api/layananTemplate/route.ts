import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma'
import { writeFile, mkdir } from "fs";
import { join } from "path";
import { Template } from "@pdfme/common";


export async function GET(req: NextRequest) {

    try {

        const params = Object.fromEntries(req.nextUrl.searchParams.entries());

        console.log(params);


        const data = await prisma.layanan_template.findMany({
            where: params
        })

        return NextResponse.json({
            data: data,
            messages: "success mengambil data layanan template"
        })

    } catch (error) {
        const err = error as Error;

        console.log(err.message)

        return NextResponse.json({
            messages: "error dalam mengambil data layanan template!!!"
        },
            {
                status: 500
            }
        )
    }


}

export async function POST(req: NextRequest) {

    try {

        const body = await req.json();

        const { layanan_id, template, level } = body;        

        const publicPath = join(process.cwd(), "public", "template", "pdf");

        // Create directory if it doesn't exist
        await mkdir(publicPath, { recursive: true }, ()=>{});
        const filename = `${Date.now()}-${level}.json`;

        const filePath = join(publicPath, filename);

        const savedRelativePath = `/template/pdf/${filename}`;

        await writeFile(filePath, JSON.stringify(template, null, 2), ()=>{});

        const data = await prisma.layanan_template.create({
            data: {
                layanan_id,
                template_name: level,
                template_url : savedRelativePath,
            }
        })

        return NextResponse.json({
            data,
            message: "POST Layanan Template Berhasil!!!"
        })
    } catch (error) {
        const err = error as Error;

        console.log(err.message)

        return NextResponse.json({
            messages: "error dalam mengupload file layanan template!!!"
        },
            {
                status: 500
            }
        )
    }
}