import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
import formatMessage from "../utils/utils.js";
import validator from "validator";
import { parse, serialize } from "cookie";

dotenv.config();

const sanitizeContent = function(content) {
  return validator.escape(content);
}

const checkId = function(req, res, next) {
  if (!validator.isAlphanumeric(req.params.id)) return res.status(400).end("bad input");
  next();
};

// https://en.wikipedia.org/wiki/Cross-site_request_forgery#Cookie-to-header_token
const protect = asyncHandler(async (req, res, next) => {
  let cookies = parse(req.headers.cookie || "");
  
  if (req.session == null || req.session.email == null || cookies == null || req.session.csrfToken != cookies.sessionId){
    return res.status(401).json(formatMessage(false, "Not authorized"));
  }

  if (req.body.content != null){
    req.body.content = sanitizeContent(req.body.content);
  }

  next();
});
export default protect;