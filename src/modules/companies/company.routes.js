"use strict";

import express from "express";
import { validation } from "../../middleware/validation.js";
import { x } from "./company.controller.js";

const companyRouter = express.Router();

companyRouter
  .route("/")
  .get(x);

export default companyRouter;