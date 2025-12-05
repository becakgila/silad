"use server";

import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { Template } from "@pdfme/common";

export async function saveTemplateToFile(filename: string, template: Template, layanan_id: string, level: string) {
  try {
    const publicPath = join(process.cwd(), "public", "template", "pdf");
    
    // Create directory if it doesn't exist
    mkdirSync(publicPath, { recursive: true });
    
    const filePath = join(publicPath, `${filename}.json`);

    writeFileSync(filePath, JSON.stringify(template, null, 2));
    return { success: true, message: `Template saved to ${filePath}` };
  } catch (error) {
    console.error("Error saving template:", error);
    throw new Error("Failed to save template");
  }
}
