"use strict";

import Joi from "joi";

// Update Account
export const addCompanyVal = Joi.object({
  companyName: Joi.string().min(3).max(30).required(),
  description: Joi.string().min(3).max(300).required(),
  industry: Joi.string().min(3).max(100).required(),
  street: Joi.string().min(3).max(20).trim().required(),
  city: Joi.string().min(3).max(15).required(),
  min: Joi.string().pattern(/^[0-9]+$/).required(),
  max: Joi.string().pattern(/^[0-9]+$/).required(),
  companyEmail: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }).required(),
});

// update company 
export const updateCompanyDataVal = Joi.object({
  id: Joi.string().hex().length(24).required(),
  companyName: Joi.string().min(3).max(30),
  description: Joi.string().min(3).max(300),
  industry: Joi.string().min(3).max(100),
  street: Joi.string().min(3).max(20).trim(),
  city: Joi.string().min(3).max(15),
  min: Joi.string().pattern(/^[0-9]+$/),
  max: Joi.string().pattern(/^[0-9]+$/),
  companyEmail: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
});

// Params Validation
export const paramsIdaVal = Joi.object({
  id: Joi.string().hex().length(24).required()
});

// Search Company Name
export const searchCompanyNameVal = Joi.object({
  companyName: Joi.string().min(3).max(30).required(),
});