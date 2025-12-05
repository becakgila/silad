import { CUSTOM_A4_PDF, Template } from "@pdfme/common";

 const getBlankTemplate = () =>
  ({
    schemas: [{}],
    basePdf: CUSTOM_A4_PDF,
  } as Template);

export default getBlankTemplate;
