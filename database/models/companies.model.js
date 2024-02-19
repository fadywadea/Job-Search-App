"use strict";

import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  companyName: {
    type: String,
    trim: true,
    unique: true,
    required: true,
  },
  description: {
    type: String,
    trim: true,
    required: true,
  },
  industry: {
    type: String,
    trim: true,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  numberOfEmployees :{
    type: Number,
  },
  companyEmail: {
    type: String,
    trim: true,
    unique: true,
    required: true,
  },
  companyHR: {
    type: mongoose.Schema.ObjectId,
    ref:'user',
    required: true,
  }
});

export const companyModel = mongoose.model('company', companySchema);