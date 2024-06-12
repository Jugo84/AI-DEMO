import { Router } from "express";
import fs from "fs";

import { PDFLoader } from "langchain/document_loaders/fs/pdf";

// **** Variables **** //

const apiRouter = Router();

// @eslint-ignore-next-line
apiRouter.get("/", async (req, res) => {
  const bema = new PDFLoader("documents/bema.pdf", {
    splitPages: false,
  });

  await new Promise((resolve) => {
    setTimeout(resolve, 2000);
  });

  res.send("Hello World!");
});

// **** Export default **** //

export default apiRouter;
