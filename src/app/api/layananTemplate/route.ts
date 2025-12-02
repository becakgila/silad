import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma'
import uploadFile from "@/helpher/uploadFile";
import deleteFile from "@/helpher/deleteFile";


export async function GET(req: NextRequest){
    
    
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

        const formData = await req.formData()

        const layanan_id = formData.get("layanan_id");
        const prodi = formData.get("template_prodi") as File
        const fakultas = formData.get("template_fakultas") as File
        const rektorat = formData.get("template_rektorat") as File

        const dataInput = []

        dataInput.push({
            template_name: "prodi",            
            template_url: (await uploadFile(prodi, 'layananTemplate', 'prodi')),
            layanan_id
        })


        if (fakultas) {
            dataInput.push({
                template_name: "fakultas",
                template_url: (await uploadFile(fakultas, 'layananTemplate', 'fakultas')),
                layanan_id
            })
            dataInput.push({
                template_name: "rektorat",
                template_url: (await uploadFile(rektorat, 'layananTemplate', 'rektorat')),
                layanan_id
            })
                        
        }
        
        
        const checkRes = await prisma.layanan_template.findMany({
            where: {layanan_id}            
        })        
        

        await checkRes.forEach(async (val: any)=> {
            await deleteFile(val.template_url)
        })

        const deleteRes =await prisma.layanan_template.deleteMany({
            where: {
                layanan_id
            }
        })

        const layanan_template = await prisma.layanan_template.createMany({
            data: dataInput
        })

        // console.log(layanan_template);
        
        // const serializeData = ajuanTemplate.map((val :any) => val)
        

        return NextResponse.json({
            data: [],
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