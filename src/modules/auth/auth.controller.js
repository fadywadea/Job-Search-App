"use strict";

import { userModel } from "../../../database/models/users.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { catchError } from "../../middleware/catchError.js";
import { appError } from "../../utils/appError.js";


// Sign Up User
export const signup = catchError(async (req, res, next) => {
  let { firstName, lastName, userName, email, password, recoveryEmail, DOB, day, month, year, mobileNumber, } = req.body;
  userName = firstName + " " + lastName;
  DOB = year + "-" + month + "-" + day;
  const user = new userModel({ firstName, lastName, userName, email, password, recoveryEmail, DOB, mobileNumber, });
  await user.save();
  res.status(201).json({ message: "success", user: { name: user.firstName, email: user.email }, });
});


// Sign in with email or mobile
export const signin = catchError(async (req, res, next) => {
  const { emailOrMobile, password } = req.body;
  const user = await userModel.findOne({ $or: [{ email: emailOrMobile }, { mobileNumber: emailOrMobile }], });
  if (user) {
    if (bcrypt.compareSync(password, user.password)) {
      const { firstName, _id, role } = user;
      await userModel.findByIdAndUpdate(_id, { status: "Online" });
      const token = jwt.sign({ userId: _id, role }, process.env.JWT_KEY);
      return res.status(200).json({ message: `Welcome ${firstName}.`, token });
    } else { next(new appError("Invalid Password.", 401)); }
  } else { next(new appError("Invalid Email.", 401)); }
});

// Update password
export const updatePassword = catchError(async (req, res, next) => {
  let { oldPassword, newPassword } = req.body;
  const user = await userModel.findById(req.params.id);
  !bcrypt.compareSync(oldPassword, user.password) && next(new appError("Wrong Password!", 401))
  newPassword = bcrypt.hashSync(newPassword, +process.env.HASH_ROUND);
  await userModel.findByIdAndUpdate(req.params.id, { password: newPassword }, { new: true });
  bcrypt.compareSync(oldPassword, user.password) && res.status(200).json({ message: "success" });
});
