"use client";

import { Designer } from "@pdfme/ui";
import { CUSTOM_A4_PDF, type Template } from '@pdfme/common';
import { useEffect, useRef } from "react";
import getBlankTemplate from "@/helper/pdfme/BlankTemplate";
import { getPlugins } from "@/helper/pdfme/plugin";
import Button from "@/components/ui/button/Button";
import { saveTemplateToFile } from "@/actions/saveTemplate";
import { useRouter } from "next/navigation";


export default function PDFDesignerPage({ searchParams }: { searchParams: { level: string, layanan_id: string } }) {
    const designerRef = useRef<HTMLDivElement | null>(null);
    const designer = useRef<Designer | null>(null);
    const router = useRouter();
    // const { level, layanan_id } = searchParams;

    useEffect(() => {
        if (designer.current) return;
        if (!designerRef.current) return;
        designer.current = new Designer({
            domContainer: designerRef.current,
            template: getBlankTemplate(),
            options: {
            },
            plugins: getPlugins(),
        });
    }, [designerRef]);

    const onSaveTemplate = async (template?: Template) => {
        
        if (!designer.current) return

        const currentTemplate = template || designer.current.getTemplate();
        const filename = "mydata";

        try {
            const params = await searchParams;
            const { layanan_id, level } = params;
                        
            await saveTemplateToFile(filename, currentTemplate, layanan_id, level);

            const req = await fetch('/api/layananTemplate', {
                method: 'POST',
                body: JSON.stringify({
                    layanan_id,
                    template: currentTemplate,
                    level,                    
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if(req.ok){
                console.log(await req.json());
            }

        } catch (error) {
            console.error("Error saving template:", error);
        }

        console.log("Current Template:", currentTemplate);
    }

    return (
        <div className="flex flex-col">

            <div className="mb-3">
                <Button onClick={() => {
                    onSaveTemplate()
                }} variant="primary" >
                    save format
                </Button>
            </div>
            <div ref={designerRef} style={{ height: "100vh" }} />
        </div>
    )
}