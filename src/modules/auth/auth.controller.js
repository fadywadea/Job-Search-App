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
  const user = await userModel.findById(req.user._id);
  if (user) {
    !bcrypt.compareSync(oldPassword, user.password) && next(new appError("Wrong Password!", 401))
    newPassword = bcrypt.hashSync(newPassword, +process.env.HASH_ROUND);
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_KEY);
    await userModel.findByIdAndUpdate(req.user._id, { password: newPassword, passwordUpdatedAt: Date.now() }, { new: true });
    bcrypt.compareSync(oldPassword, user.password) && res.status(200).json({ message: "success", token });
  } else {
    next(new appError("No User Found!", 404));
  }
});

// Protected Routes
export const protectedRoutes = catchError(async (req, res, next) => {
  const { token } = req.headers;
  if (!token) return next(new appError("Token not provider", 401));
  const decoded = jwt.verify(token, process.env.JWT_KEY);
  const user = await userModel.findById(decoded.userId);
  if (!user) { return next(new appError("Unauthorized!", 403)); }
  const time = parseInt(user.passwordUpdatedAt.getTime() / 1000);
  if (time > decoded.iat) { return next(new appError("Token Expired.", 404)); }
  req.user = user;
  next();
});

// Authorization
export const authorization = (...roles) => {
  return catchError(async (req, res, next) => {
    !roles.includes(req.user.role) && next(new appError("You don't have permission to perform this action.", 401));
    roles.includes(req.user.role) && next();
  });
};
