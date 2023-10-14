import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { createServer } from "http";
import cors from "cors";
import errorHandler from "./middleware/errorMiddleware.js";
import userRoutes from "./routes/userRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";

// Get environment variables
dotenv.config();

// Database
global.mongoose = mongoose;
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

// Initialize server
const app = express();
const httpServer = createServer(app);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorHandler);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);

// Assign port
const PORT = process.env.PORT || 8080;

// Start server
httpServer.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});