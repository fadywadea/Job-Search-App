"use strict";

import { companyModel } from "../../../database/models/companies.model.js";
import { catchError } from "../../middleware/catchError.js";

export const x = catchError(async (req, res, next) => {
  const company = await companyModel.find();
  res.json({ message: "success" });
});