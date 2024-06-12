import { Router } from "express";
import fs from "fs";

// **** Variables **** //

const apiRouter = Router();

apiRouter.get("/", async (req, res) => {
  const bemaFile = fs.readFileSync("./documents/bema.pdf", "utf8");
  const goäFile = fs.readFileSync("./documents/goä.pdf", "utf8");
  const gozFile = fs.readFileSync("./documents/goz.pdf", "utf8");

  res.send("Hello World!");
});

// **** Export default **** //

export default apiRouter;
