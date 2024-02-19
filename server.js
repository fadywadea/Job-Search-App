"use strict";

// Database Connection Error Handle
process.on("uncaughtException", (error) => { console.log("Error:", error); });

import express from "express";
import { dbConnection } from "./database/dbConnection.js";
import { appError } from "./src/utils/appError.js";
import { globalError } from "./src/middleware/globalError.js";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import { bootstrap } from "./src/modules/index.routes.js";

// Config For File dotenv
dotenv.config();

const app = express();
const port = 3000;

// Database Connection
dbConnection();

// Static Middlewares
app.use("/", express.static("uploads"));

// configuration cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// JSON Middleware
app.use(express.json());

// Routes Middlewares
bootstrap(app);

app.get("/", (req, res) => res.json({ message: "Hello World!" }));

// Error messages if there are any errors in the routes
app.use("*", (req, res, next) => { next(new appError(`Not found endPoint: ${req.originalUrl}`, 404)); });

// Global Error Handle
app.use(globalError);

// Database Connection Error Handle
process.on("unhandledRejection", (error) => { console.log("Error:", error); });

// Server Running....
app.listen(port, () => console.log(`App listening on port ${port}!`));
