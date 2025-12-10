"use client";

import { Viewer } from "@pdfme/ui";
import { type Template } from '@pdfme/common';
import { useEffect, useRef } from "react";
import { getPlugins } from "@/helper/pdfme/plugin";


export default function PDFViewerPage({ searchParams }: { searchParams: { level: string, layanan_id: string } }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const viewerRef = useRef<Viewer | null>(null);

    // Custom data for the PDF fields
    const customData = {
        // field10: JSON.stringify({ nama: 'John Doe' }),
        // field99: JSON.stringify({ nama: 'John Doe' }),
    };

    useEffect(() => {
        const initViewer = async () => {
            try {
                if (!containerRef.current) {
                    console.error('Container ref not available');
                    return;
                }

                const response = await fetch('/template/pdf/1765265101050-prodi.json');
                const template = (await response.json()) as Template;

                console.log('Template fetched:', template);

                // Destroy previous viewer
                if (viewerRef.current) {
                    viewerRef.current.destroy();
                }

                console.log('Initializing Viewer with template');
                
                // Use custom data for multiVariableText, use content for others
                const inputData: Record<string, any> = {};
                if (template.schemas && template.schemas[0]) {
                    template.schemas[0].forEach((field: any) => {
                        if (field.type === 'multiVariableText') {
                            // Use custom data for multiVariableText
                            inputData[field.name] = customData[field.name as keyof typeof customData] || field.content || '';
                        } else {
                            // Use content from template for all other types
                            inputData[field.name] = field.content || '';
                        }
                    });
                }
                
                console.log('Input data:', inputData);
                
                viewerRef.current = new Viewer({
                    domContainer: containerRef.current,
                    template,
                    inputs: [inputData],
                    plugins: getPlugins(),
                });

                console.log('Viewer initialized successfully');
            } catch (error) {
                console.error('Error initializing viewer:', error);
            }
        };

        initViewer();

        return () => {
            if (viewerRef.current) {
                viewerRef.current.destroy();
            }
        };
    }, [searchParams]);

    return (
        <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
            <div
                ref={containerRef}
                style={{
                    width: '100%',
                    height: '100%',
                    border: '1px solid red',
                    boxSizing: 'border-box',
                }}
            />
        </div>
    );
}