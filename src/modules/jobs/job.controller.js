"use strict";

import { applicationModel } from "../../../database/models/applications.model.js";
import { companyModel } from "../../../database/models/companies.model.js";
import { jobModel } from "../../../database/models/jobs.model.js";
import { catchError } from "../../middleware/catchError.js";
import { appError } from "../../utils/appError.js";
import { v2 as cloudinary } from "cloudinary";

// Add Job
export const addJob = catchError(async (req, res, next) => {
  try {
    let { jobTitle, technicalSkills, softSkills, jobLocation, workingTime, seniorityLevel, jobDescription, addedBy } = req.body;
    const company = await companyModel.findOne({ companyHR: req.user._id });
    if (!company) return next(new appError("You are not authorized to perform this action", 401));
    addedBy = company._id;
    const job = new jobModel({ jobTitle, technicalSkills, softSkills, jobLocation, workingTime, seniorityLevel, jobDescription, addedBy });
    await job.save();
    res.status(200).json({ message: "success" });
  } catch (e) {
    res.status(500).json({ message: `Error in server: ${e}` });
  }
});

// Update Job
export const updateJob = catchError(async (req, res, next) => {
  try {
    const job = await jobModel.findByIdAndUpdate(req.params.id, req.body);
    !job && next(new appError("No job found", 404));
    job && res.status(201).json({ message: "success" });
  } catch (e) {
    res.status(500).json({ message: `Error in server: ${e}` });
  }
});

// Delete Job
export const deleteJob = catchError(async (req, res, next) => {
  try {
    const job = await jobModel.findByIdAndDelete(req.params.id);
    !job && next(new appError("No job found", 404));
    job && res.status(200).json({ message: "success" });
  } catch (e) {
    res.status(500).json({ message: `Error in server: ${e}` });
  }
});

// Get all Jobs with their company’s information
export const getAllJobsWithCompanyInfo = catchError(async (req, res) => {
  try {
    const jobs = await jobModel.find({}).populate('addedBy', '-_id -companyHR -__v');
    res.status(200).json({ data: jobs });
  } catch (e) {
    res.status(500).json({ message: `Error in server: ${e}` });
  }
});

// Get all Jobs for a specific company
export const getJobsByCompanyName = catchError(async (req, res, next) => {
  try {
    const { companyName } = req.query;
    const company = await companyModel.findOne({ companyName });
    if (!company) return next(new appError("Company not found", 404));
    const jobs = await jobModel.find({ addedBy: company._id }, '-_id -createdAt -updatedAt -__v')
      .populate('addedBy', '-_id -companyHR -__v -createdAt -updatedAt');
    !jobs.length && next(new appError("Jobs not found", 404));
    jobs.length && res.status(200).json({ message: "success", jobs });
  } catch (e) {
    res.status(500).json({ message: `Error in server: ${e}` });
  }
});

// Get all Jobs that match the following filters
export const jobsFilter = catchError(async (req, res, next) => {
  try {
    let filterObject = { ...req.body };
    const jobs = await jobModel.find(filterObject, '-_id -addedBy -__v');
    !jobs.length && next(new appError("No matching jobs found", 404));
    jobs.length && res.status(200).json({ message: "success", jobs });
  } catch (e) {
    res.status(500).json({ message: `Error in server: ${e}` });
  }
});

// Apply to jobs
export const applyToJob = catchError(async (req, res, next) => {
  try {
    const { userTechSkills, userSoftSkills, _id } = req.user;
    const result = await cloudinary.uploader.upload(req.file.path);
    const job = await jobModel.findById(req.query._id);
    if (!job) return next(new appError("Job not found", 404));
    const resume = new applicationModel({
      userTechSkills, userSoftSkills, userResume: result.secure_url, userId: _id, jobId: job._id,
    });
    resume.save();
    res.status(200).json({ message: "success" });
  } catch (e) {
    res.status(500).json({ message: `Error in server: ${e}` });
  }
});