import { Router } from "express";
import z from "zod";

import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

const apiRouter = Router();

apiRouter.get("/", async (req, res) => {
  // bema with 83 pages
  const bema = new PDFLoader("documents/KZBV_BEMA-2023-07-01.pdf", {
    splitPages: false,
  });
  const pdfDocuments = await bema.load();

  const vectorStore = await MemoryVectorStore.fromDocuments(
    pdfDocuments,
    new OpenAIEmbeddings({
      apiKey: process.env.OPENAI_API_KEY,
    })
  );

  const result = await vectorStore.similaritySearch(
    "Kieferorthopädische Behandlung",
    5
  );

  res.send(result);
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

const responseSchema = z.array(treatmentSchema);

//const initialParser = StructuredOutputParser.fromZodSchema(responseSchema);

export default apiRouter;
