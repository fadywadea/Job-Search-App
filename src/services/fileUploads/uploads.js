"use strict";

import multer from "multer";
import { appError } from "../../utils/appError.js";

// file upload
const fileUpload = () => {
  const storage = multer.diskStorage({});
  function fileFilter(req, file, cb) {
    if (file.mimetype.startsWith("application/pdf")) {
      cb(null, true);
    } else {
      cb(new appError("pdf only", 400), false);
    }
  }
  const upload = multer({ storage, fileFilter });
  return upload;
};

// upload single file
export const uploadSingleFile = (fieldName) => fileUpload().single(fieldName);
