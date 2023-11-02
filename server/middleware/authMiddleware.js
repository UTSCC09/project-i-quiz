import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
import formatMessage from "../utils/utils.js";
import validator from "validator";

dotenv.config();

const protect = asyncHandler(async (req, res, next) => {
  if (req.session == null || req.session.email == null || req.session.csrfToken != req.body.csrfToken){
    return res.status(401).json(formatMessage(false, "Not authorized"));
  }
  next();
});

const sanitizeContent = function(req, res, next) {
  req.body.content = validator.escape(req.body.content);
  next();
}

const checkId = function(req, res, next) {
  if (!validator.isAlphanumeric(req.params.id)) return res.status(400).end("bad input");
  next();
};

export default protect;