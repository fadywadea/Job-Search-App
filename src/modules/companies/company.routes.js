"use strict";

import express from "express";
import { validation } from "../../middleware/validation.js";
import { addCompany, deleteCompany, getAllApplicationsForJob, getCompanyData, searchCompanyName, updateCompanyData } from "./company.controller.js";
import { addCompanyVal, getJobApplicationsVal, paramsIdaVal, searchCompanyNameVal, updateCompanyDataVal } from "./company.validation.js";
import { authorization, protectedRoutes } from "../auth/auth.controller.js";

const companyRouter = express.Router();

companyRouter.route("/")
  .post(protectedRoutes, authorization('Company_HR'), validation(addCompanyVal), addCompany)
  .get(protectedRoutes, authorization('User', 'Company_HR'), validation(searchCompanyNameVal), searchCompanyName);

  companyRouter.route("/fady")
  .get(validation(getJobApplicationsVal), protectedRoutes, authorization("Company_HR"), getAllApplicationsForJob);

companyRouter.route("/:id")
  .put(protectedRoutes, authorization("Company_HR"), validation(updateCompanyDataVal), updateCompanyData)
  .delete(protectedRoutes, authorization("Company_HR"), validation(paramsIdaVal), deleteCompany)
  .get(protectedRoutes, authorization("Company_HR"), validation(paramsIdaVal), getCompanyData);

export default companyRouter;