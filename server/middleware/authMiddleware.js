import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
import formatMessage from "../utils/utils.js";

dotenv.config();

const protect = asyncHandler(async (req, res, next) => {
  let email = req.session.email ? req.session.email : null;

  if (email) next();
  else {
    return res.status(401).json(formatMessage(false, "Not authorized"));
  }
});

export default protect;