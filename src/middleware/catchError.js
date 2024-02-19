"use strict";

// Catch Errors
export function catchError(fn) {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => { next(err) });
  }
};