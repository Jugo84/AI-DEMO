import { Router } from "express";
import fs from "fs";
import pdfjs from "pdfjs";

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

// **** Variables **** //

const apiRouter = Router();

// @eslint-ignore-next-line
apiRouter.get("/", async (req, res) => {
  // 83 pages
  const bema = new PDFLoader("documents/KZBV_BEMA-2023-07-01.pdf", {
    splitPages: false,
  });
  const pdf = await bema.load();
  res.send(pdf.map((page) => page.pageContent));
});

export default apiRouter;
