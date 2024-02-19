"use strict";

import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  jobTitle: {
    type: String,
    trim: true,
    unique: true,
    required: true,

  },
  jobLocation: {
    type: String,
    enum: ['onsite', 'remotely', 'hybrid '],
    required: true,
  },
  workingTime: {
    type: String,
    enum: ['part-time', 'full-time'],
    required: true,
  },
  seniorityLevel: {
    type: String,
    enum: ['Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO '],
    required: true,
  },
  jobDescription : {
    type: String,
    required: true,
  },
  addedBy:{
    type: mongoose.Schema.ObjectId,
    ref:'user',
  }
});

export const jobModel = mongoose.model('job', jobSchema);