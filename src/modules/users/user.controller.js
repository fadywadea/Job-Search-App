"use strict";

import { userModel } from "../../../database/models/users.model.js";
import { catchError } from "../../middleware/catchError.js";
import { appError } from "../../utils/appError.js";
import { generateOTP } from "../../middleware/generateOTP.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Update Account
export const updateAccount = catchError(async (req, res, next) => {
  try {
    let { email, mobileNumber, recoveryEmail, DOB, day, month, year, lastName, firstName, userName } = req.body;
    userName = firstName + " " + lastName;
    DOB = year + "-" + month + "-" + day;
    const user = await userModel.findByIdAndUpdate(
      req.user.userId,
      { email, mobileNumber, recoveryEmail, DOB, lastName, firstName, userName },
      { new: true });
    res.status(200).json({ message: "success" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: `Error in server: ${e}` });
  }
});

// Delete Account
export const deleteAccount = catchError(async (req, res, next) => {
  try {
    const user = await userModel.findByIdAndDelete(req.user._id);
    !user && next(new appError("No User Found!", 404));
    user && res.status(200).json({ message: "success" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: `Error in server: ${e}` });
  }
});

// Get user account data
export const getUserData = catchError(async (req, res, next) => {
  try {
    const user = await userModel.findByIdAndUpdate({ _id: req.user._id }, { status: "Online" });
    res.status(200).json({
      message: "success", user: {
        Name: user.userName, Email: user.email, Birthday: user.DOB,
        RecoveryEmail: user.recoveryEmail, PhoneNumber: user.mobileNumber, Role: user.role, status: user.status
      }
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: `Error in server: ${e}` });
  }
});

// Get profile data for another user
export const getProfileData = catchError(async (req, res, next) => {
  try {
    const user = await userModel.findById(req.params.id);
    !user && next(new appError("No User Found!", 404));
    user && res.status(200).json({
      message: "success", user: {
        Name: user.userName, Email: user.email, Birthday: user.DOB,
        PhoneNumber: user.mobileNumber, Role: user.role, status: user.status
      }
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: `Error in server: ${e}` });
  }
});

// Forget password
export const forgetPassword = catchError(async (req, res, next) => {
  try {
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
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: `Error in server: ${e}` });
  }
});

// Reset Password
export const resetPassword = catchError(async (req, res, next) => {
  try {
    let { email, otp, newPassword } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) { return next(new appError("User not found", 404)); }
    const { passwordResetOTP } = user;
    if (!passwordResetOTP.otp || Date.now() > passwordResetOTP.expiresAt) {
      return next(new appError("OTP has expired or is invalid", 400));
    }
    const isOTPValid = bcrypt.compareSync(otp, passwordResetOTP.otp);
    if (!isOTPValid) { return next(new appError("Invalid OTP", 401)); }
    newPassword = newPassword = bcrypt.hashSync(newPassword, +process.env.HASH_ROUND);
    user.passwordResetOTP = undefined;
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_KEY);
    await user.save();
    await userModel.findOneAndUpdate({ email }, { password: newPassword, passwordUpdatedAt: Date.now() }, { new: true });
    res.status(200).json({ message: "success", token });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: `Error in server: ${e}` });
  }
});

// Get all accounts associated to a specific recovery Email
export const getRecoveryEmailAccounts = catchError(async (req, res, next) => {
  try {
    const { recoveryEmail } = req.body;
    const users = await userModel.distinct('recoveryEmail', { recoveryEmail });
    !users.length ?
      next(new appError("User not found", 404)) :
      res.status(200).json({ message: "success", users });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: `Error in server: ${e}` });
  }
});
