"use strict";

import { jobModel } from "../../../database/models/jobs.model.js";
import { catchError } from "../../middleware/catchError.js";
import { appError } from "../../utils/appError.js";

// Add Job
export const addJob = catchError(async (req, res) => {
  let { jobTitle, technicalSkills, softSkills, jobLocation, workingTime, seniorityLevel, jobDescription, addedBy } = req.body;
  addedBy = req.user._id;
  const job = new jobModel({ jobTitle, technicalSkills, softSkills, jobLocation, workingTime, seniorityLevel, jobDescription, addedBy });
  await job.save();
  res.status(200).json({ message: "success" });
});

// Update Job
export const updateJob = catchError(async (req, res, next) => {
  const job = await jobModel.findByIdAndUpdate(req.params.id, req.body);
  !job && next(new appError("No job found", 404));
  job && res.status(200).json({ message: "success" });
});

// Delete Job
export const deleteJob = catchError(async (req, res, next) => {
  const job = await jobModel.findByIdAndDelete(req.params.id);
  !job && next(new appError("No job found", 404));
  job && res.status(200).json({ message: "success" });
});