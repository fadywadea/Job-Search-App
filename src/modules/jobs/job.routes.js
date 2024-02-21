"use strict";

import express from "express";
import { addJobVal, deleteJobVal, updateJobVal } from "./job.validation.js";
import { validation } from "../../middleware/validation.js";
import { addJob, deleteJob, updateJob } from "./job.controller.js";
import { authorization, protectedRoutes } from "../auth/auth.controller.js";

const jobRouter = express.Router();

jobRouter.route("/")
  .post(protectedRoutes, authorization('User'), validation(addJobVal), addJob) // Add Job

jobRouter.route("/:id")
  .put(protectedRoutes, authorization('User'), validation(updateJobVal), updateJob) // Update Job
  .delete(protectedRoutes, authorization('User'), validation(deleteJobVal), deleteJob) // Delete Job

export default jobRouter;