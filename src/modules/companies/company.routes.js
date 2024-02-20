"use strict";

import express from "express";
import { validation } from "../../middleware/validation.js";
import { addCompany, deleteCompany, getCompanyData, searchCompanyName, updateCompanyData } from "./company.controller.js";
import { addCompanyVal, paramsIdaVal, searchCompanyNameVal, updateCompanyDataVal } from "./company.validation.js";
import { authorization, protectedRoutes } from "../auth/auth.controller.js";

const companyRouter = express.Router();

companyRouter
  .route("/")
  .post(protectedRoutes, authorization('User'), validation(addCompanyVal), addCompany) // Add company
  .get(protectedRoutes,authorization('User','Company_HR'), validation(searchCompanyNameVal),searchCompanyName) // Get data of a specific company by name

companyRouter
  .route("/:id")
  .put(protectedRoutes, authorization("User"), validation(updateCompanyDataVal), updateCompanyData) // Update company by id
  .delete(protectedRoutes, authorization("User"), validation(paramsIdaVal), deleteCompany) // Delete company
  .get(protectedRoutes, authorization("User"), validation(paramsIdaVal), getCompanyData)   // Get data of a specific company by id

  export default companyRouter;