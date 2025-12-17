import { useEffect, useRef } from "react";
import { getPlugins } from "@/helper/pdfme/plugin";
import {  Viewer } from "@pdfme/ui";

import { Template } from "@pdfme/common";
import Button from "../ui/button/Button";
import { generate } from '@pdfme/generator';

import { mahasiswa } from "@/generated/prisma";
import mahasiswaType from "@/types/model/mahasiswa";

interface ViewerPdfmeProps {
    template: string;
    inputs?: Record<string, string>[];
    mahasiswa?: mahasiswaType;
}

export default function ViewerPdfme({
    template,
    inputs,
    mahasiswa
    
}: ViewerPdfmeProps) {

    const viewerRef = useRef<HTMLDivElement | null>(null);
    const viewer = useRef<Viewer | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const customData = {
        nama : mahasiswa?.nama,
        nim : mahasiswa?.nim,
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

            // Create a File object from the PDF
            const pdfBlob = new Blob([pdf], { type: 'application/pdf' });
            const pdfFile = new File([pdfBlob], `${mahasiswa?.nim || 'document'}.pdf`, { type: 'application/pdf' });
            
            // Create a DataTransfer object and set it to the file input
            if (inputRef.current) {
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(pdfFile);
                inputRef.current.files = dataTransfer.files;
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
            <input type="file" className="hidden" name="file" ref={inputRef} />
        </div>
    )
}