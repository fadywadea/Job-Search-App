"use strict";

import express from "express";
import { addJobVal, applyToJobVal, deleteJobVal, getAllJobsWithCompanyInfoVal, getJobsByCompanyNameVal, jobsFilterVal, updateJobVal } from "./job.validation.js";
import { validation } from "../../middleware/validation.js";
import { addJob, applyToJob, deleteJob, getAllJobsWithCompanyInfo, getJobsByCompanyName, jobsFilter, updateJob } from "./job.controller.js";
import { authorization, protectedRoutes } from "../auth/auth.controller.js";
import { uploadSingleFile } from "../../services/fileUploads/uploads.js";

const jobRouter = express.Router();

jobRouter.route("/")
  .post(protectedRoutes, authorization('User'), validation(addJobVal), addJob)
  .get(protectedRoutes, authorization('User', 'Company_HR'), validation(getAllJobsWithCompanyInfoVal),
    getAllJobsWithCompanyInfo);

jobRouter.route("/:id")
  .put(protectedRoutes, authorization('User'), validation(updateJobVal), updateJob)
  .delete(protectedRoutes, authorization('User'), validation(deleteJobVal), deleteJob);

jobRouter.route("/specific-company")
  .get(protectedRoutes, validation(getJobsByCompanyNameVal), authorization('User'), getJobsByCompanyName);
jobRouter.route("/filter")
  .get(protectedRoutes, authorization('User', 'Company_HR'), validation(jobsFilterVal), jobsFilter);

jobRouter.route("/apply")
  .post(protectedRoutes, authorization('User'), uploadSingleFile("pdf"), validation(applyToJobVal), applyToJob);

export default jobRouter;