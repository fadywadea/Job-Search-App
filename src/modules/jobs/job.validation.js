"use strict";

import Joi from "joi";

// Add job
export const addJobVal = Joi.object({
  jobTitle: Joi.string().min(3).max(30).required(),
  jobLocation: Joi.string().valid('onsite', 'remotely', 'hybrid').required(),
  workingTime: Joi.string().valid('part-time', 'full-time').required(),
  seniorityLevel: Joi.string().valid('Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO ').required(),
  jobDescription: Joi.string().min(3).max(200).required(),
  technicalSkills: Joi.array().items(Joi.string().required()).required(),
  softSkills: Joi.array().items(Joi.string().required()).required(),
});

// Update job
export const updateJobVal = Joi.object({
  id: Joi.string().hex().length(24).required(),
  jobTitle: Joi.string().min(3).max(30),
  jobLocation: Joi.string().valid('onsite', 'remotely', 'hybrid'),
  workingTime: Joi.string().valid('part-time', 'full-time'),
  seniorityLevel: Joi.string().valid('Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO '),
  jobDescription: Joi.string().min(3).max(200),
  technicalSkills: Joi.array().items(Joi.string()),
  softSkills: Joi.array().items(Joi.string()),
});

// Delete job
export const deleteJobVal = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

// Get All Jobs With Company Info
export const getAllJobsWithCompanyInfoVal = Joi.object({});

// Get all Jobs for a specific company
export const getJobsByCompanyNameVal = Joi.object({ companyName: Joi.string().min(3).max(30).required(), });

// Get all Jobs that match the following filters
export const jobsFilterVal = Joi.object({
  workingTime: Joi.string().valid('part-time', 'full-time'),
  jobLocation: Joi.string().valid('onsite', 'remotely', 'hybrid'),
  seniorityLevel: Joi.string().valid('Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO '),
  jobTitle: Joi.string().min(3).max(30),
  technicalSkills: Joi.array().items(Joi.string()),
});