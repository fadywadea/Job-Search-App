"use strict";

import { applicationModel } from "../../../database/models/applications.model.js";
import { companyModel } from "../../../database/models/companies.model.js";
import { jobModel } from "../../../database/models/jobs.model.js";
import { catchError } from "../../middleware/catchError.js";
import { appError } from "../../utils/appError.js";

// Add Company
export const addCompany = catchError(async (req, res, next) => {
  try {
    let { companyName, description, industry, street, city, min, address, max, numberOfEmployees, companyEmail } = req.body;
    numberOfEmployees = min + "-" + max;
    address = "st." + street + ", " + city;
    const companyHR = req.user._id
    const company = new companyModel(
      { companyName, description, industry, street, city, address, numberOfEmployees, companyEmail, companyHR }
    );
    await company.save();
    res.status(200).json({ message: "success" });
  } catch (e) {
    res.status(500).json({ message: `Error in server: ${e}` });
  }
});

// Update Company Data by CompanyHR
export const updateCompanyData = catchError(async (req, res, next) => {
  try {
    const company = await companyModel.findById(req.params.id);
    if (!company) return next(new appError("No company found", 404));
    if (String(company.companyHR) != String(req.user._id)) return next(new appError("Unauthorized!", 401));
    await companyModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ message: "success" });
  } catch (e) {
    res.status(500).json({ message: `Error in server: ${e}` });
  }
});

// Delete company by CompanyHR
export const deleteCompany = catchError(async (req, res, next) => {
  try {
    const company = await companyModel.findById(req.params.id);
    if (!company) return next(new appError("No company found", 404));
    if (String(company.companyHR) != String(req.user._id)) return next(new appError("Unauthorized!", 401));
    await companyModel.findByIdAndDelete(req.params.id, req.body, { new: true });
    res.status(200).json({ message: "success" });
  } catch (e) {
    res.status(500).json({ message: `Error in server: ${e}` });
  }
});

// Get company data
export const getCompanyData = catchError(async (req, res, next) => {
  try {
    const company = await companyModel.findById(req.params.id);
    if (!company) return next(new appError("No company found", 404));
    const jobs = await jobModel.find({ addedBy: company._id }).populate('addedBy', 'companyName -_id');
    res.status(200).json({ message: "success", data: jobs });
  } catch (e) {
    res.status(500).json({ message: `Error in server: ${e}` });
  }
});

// Search for a company with a name
export const searchCompanyName = catchError(async (req, res, next) => {
  try {
    const { companyName } = req.body;
    const company = await companyModel.findOne({ companyName: companyName });
    !company && next(new appError("No company found", 404));
    company && res.status(200).json({
      message: "success", company: {
        companyName, industry: company.industry,
        address: company.address, numberOfEmployees: company.numberOfEmployees, companyEmail: company.companyEmail,
        description: company.description
      }
    });
  } catch (e) {
    res.status(500).json({ message: `Error in server: ${e}` });
  }
});

// Get all applications for specific Jobs
export const getAllApplicationsForJob = catchError(async (req, res, next) => {
  try {
    const company = await companyModel.findOne({ companyHR: req.user._id });
    if (!company) return next(new appError("No company found", 404));
    const job = await jobModel.findOne({ addedBy: company._id });
    if (!job) return next(new appError("No job found", 404));
    const applications = await applicationModel.find({ jobId: job._id }, '-_id -jobId -userTechSkills -userSoftSkills -createdAt -updatedAt -__v')
      .populate('userId', '-_id -password -passwordUpdatedAt -createdAt -updatedAt -__v')
    res.status(200).json({ message: "success", applications });
  } catch (e) {
    res.status(500).json({ message: `Error in server: ${e}` });
  }
})