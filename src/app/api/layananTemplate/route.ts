import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma'


export async function POST(req: NextRequest) {

    try {

        const formData = await req.formData()

        const layanan_id = formData.get("layanan_id");

        const dataInput = []

        dataInput.push({
            template_name: "prodi",
            template_url: "",
            layanan_id
        })


        if (formData.get("template_fakultas")) {
            dataInput.push({
                template_name: "fakultas",
                template_url: "",
                layanan_id
            })
            dataInput.push({
                template_name: "rektorat",
                template_url: "",
                layanan_id
            })
        }



        const ajuanTemplate = prisma.ajuan_template.createMany({
            data: [

            ]
        })



        return NextResponse.json({
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