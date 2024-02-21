"use strict";

import express from "express";
import { checkEmail } from "../../middleware/checkEmailExist.js";
import { validation } from "../../middleware/validation.js";
import { protectedRoutes, signin, signup, updatePassword } from "./auth.controller.js";
import { signinVal, signupVal, updatePasswordVal } from "./auth.validation.js";

const authRouter = express.Router();

authRouter.route("/")
  .post(validation(signupVal), checkEmail, signup) // Sign Up User

  authRouter.route("/signin")
  .post(validation(signinVal), signin); // Signin User

  authRouter.route("/password")
  .patch(validation(updatePasswordVal), protectedRoutes, updatePassword); // Update Password

export default authRouter;
