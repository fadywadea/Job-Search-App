"use strict";

import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
    required: true,
  },
  lastName: {
    type: String,
    trim: true,
    required: true,
  },
  userName: String,
  email: {
    type: String,
    trim: true,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  recoveryEmail: {
    type: String,
    trim: true,
    unique: true,
    required: true,
  },
  day: Number,
  month: Number,
  year: Number,
  DOB: String,
  mobileNumber: {
    type: String,
    trim: true,
    unique: true,
    required: true,
  },
  role: {
    type: String,
    enum: ['User', 'Company_HR'],
    default: 'User',
  },
  status: {
    type: String,
    enum: ['Online', 'Offline'],
    default: 'Offline'
  },
  passwordResetOTP: {
    otp: String,
    expiresAt: Date
  },
  passwordUpdatedAt: {
    type: Date,
    default: Date.now(),
    required: true,
  }
},
  { timestamps: true }
);

// Hash password before saving to database
userSchema.pre('save', function () {
  this.password = bcrypt.hashSync(this.password, +process.env.HASH_ROUND);
});

export const userModel = mongoose.model('user', userSchema);