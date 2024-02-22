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
  userTechSkills: Joi.array().items(Joi.string().required()).required(),
  userSoftSkills: Joi.array().items(Joi.string().required()).required(),
  role: Joi.string().valid('User', 'Company_HR'),
});

// Signin
export const signinVal = Joi.object({
  emailOrMobile: Joi.alternatives().try(
    Joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
    Joi.string().pattern(/^(011|012|015)[0-9]{8}$/),
  ),
  password: Joi.string().pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/).required(),
});

// Update password
export const updatePasswordVal = Joi.object({
  oldPassword: Joi.string().pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/).required(),
  newPassword: Joi.string().pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/).required(),
  reNewPassword: Joi.string().valid(Joi.ref("newPassword")).required(),
});