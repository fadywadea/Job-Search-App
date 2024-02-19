"use strict";

import Joi from "joi";

// Signup
export const signupVal = Joi.object({
  firstName: Joi.string().alphanum().min(3).max(30).required(),
  lastName: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }).required(),
  password: Joi.string().pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/).required(),
  rePassword: Joi.string().valid(Joi.ref("password")).required(),
  recoveryEmail: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
  day: Joi.number().integer().min(1).max(31).required(),
  month: Joi.number().integer().min(1).max(12).required(),
  year: Joi.number().integer().min(1990).max(2010).required(),
  mobileNumber: Joi.string().pattern(/^(011|012|015)[0-9]{8}$/).required(),
});

// Signin
export const signinVal = Joi.object({
  emailOrMobile: Joi.alternatives().try(
    Joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
    Joi.string().pattern(/^(011|012|015)[0-9]{8}$/),
  ),
  password: Joi.string().pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/).required(),
});

// Update Account
export const updateAccVal = Joi.object({
  id: Joi.string().hex().length(24).required(),
  firstName: Joi.string().alphanum().min(3).max(30),
  lastName: Joi.string().alphanum().min(3).max(30),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
  recoveryEmail: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
  day: Joi.number().integer().min(1).max(31),
  month: Joi.number().integer().min(1).max(12),
  year: Joi.number().integer().min(1990).max(2010),
  mobileNumber: Joi.string().pattern(/^(011|012|015)[0-9]{8}$/),
});

// params id
export const paramsIdVal = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

// Update password
export const updatePasswordVal = Joi.object({
  id: Joi.string().hex().length(24).required(),
  oldPassword: Joi.string().pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/).required(),
  newPassword: Joi.string().pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/).required(),
  reNewPassword: Joi.string().valid(Joi.ref("newPassword")).required(),
});

// Forget password
export const forgetPasswordVal = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }).required(),
});

// Reset Password && Validate OTP
export const resetPasswordVal = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }).required(),
  otp: Joi.string().regex(/^[0-9]+$/).required(),
  newPassword: Joi.string().pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/).required(),
  reNewPassword: Joi.string().valid(Joi.ref("newPassword")).required(),
});

// Get all accounts associated to a specific recovery Email
export const recoveryEmailVal = Joi.object({
  recoveryEmail: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }).required(),
});

