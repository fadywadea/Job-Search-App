"use strict";

import express from "express";
import { deleteAccount, forgetPassword, getProfileData, getRecoveryEmailAccounts, getUserData, resetPassword, updateAccount } from "./user.controller.js";
import { validation } from "../../middleware/validation.js";
import { Val, forgetPasswordVal, paramsIdVal, recoveryEmailVal, resetPasswordVal, updateAccVal } from "./user.validation.js";
import { checkEmail } from "../../middleware/checkEmailExist.js";
import { protectedRoutes } from "../auth/auth.controller.js";

const userRouter = express.Router();

userRouter.route("/")
  .get(validation(recoveryEmailVal), getRecoveryEmailAccounts) // Recovery Email Account
  .put(validation(updateAccVal), protectedRoutes, checkEmail, updateAccount) // Update Account
  .delete(protectedRoutes, validation(Val),deleteAccount) // Delete Account

userRouter.route("/profile")
  .get(protectedRoutes, validation(Val), getUserData); // Get user data

userRouter.route("/profile/:id")
  .get(validation(paramsIdVal), getProfileData); // Get profile data for another user

userRouter.route("/forget-password")
  .post(validation(forgetPasswordVal), forgetPassword); // Forget password

userRouter.route("/reset-password")
  .patch(validation(resetPasswordVal), resetPassword); // Reset Password

export default userRouter;
