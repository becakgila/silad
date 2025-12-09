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

    // useEffect(() => {
    //         if (!viewerRef.current) return;                    

    //         const previewProps : PreviewProps = {
    //             domContainer: viewerRef.current!,
    //             template: template || getBlankTemplate(),
    //             plugins: getPlugins(),
    //             options: {
    //             },
    //             inputs: [{
    //                 name : "John Doe",
    //                 id: "name_1"

    //             }],
    //         }

    //         console.log(previewProps, "ini preview props");

    //         viewer.current = new Viewer(
    //            previewProps
    //         );

    //     }, [viewerRef, template, inputs]);

    async function testFetch() {
        try {
            if (!viewerRef.current) return;

            const res = await fetch("/template/pdf/1765262513780-prodi.json")

            if (!res.ok) {
                throw new Error(`Failed to fetch template: ${res.status}`);
            }

            const rawTemplate = await res.json()

            if (viewerRef.current) {
                viewer.current = new Viewer({
                    domContainer: viewerRef.current,
                    template: rawTemplate,
                    inputs: [{}],
                    options: { },
                    plugins: getPlugins(),
                });
            }
        

        console.log("Viewer initialized successfully");

    } catch (error) {
        console.error("Error loading template:", error);
    }
}

useEffect(() => {

    testFetch();



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