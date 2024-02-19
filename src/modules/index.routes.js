"use strict";

import authRouter from "./auth/auth.routes.js";

export const bootstrap = (app) => {
  app.use("/api/v1/auth", authRouter);
  // app.use("/api/v1", );
  // app.use("/api/v1", );
};
