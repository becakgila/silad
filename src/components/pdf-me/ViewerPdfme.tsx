import { useEffect, useRef } from "react";
import { getPlugins } from "@/helper/pdfme/plugin";
import {  Viewer } from "@pdfme/ui";

import { Template } from "@pdfme/common";
import Button from "../ui/button/Button";
import { generate } from '@pdfme/generator';

interface ViewerPdfmeProps {
    template: string;
    inputs?: Record<string, string>[];
    nama:  string
}

export default function ViewerPdfme({
    template,
    inputs,
    nama
    
}: ViewerPdfmeProps) {

    const viewerRef = useRef<HTMLDivElement | null>(null);
    const viewer = useRef<Viewer | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const customData = {
        nama,
    };        

    const initViewer = async () => {
        try {
            if (!viewerRef.current) {
                console.error('Container ref not available');
                return;
            }

            const response = await fetch(template);
            const templateRes = (await response.json()) as Template;        
            
            if (viewer.current) {
                viewer.current.destroy();
            }

            const inputData: Record<string, any> = {};
            if (templateRes.schemas && templateRes.schemas[0]) {
                                
                templateRes.schemas[0].forEach((field: any) => {                    

                    if (field.type === 'multiVariableText') {     

                        inputData[field.name] = customData[field.name as keyof typeof customData] || field.content || '';
                    } else {                                           
                        
                        inputData[field.name] = customData[field.name as keyof typeof customData] || field.content || '';
                    }
                });
            }

            viewer.current = new Viewer({
                domContainer: viewerRef.current,
                template: templateRes,
                inputs: [inputData],
                plugins: getPlugins(),
            });
            const pdf = await generate({                
                template: templateRes,
                inputs: [inputData],
                plugins: getPlugins(),
            });

            // Convert PDF buffer to base64
            const binary = String.fromCharCode.apply(null, Array.from(pdf));
            const base64 = btoa(binary);
            
            // Store in hidden input
            if (inputRef.current) {
                inputRef.current.value = base64;
            }

            console.log('Viewer initialized successfully');
        } catch (error) {

            console.error('Error initializing viewer:', error);
        }
    };

    useEffect(() => {        

        if (!template) return;

        initViewer();
        return () => {
            if (viewer.current) {
                viewer.current.destroy();
            }
        };
    }, [viewerRef, template]);    

    return (
        <div>
            <div ref={viewerRef} style={{ height: "480px" }} />
            <input type="hidden" name="pdf" ref={inputRef} />
        </div>
    )
}