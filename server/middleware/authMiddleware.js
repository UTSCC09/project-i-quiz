import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
import { createRequire } from "module";
import User from "../models/User.js";
import formatMessage from "../utils/utils.js";

const require = createRequire(import.meta.url);
const jwt = require("jsonwebtoken");
dotenv.config();

const protect = asyncHandler(async (req, res, next) => {
  let token = req.session.token ? req.session.token : null;

  if (token) {
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get all user fields except hashed password
      req.user = await User.findById(decoded.id).select("-password");
      if (req.user){
        next();
      }

    } catch (error) {
      console.log(error);
      return res.status(401).json(formatMessage(false, "Error authenticating user"));
    }
  }
  else {
    return res.status(401).json(formatMessage(false, "Error authenticating user"));
  }
});

export default protect;