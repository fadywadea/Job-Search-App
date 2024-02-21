"use strict";

import express from "express";
import { addJobVal, deleteJobVal, getAllJobsWithCompanyInfoVal, getJobsByCompanyNameVal, updateJobVal } from "./job.validation.js";
import { validation } from "../../middleware/validation.js";
import { addJob, deleteJob, getAllJobsWithCompanyInfo, getJobsByCompanyName, updateJob } from "./job.controller.js";
import { authorization, protectedRoutes } from "../auth/auth.controller.js";

const jobRouter = express.Router();

jobRouter.route("/")
  .post(protectedRoutes, authorization('User'), validation(addJobVal), addJob) // Add Job
  .get(protectedRoutes, authorization('User','Company_HR'), validation(getAllJobsWithCompanyInfoVal),
    getAllJobsWithCompanyInfo)   // Get All Jobs With Company Info

jobRouter.route("/:id")
  .put(protectedRoutes, authorization('User'), validation(updateJobVal), updateJob) // Update Job
  .delete(protectedRoutes, authorization('User'), validation(deleteJobVal), deleteJob) // Delete Job

jobRouter.route("/specific-company")
  .get(protectedRoutes, validation(getJobsByCompanyNameVal), authorization('User'), getJobsByCompanyName) // Get all Jobs for a specific company

export default jobRouter;