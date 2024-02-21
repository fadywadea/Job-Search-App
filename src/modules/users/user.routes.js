"use strict";

import express from "express";
import { deleteAccount, forgetPassword, getProfileData, getRecoveryEmailAccounts, getUserData, resetPassword, updateAccount } from "./user.controller.js";
import { validation } from "../../middleware/validation.js";
import { Val, forgetPasswordVal, paramsIdVal, recoveryEmailVal, resetPasswordVal, updateAccVal } from "./user.validation.js";
import { checkEmail } from "../../middleware/checkEmailExist.js";
import { protectedRoutes } from "../auth/auth.controller.js";

const userRouter = express.Router();

userRouter.route("/")
  .get(validation(recoveryEmailVal), getRecoveryEmailAccounts)
  .put(validation(updateAccVal), protectedRoutes, checkEmail, updateAccount)
  .delete(protectedRoutes, validation(Val),deleteAccount)

userRouter.route("/profile")
  .get(protectedRoutes, validation(Val), getUserData);

userRouter.route("/profile/:id")
  .get(validation(paramsIdVal), getProfileData);

userRouter.route("/forget-password")
  .post(validation(forgetPasswordVal), forgetPassword);

userRouter.route("/reset-password")
  .patch(validation(resetPasswordVal), resetPassword);

export default userRouter;
