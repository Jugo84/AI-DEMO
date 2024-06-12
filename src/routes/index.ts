import { Router } from "express";
import fs from "fs";

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

// **** Variables **** //

const apiRouter = Router();

apiRouter.get("/", async (req, res) => {
  // 83 pages
  const bema = new PDFLoader("documents/bema.pdf", {
    splitPages: false,
  })
  const pdf = await bema.load()
  res.send(pdf.map((page) => page.pageContent))
})

export default apiRouter;
