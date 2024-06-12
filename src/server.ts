/**
 * Setup express server.
 */

import express from "express";

import BaseRouter from "@src/routes";
// **** Variables **** //

const app = express();

// **** Setup **** //

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add APIs, must be after middleware
app.use(BaseRouter);

// **** Export default **** //

export default app;
