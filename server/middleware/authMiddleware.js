import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
import formatMessage from "../utils/utils.js";
import validator from "validator";
import { parse, serialize } from "cookie";
import mongoose from "mongoose";

dotenv.config();

const sanitizeContent = (content) => {
  return validator.escape(content);
}

const checkId = (id) => {
  if (!mongoose.isValidObjectId(id)) return false;
  return true;
};

const protect = asyncHandler(async (req, res, next) => {
  let cookies = parse(req.headers.cookie || "");

  if (req.session == null || cookies == null || req.session.email != cookies.user) {
    return res.status(401).json(formatMessage(false, "Not authorized"));
  }

  if (req.body.content != null) {
    req.body.content = sanitizeContent(req.body.content);
  }

  if (req.params.id != null && !checkId(req.params.id) ||
      req.body.userId != null && !checkId(req.body.userId) ||
      req.body.courseId != null && !checkId(req.body.courseId)) {
    return res.status(400).json(formatMessage(false, "Not a valid id"));
  }

  next();

});
export default protect;