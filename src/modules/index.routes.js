"use strict";

import authRouter from "./auth/auth.routes.js";
import companyRouter from "./companies/company.routes.js";

export const bootstrap = (app) => {
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/company", companyRouter);
  // app.use("/api/v1", );
};
