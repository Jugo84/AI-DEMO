import { Router } from "express";
import z from "zod";
import "dotenv/config";

import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

const apiRouter = Router();

apiRouter.get("/", async (req, res) => {
  // bema with 83 pages
  const bema = new PDFLoader("documents/KZBV_BEMA-2023-07-01.pdf", {
    splitPages: false,
  });
  // Load the PDF document
  const pdfDocuments = await bema.load();

  // Create a vector store
  const vectorStore = new MemoryVectorStore(
    new OpenAIEmbeddings({
      apiKey: process.env.OPENAI_API_KEY,
    })
  );

  // Define the number of pages to process in each batch
  const batchSize = 2; // Adjust this based on your testing
  const results = [];

  // Process the document in batches
  for (let i = 0; i < pdfDocuments.length; i += batchSize) {
    const batch = pdfDocuments.slice(i, i + batchSize);
    await vectorStore.addDocuments(batch);

    // Perform similarity search on the current batch
    const batchResults = await vectorStore.similaritySearch(
      "Kieferorthopädische Behandlung",
      5
    );
    results.push(...batchResults);
  }

  res.send(results);
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
