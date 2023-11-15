import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import formatMessage from "../utils/utils.js";

const extractJwt =  (requiredScope) => asyncHandler(async (req, res, next) => {
  let token;

  if (req.cookies.passwordResetToken) {
    try {
      // Get token from cookie
      token = req.cookies.passwordResetToken;

      //Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      //Check token expiration and scope
      if (decoded.exp * 1000 < Date.now()) {
        return res.status(401).json(formatMessage(false, "Token expired"));
      }
      if (requiredScope && !decoded.scope.includes(requiredScope)) {
        return res.status(403).json(formatMessage(false, "Not enough permissions"));
      }

      // Get user id from the token while checking its valid
      const user = await User.findById(decoded.id);
      if (!user) {
        return res
          .status(400)
          .json(formatMessage(false, "Invalid user id in token"));
      }
      req.userId = user._id;

      // Call the next piece of middleware
      next();
    } catch (error) {
      console.log(error);
      return res
        .status(401)
        .json(formatMessage(false, "Error while extracting jwt"));
    }
  }

  if (!token) {
    return res
      .status(401)
      .json(formatMessage(false, "Not authorized"));
  }
});

export { extractJwt };