import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { createServer } from "http";
import cors from "cors";
import session from "express-session";
import { readFileSync } from "fs";
import { parse, serialize } from "cookie";
import errorHandler from "./middleware/errorMiddleware.js";
import userRoutes from "./routes/userRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";

// Get environment variables
dotenv.config();

// Database
global.mongoose = mongoose;
const connectDB = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    mongoose.connection.once("open", () => {
      console.log("MongoDB database connection established successfully");
    });
  } catch (err) {
    console.log("Failed to connect to mongoDB.");
    console.log(err);
  }
};
connectDB();

// Initialize server
const app = express();
const httpServer = createServer(app);

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_BASE_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorHandler);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Cookie.user checking
app.use(function (req, res, next) {
  let cookies = parse(req.headers.cookie || "");
  if (cookies && cookies.user == null && req.session.email) {
    req.session.email = null;
  }
  req.user = null;
  if (req.session) {
    req.user = req.session.email;
  }
  //console.log("HTTP request", req.user , req.method, req.url, req.body);
  next();
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);

// Assign port
const PORT = process.env.PORT || 8080;

// Start server
httpServer.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
