"use strict";

import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.ObjectId,
    ref: 'job'
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'user'
  },
  userTechSkills: {
    type: [String],
  },
  userSoftSkills: {
    type: [String],
  },
  userResume: String,
});

export const applicationModel = mongoose.model('application', applicationSchema);