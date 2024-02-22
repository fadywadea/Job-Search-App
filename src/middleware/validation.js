"use strict";

import { appError } from "../utils/appError.js";

export const validation = (schema) => {
  return (req, res, next) => {
    let pdf = null;
    if (req.file) pdf = req.file.pdf;
    if (!pdf) return next();
    const { error } = schema.validate(
      { pdf, ...req.body, ...req.params, ...req.query },
      { abortEarly: false }
    );
    if (!error) {
      next();
    } else {
      let errMsg = [];
      error.details.forEach((val) => {
        errMsg.push(val.message);
      });
      next(new appError(errMsg, 401));
    }
  };
};
