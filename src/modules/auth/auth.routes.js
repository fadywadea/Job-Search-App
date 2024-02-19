"use strict";

import express from "express";
import { deleteAccount, forgetPassword, getProfileData, getRecoveryEmailAccounts, getUserData, resetPassword, signin, signup, updateAccount, updatePassword } from "./auth.controller.js";
import { validation } from "../../middleware/validation.js";
import { forgetPasswordVal, paramsIdVal, recoveryEmailVal, resetPasswordVal, signinVal, signupVal, updateAccVal, updatePasswordVal } from "./auth.validation.js";
import { checkEmail } from "../../middleware/checkEmailExist.js";
import { auth } from "../../middleware/auth.js";

const authRouter = express.Router();

authRouter
  .route("/")
  .post(validation(signupVal), checkEmail, signup) // Sign Up User
  .get(validation(recoveryEmailVal),getRecoveryEmailAccounts); // Recovery Email Account

authRouter
  .route("/signin")
  .post(validation(signinVal), signin); // Signin User

authRouter
  .route("/:id")
  .put(validation(updateAccVal), auth, checkEmail, updateAccount) // Update Account
  .delete(validation(paramsIdVal), auth, deleteAccount) // Delete Account
  .get(validation(paramsIdVal), auth, getUserData); // Get user data

authRouter
  .route("/password/:id")
  .patch(validation(updatePasswordVal), auth, updatePassword); // Update Password

authRouter
  .route("/profile/:id")
  .get(validation(paramsIdVal), getProfileData); // Get profile data for another user

authRouter
  .route("/forget-password")
  .post(validation(forgetPasswordVal), forgetPassword); // Forget password

authRouter
  .route("/reset-password")
  .patch(validation(resetPasswordVal), resetPassword); // Reset Password

export default authRouter;
