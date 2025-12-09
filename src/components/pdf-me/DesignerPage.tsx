import { useEffect, useRef } from "react";
import Button from "../ui/button/Button";
import getBlankTemplate from "@/helper/pdfme/BlankTemplate";
import { getPlugins } from "@/helper/pdfme/plugin";
import { Designer } from "@pdfme/ui";
import { de } from "zod/v4/locales";
import { DesignerProps } from "@pdfme/common";

interface DesignerPageProps {
    template?: any;
}

export default function DesignerPage({
    template,
} : DesignerPageProps) {

    const designerRef = useRef<HTMLDivElement | null>(null);
    const designer = useRef<Designer | null>(null);

    useEffect(() => {
            if (!designerRef.current) return;

            const designerPropsFinal = {
                domContainer: designerRef.current!,
                template: template || getBlankTemplate(),
                options: {
                },
                plugins: getPlugins(),                
            }

            designer.current = new Designer(
                designerPropsFinal
            );
    
        }, [designerRef, template]);

    return (
        <div>
            <div className="mb-3">
                <Button onClick={() => {
                    // onSaveTemplate()
                }} variant="primary" >
                    save format
                </Button>
            </div>
            <div ref={designerRef} style={{ height: "100%" }} />
        </div>
    )
}