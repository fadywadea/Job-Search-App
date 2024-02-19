"use strict";

const OTP_LENGTH = 6;

export const generateOTP = () => {
  const otp = Math.floor(Math.random() * (10 ** OTP_LENGTH)).toString().padStart(OTP_LENGTH, '0');
  return otp;
};