"use strict";

import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  jobTitle: String,
  jobLocation: {
    type: String,
    enum: ['onsite', 'remotely', 'hybrid '],
  },
  workingTime: {
    type: String,
    enum: ['part-time', 'full-time'],
  },
  seniorityLevel: {
    type: String,
    enum: ['Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO '],
  },
  technicalSkills: {
    type: [String],
  },
  softSkills: {
    type: [String],
  },
  jobDescription: String,
  addedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'company',
  }
}, { timestamps: true });

export const jobModel = mongoose.model('job', jobSchema);