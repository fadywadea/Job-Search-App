"use strict";

import { appError } from "../utils/appError.js";

export const validation = (schema) => {
  return (req, res, next) => {
    const pdf  = req.file;
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
