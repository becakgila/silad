import { useEffect, useRef, useState } from "react";
import Button from "../ui/button/Button";
import getBlankTemplate from "@/helper/pdfme/BlankTemplate";
import { getPlugins } from "@/helper/pdfme/plugin";
import { Designer, Viewer } from "@pdfme/ui";
import { de } from "zod/v4/locales";
import { DesignerProps, PreviewProps, Template } from "@pdfme/common";

interface ViewerPdfmeProps {
    template?: Template;
    inputs?: Record<string, string>[];
}

export default function ViewerPdfme({
    template,
    inputs,
}: ViewerPdfmeProps) {

    const viewerRef = useRef<HTMLDivElement | null>(null);
    const viewer = useRef<Viewer | null>(null);

    const customData = {
        field10: JSON.stringify({ nama: 'John Doe' }),
    };    

    const initViewer = async () => {
        try {
            if (!viewerRef.current) {
                console.error('Container ref not available');
                return;
            }

            const response = await fetch('/template/pdf/1765265101050-prodi.json');
            const template = (await response.json()) as Template;

            console.log('Template fetched:', template);

            // Destroy previous viewer
            if (viewer.current) {
                viewer.current.destroy();
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

            viewer.current = new Viewer({
                domContainer: viewerRef.current,
                template,
                inputs: [inputData],
                plugins: getPlugins(),
            });

            console.log('Viewer initialized successfully');
        } catch (error) {
            console.error('Error initializing viewer:', error);
        }
    };

    useEffect(() => {        

        initViewer();

        return () => {
            if (viewer.current) {
                viewer.current.destroy();
            }
        };

    }, [viewerRef]);

    useEffect(() => {


        return () => {
            // Cleanup
            if (viewer.current) {
                try {
                    (viewer.current as any).destroy?.();
                } catch (e) {
                    console.warn("Error during cleanup:", e);
                }
                viewer.current = null;
            }
        };
    }, [inputs]);

    return (
        <div>
            <div ref={viewerRef} style={{ height: "100vh" }} />
        </div>
    )
}