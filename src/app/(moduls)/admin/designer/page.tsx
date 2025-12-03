"use client";

import { Designer } from "@pdfme/ui";
import { CUSTOM_A4_PDF, type Template } from '@pdfme/common';
import { useEffect, useRef } from "react";
import getBlankTemplate from "@/helper/pdfme/BlankTemplate";
import { getPlugins } from "@/helper/pdfme/plugin";
import Button from "@/components/ui/button/Button";




export default function PDFDesignerPage() {
    const designerRef = useRef<HTMLDivElement | null>(null);
    const designer = useRef<Designer | null>(null);

    useEffect(() => {
        if (!designerRef.current) return;

        const template: Template = getBlankTemplate()

        new Designer({
            domContainer: designerRef.current,
            template,
            options: {

            },
            plugins: getPlugins(),
        });
    }, []);

    const onSaveTemplate = (template?: Template) => {
        if (!designer.current) return
    }

    return (
        <div className="flex flex-col">
        
            <div className="mb-3">
                <Button variant="primary" >
                    save format
                </Button>
            </div>
            <div ref={designerRef} style={{ height: "100vh" }} />
        </div>
    )
}