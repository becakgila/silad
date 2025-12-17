"use client";

import { Designer } from "@pdfme/ui";
import { CUSTOM_A4_PDF, type Template } from '@pdfme/common';
import { useEffect, useRef, useState } from "react";
import getBlankTemplate from "@/helper/pdfme/BlankTemplate";
import { getPlugins } from "@/helper/pdfme/plugin";
import Button from "@/components/ui/button/Button";
import { saveTemplateToFile } from "@/actions/saveTemplate";
import { useRouter } from "next/navigation";
import path from 'path'
import fs from "fs";
import { toast } from "react-toastify";


export default function PDFDesignerPage({ searchParams }: { searchParams: { level: string, layanan_id: string } }) {
    const designerRef = useRef<HTMLDivElement | null>(null);
    const designer = useRef<Designer | null>(null);
    const [updated, setUpdated] = useState<boolean>(false)
    const router = useRouter();


    async function fetchTemplateId() {
        try {

            const { layanan_id, level } = await searchParams;

            const designerProps = {
                domContainer: designerRef.current!,
                template: getBlankTemplate() as any,
                options: {
                },
                plugins: getPlugins(),
            }

            const req = await fetch(`/api/layananTemplate?template_name=${level}&layanan_id=${layanan_id}`);

            if (req.ok) {

                const res = await req.json();

                const data = res.data;

                if (data.length !== 0) {

                    const fetchJson = await fetch(data[0].template_url)
                    designerProps.template = await fetchJson.json()
                    setUpdated(true);

                }
            }

            designer.current = new Designer(
                designerProps
            );

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (!designerRef.current) return;

        fetchTemplateId()


    }, [designerRef]);

    const onSaveTemplate = async (template?: Template) => {

        if (!designer.current) return
        const currentTemplate = template || designer.current.getTemplate();

        try {
            const { layanan_id, level } = await searchParams;

            // await saveTemplateToFile(filename, currentTemplate, layanan_id, level);

            const req = await fetch('/api/layananTemplate', {
                method: updated ? 'PATCH' : 'POST',
                body: JSON.stringify({
                    layanan_id,
                    template: currentTemplate,
                    level,
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log(req?.ok);
            
            
            if (req?.ok) {
                console.log('Template saved successfully');
                toast("Template saved successfully!");   
                // toast.info("Returning to previous page...");             
            }

        } catch (error) {
            console.error("Error saving template:", error);
        }

        // console.log("Current Template:", currentTemplate);
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