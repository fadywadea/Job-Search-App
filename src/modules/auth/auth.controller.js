"use strict";

import { userModel } from "../../../database/models/users.model.js";
import { catchError } from "../../middleware/catchError.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { appError } from "../../utils/appError.js";
import { generateOTP } from "../../middleware/generateOTP.js";

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
      const { firstName, _id, email } = user;
      await userModel.findByIdAndUpdate(_id, { status: "Online" });
      const token = jwt.sign({ userId: _id, email }, process.env.JWT_KEY);
      return res.status(200).json({ message: `Welcome ${firstName}.`, token });
    } else { next(new appError("Invalid Password.", 401)); }
  } else { next(new appError("Invalid Email.", 401)); }
});


// Update Account
export const updateAccount = catchError(async (req, res, next) => {
  let { email, mobileNumber, recoveryEmail, DOB, day, month, year, lastName, firstName, userName } = req.body;
  userName = firstName + " " + lastName;
  DOB = year + "-" + month + "-" + day;
  const user = await userModel.findByIdAndUpdate(
    req.params.id,
    { email, mobileNumber, recoveryEmail, DOB, lastName, firstName, userName },
    { new: true });
  !user && next(new appError("No User Found!", 404));
  user && res.status(200).json({ message: "success" });
});


// Delete Account
export const deleteAccount = catchError(async (req, res, next) => {
  const user = await userModel.findByIdAndDelete(req.user.userId);
  !user && next(new appError("Not found.", 404));
  user && res.status(200).json({ message: "success" });
});


// Get user account data
export const getUserData = catchError(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate({ _id: req.user.userId }, { status: "Online" });
  !user && next(new appError("No User Found!", 404));
  user && res.status(200).json({
    message: "success", user: {
      Name: user.userName, Email: user.email, Birthday: user.DOB,
      RecoveryEmail: user.recoveryEmail, PhoneNumber: user.mobileNumber, Role: user.role, status: user.status
    }
  });
});


// Get profile data for another user
export const getProfileData = catchError(async (req, res, next) => {
  const user = await userModel.findById(req.params.id);
  !user && next(new appError("No User Found!", 404));
  user && res.status(200).json({
    message: "success", user: {
      Name: user.userName, Email: user.email, Birthday: user.DOB,
      PhoneNumber: user.mobileNumber, Role: user.role, status: user.status
    }
  });
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


// Forget password
export const forgetPassword = catchError(async (req, res, next) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email });
  !user && next(new appError("No User Found!", 404));
  const otp = generateOTP();
  const otpHash = bcrypt.hashSync(otp, +process.env.HASH_ROUND);
  const OTP_VALIDITY_DURATION = 15 * 60 * 1000; // 15 minutes
  const otpExpiration = Date.now() + OTP_VALIDITY_DURATION;
  user.passwordResetOTP = { otp: otpHash, expiresAt: otpExpiration };
  await user.save();
  user && res.status(200).json({ message: "success", otp });
});


// Reset Password
export const resetPassword = catchError(async (req, res, next) => {
  let { email, otp, newPassword } = req.body;
  const user = await userModel.findOne({ email });
  if (!user)  {return next(new appError("User not found", 404));}
  const { passwordResetOTP } = user;
  if (!passwordResetOTP.otp || Date.now() > passwordResetOTP.expiresAt) {
    return next(new appError("OTP has expired or is invalid", 400));
  }
  const isOTPValid = bcrypt.compareSync(otp, passwordResetOTP.otp);
  if (!isOTPValid) { return next(new appError("Invalid OTP", 401)); }
  newPassword = newPassword = bcrypt.hashSync(newPassword, +process.env.HASH_ROUND);
  user.passwordResetOTP = undefined;
  await userModel.findOneAndUpdate({ email }, { password: newPassword }, { new: true });
  res.status(200).json({ message: "success" });
});


// Get all accounts associated to a specific recovery Email
export const getRecoveryEmailAccounts = catchError(async (req, res, next) => {
  const { recoveryEmail } = req.body;
  const users = await userModel.distinct('email', { recoveryEmail });
  !users.length ?
    next(new appError("User not found", 404)) :
    res.status(200).json({ message: "success", users });
});
