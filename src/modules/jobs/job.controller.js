"use strict";

import { companyModel } from "../../../database/models/companies.model.js";
import { jobModel } from "../../../database/models/jobs.model.js";
import { catchError } from "../../middleware/catchError.js";
import { appError } from "../../utils/appError.js";

// Add Job
export const addJob = catchError(async (req, res, next) => {
  let { jobTitle, technicalSkills, softSkills, jobLocation, workingTime, seniorityLevel, jobDescription, addedBy } = req.body;
  const company = await companyModel.findOne({ companyHR: req.user._id });
  if (!company) return next(new appError("You are not authorized to perform this action", 401));
  addedBy = company._id;
  const job = new jobModel({ jobTitle, technicalSkills, softSkills, jobLocation, workingTime, seniorityLevel, jobDescription, addedBy });
  await job.save();
  res.status(200).json({ message: "success" });
});

// Update Job
export const updateJob = catchError(async (req, res, next) => {
  const job = await jobModel.findByIdAndUpdate(req.params.id, req.body);
  !job && next(new appError("No job found", 404));
  job && res.status(201).json({ message: "success" });
});

// Delete Job
export const deleteJob = catchError(async (req, res, next) => {
  const job = await jobModel.findByIdAndDelete(req.params.id);
  !job && next(new appError("No job found", 404));
  job && res.status(200).json({ message: "success" });
});

// Get all Jobs with their company’s information
export const getAllJobsWithCompanyInfo = catchError(async (req, res) => {
  const jobs = await jobModel.find({}).populate('addedBy', '-_id -companyHR -__v');
  res.status(200).json({ data: jobs });
});

// Get all Jobs for a specific company
export const getJobsByCompanyName = catchError(async (req, res, next) => {
  const { companyName } = req.query;
  const company = await companyModel.findOne({ companyName });
  if (!company) return next(new appError("Company not found", 404));
  const jobs = await jobModel.find({ addedBy: company._id }, '-_id -createdAt -updatedAt -__v')
    .populate('addedBy', '-_id -companyHR -__v -createdAt -updatedAt');
  !jobs.length && next(new appError("Jobs not found", 404));
  jobs.length && res.status(200).json({ message: "success", jobs });
});

// Get all Jobs that match the following filters
export const jobsFilter = catchError(async (req, res, next) => {
  let filterObject = { ...req.body };
  const jobs = await jobModel.find(filterObject,'-_id -addedBy -__v');
  !jobs.length && next(new appError("No matching jobs found", 404));
  jobs.length && res.status(200).json({ message: "success", jobs });
});