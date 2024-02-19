"use strict";

import { userModel } from "../../database/models/users.model.js";
import { appError } from "../utils/appError.js";

export const checkEmail = async (req, res, next) => {
  const user = await userModel.findOne({ email: req.body.email });
  user && next(new appError("Email already in use.", 409))
  !user && next();
};
