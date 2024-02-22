"use strict";

import { appError } from "../utils/appError.js";

export const validation = (schema) => {
  return (req, res, next) => {
    let filter = {};
    if (req.file) {
      filter = { pdf: req.file, ...req.body, ...req.params, ...req.query }
    } else {
      filter = { ...req.body, ...req.params, ...req.query }
    }
    const { error } = schema.validate(filter, { abortEarly: false });
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
