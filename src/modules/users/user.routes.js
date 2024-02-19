"use strict";

import express from "express";
import { deleteAccount, forgetPassword, getProfileData, getRecoveryEmailAccounts, getUserData, resetPassword, updateAccount } from "./user.controller.js";
import { validation } from "../../middleware/validation.js";
import { forgetPasswordVal, paramsIdVal, recoveryEmailVal, resetPasswordVal, updateAccVal } from "./user.validation.js";
import { checkEmail } from "../../middleware/checkEmailExist.js";
import { auth } from "../../middleware/auth.js";

const userRouter = express.Router();

userRouter
  .route("/")
  .get(validation(recoveryEmailVal), getRecoveryEmailAccounts); // Recovery Email Account

userRouter
  .route("/:id")
  .put(validation(updateAccVal), auth, checkEmail, updateAccount) // Update Account
  .delete(validation(paramsIdVal), auth, deleteAccount) // Delete Account
  .get(validation(paramsIdVal), auth, getUserData); // Get user data

userRouter
  .route("/profile/:id")
  .get(validation(paramsIdVal), getProfileData); // Get profile data for another user

userRouter
  .route("/forget-password")
  .post(validation(forgetPasswordVal), forgetPassword); // Forget password

userRouter
  .route("/reset-password")
  .patch(validation(resetPasswordVal), resetPassword); // Reset Password

export default userRouter;
