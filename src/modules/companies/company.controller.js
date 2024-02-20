"use strict";

import { companyModel } from "../../../database/models/companies.model.js";
import { jobModel } from "../../../database/models/jobs.model.js";
import { catchError } from "../../middleware/catchError.js";
import { appError } from "../../utils/appError.js";

// Add Company
export const addCompany = catchError(async (req, res, next) => {
  let { companyName, description, industry, street, city, min, address, max, numberOfEmployees, companyEmail } = req.body;
  numberOfEmployees = min + "-" + max;
  address = "st." + street + ", " + city;
  const companyHR = req.user._id
  const company = new companyModel(
    { companyName, description, industry, street, city, address, numberOfEmployees, companyEmail, companyHR }
  );
  await company.save();
  res.status(200).json({ message: "success" });
});

// Update Company Data by CompanyHR
export const updateCompanyData = catchError(async (req, res, next) => {
  const company = await companyModel.findById(req.params.id);
  if (!company) return next(new appError("No company found", 404));
  if (String(company.companyHR) != String(req.user._id)) return next(new appError("Unauthorized!", 401));
  await companyModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json({ message: "success" });
});

// Delete company by CompanyHR
export const deleteCompany = catchError(async (req, res, next) => {
  const company = await companyModel.findById(req.params.id);
  if (!company) return next(new appError("No company found", 404));
  if (String(company.companyHR) != String(req.user._id)) return next(new appError("Unauthorized!", 401));
  await companyModel.findByIdAndDelete(req.params.id, req.body, { new: true });
  res.status(200).json({ message: "success" });
});

// Get company data
export const getCompanyData = catchError(async (req, res, next) => {
  const company = await companyModel.findById(req.params.id);
  if (!company) return next(new appError("No company found", 404));
  const jobs = await jobModel.find({ addedBy: company.companyHR });
  res.status(200).json({ message: "success", data: jobs });
});

// Search for a company with a name
export const searchCompanyName = catchError(async (req, res, next) => {
  const { companyName } = req.body;
  const company = await companyModel.findOne({ companyName: companyName });
  !company && next(new appError("No company found", 404));
  company && res.status(200).json({ message: "success", company: { companyName, industry: company.industry,
    address: company.address, numberOfEmployees: company.numberOfEmployees, companyEmail: company.companyEmail,
    description: company.description }
  });
});