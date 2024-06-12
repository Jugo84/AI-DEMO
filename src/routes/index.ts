import { Router } from "express";

// **** Variables **** //

const apiRouter = Router();

apiRouter.get("/", async (req, res) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  res.send("Hello World!");
});

// **** Export default **** //

export default apiRouter;
