"use strict";

import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  companyName: {
    type: String,
    unique: true,
  },
  description: String,
  industry: String,
  address: String,
  numberOfEmployees: {
    type: String,
  },
  companyEmail: {
    type: String,
    unique: true,
  },
  companyHR: {
    type: mongoose.Schema.ObjectId,
    ref: 'user',
    required: true,
  }
}, { timestamps: true });

export const companyModel = mongoose.model('company', companySchema);