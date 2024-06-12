import { Router } from "express";
import z from "zod";

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

// **** Variables **** //

const apiRouter = Router();

apiRouter.get("/", async (req, res) => {
  // 83 pages
  const bema = new PDFLoader("documents/KZBV_BEMA-2023-07-01.pdf", {
    splitPages: false,
  });
  const pdf = await bema.load();
  res.send(pdf.map((page) => page.pageContent));
});

const treatmentSchema = z.object({
  title: z.string({ description: "Name of the treatment" }),
  treatmentNumber: z.string({ description: "Number or id of the treatment" }),
  description: z
    .string({ description: "Description of the treatment" })
    .optional()
    .nullable(),
  combinableTreatmentNumbers: z
    .string({
      description:
        "Treatment number or ids of the potential combineable treatments",
    })
    .array(),
  nonCombinableTreatmentNumbers: z
    .string({
      description: "Treatment number or ids of the non-combineable treatments",
    })
    .array(),
});

const categorySchema = z.object({
  treatments: z.array(treatmentSchema),
});
const responseSchema = z.array(categorySchema);

//const initialParser = StructuredOutputParser.fromZodSchema(responseSchema);

export default apiRouter;
