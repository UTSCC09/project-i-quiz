import asyncHandler from "express-async-handler";
import { compare, genSalt, hash } from "bcrypt";
import User from "../models/User.js";
import formatMessage from "../utils/utils.js";
import sendEmailVerificationLink from "../utils/emailVerificationUtils.js";
import sendPasswordResetCode from "../utils/passwordResetUtils.js";
import crypto from "crypto";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import PASSWORD_RESET_CONSTANTS from "../constants/passwordResetConstants.js";
import SCOPES from "../constants/scopes.js";

//@route  POST api/users
//@desc   Registers a new iQuiz user
//@access Public
const registerUser = asyncHandler(async (req, res) => {
  const { type, firstName, lastName, email, password } = req.body;

  //Verify all fields exist.
  if (!firstName || !lastName || !email || !password || !type) {
    return res.status(400).json(formatMessage(false, "Missing fields"));
  }

  //Check valid type
  if (type !== "student" && type !== "instructor") {
    return res.status(400).json(formatMessage(false, "Invalid type"));
  }

  //Checks if there is a pre-existing user.
  const existsUser = await User.findOne({ email });
  if (existsUser) {
    return res
      .status(400)
      .json(formatMessage(false, "Email is already registered"));
  }

  //Salting password.
  const saltRounds = 10;
  genSalt(saltRounds, async function (err, salt) {
    hash(password, salt, async function (err, hashedPassword) {
      if (err) return res.status(500).end(err);

      //Creating user
      const user = await User.create({
        type: type,
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashedPassword,
        emailVerificationCode: crypto.randomUUID().slice(0, 8),
        passwordReset: {} //Use all default values
      });

      //Return user object
      if (user) {
        await sendEmailVerificationLink(user);
        return res.status(200).json(formatMessage(true, "Registered Successfully"));
      }
    });
  });
});

//@route  GET api/users
//@desc   [DESCRIPTION OF WHAT ROUTE DOES]
//@access Private
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  return res
    .status(200)
    .json(formatMessage(true, "User retrieved successfully", users));
});

//@route  POST api/users/login
//@desc   Logs in user, given a valid email and password.
//@access Public
const loginUser = asyncHandler(async (req, res) => {
  if (req.session.email) {
    return res.status(400).json(formatMessage(false, "User already logged in"));
  }
  
  const { email, password } = req.body;

  //Verify all fields exist.
  if (!email || !password) {
    return res.status(400).json(formatMessage(false, "Missing fields"));
  }

  //Verify valid user
  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(400)
      .json(formatMessage(false, "Email is not registered"));
  }

  //Checks if user's account is verified
  if (!user.verified) {
    return res
      .status(400)
      .json(
        formatMessage(
          false,
          "Please verify your account first before you log in!"
        )
      );
  }

  compare(password, user.password, function (err, result) {
    if (!result) {
      return res.status(401).json(formatMessage(false, "Incorrect password"));
    }

    //Store email
    req.session.email = email;
    req.session.cookie.httpOnly = true;
    req.session.cookie.sameSite = true;

    //Setting cookie
    res.cookie("user", email, {
      path: "/",
      maxAge: 60 * 60 * 1000, // 1 hr in number of seconds
      httpOnly: false,
      secure: true,
      sameSite: true,
    });
    res.cookie("user_type", user.type, {
      path: "/",
      maxAge: 60 * 60 * 1000, // 1 hr in number of seconds
      httpOnly: false,
      secure: true,
      sameSite: true,
    });

    return res.json(formatMessage(true, "Login Successfully"));
  });
});

//@route  GET api/users/logout
//@desc   Logs out user, if the user is logged in.
//@access Public
const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("connect.sid");
  res.clearCookie("user");
  res.clearCookie("user_type");

  if (!req.session.email) {
    return res.status(400).json(formatMessage(false, "User is not logged in"));
  }
  
  req.session.destroy(function (err) {
    if (err)
      return res
        .status(500)
        .json(formatMessage(false, "Deleting session error"));
    return res.json(formatMessage(true, "User has successfully logged out"));
  });
});

//@route  POST api/users/verifyemail/:userID/:emailVerificationCode
//@desc   Takes a code and verifies user's email if the code matches the generated verification code for that user.
//@access Public
const verifyUserEmail = asyncHandler(async (req, res) => {
  const { userId, emailVerificationCode } = req.params;

  if (!userId || !emailVerificationCode) {
    return res.status(400).json(formatMessage(false, "Missing arguments"));
  }

  if (!mongoose.isValidObjectId(userId)) {
    return res.status(400).json(formatMessage(false, "Bad user id"));
  }

  const user = await User.findOne({ _id: userId });
  if (!user) {
    return res.status(400).json(formatMessage(false, "User is not registered"));
  }

  if (user.verified) {
    return res
      .status(400)
      .json(formatMessage(false, "User is already verified"));
  }

  if (user.emailVerificationCode === emailVerificationCode) {
    user.verified = true;
    const updateUser = await User.updateOne({ _id: userId }, user);

    if (updateUser.modifiedCount === 1) {
      return res.json(formatMessage(true, "User has been verified!"));
    }
    return res
      .status(500)
      .json(formatMessage(false, "Failed to update Users database"));
  }
  return res
    .status(400)
    .json(formatMessage(false, "Invalid verification code"));
});

//@route  POST api/users/requestpasswordreset
//@desc   Takes an email address, checks if registered and verified,
//        then generates and sends password reset code to their email address.
//@access Public
const requestPasswordReset = asyncHandler(async (req, res) => {
  const { email } = req.body;

  //Verify all fields exist.
  if (!email) {
    return res.status(400).json(formatMessage(false, "Missing fields"));
  }

  //Verify valid email
  let user;
  try {
    user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json(formatMessage(false, "Email is not registered"));
    }
    if (!user.verified) {
      return res
        .status(400)
        .json(formatMessage(false,"Email is not verified"));
    }
  } catch (error) {
    return res
    .status(400)
    .json(formatMessage(false, "Mongoose error finding user"));    
  }

  //Generate, store and send password reset code
  const code = crypto.randomUUID().slice(0, PASSWORD_RESET_CONSTANTS.CODE_LENGTH);
  await sendPasswordResetCode(user, code);
  user.passwordReset.code = code;
  user.passwordReset.createdAt = Date.now();
  user.passwordReset.attemptsMade = 0;
  await user.save(); // Only store if sending email is successful

  res.cookie(
    "passwordResetToken",
    generateToken(user._id, SCOPES.PASSWORD_RESET),
    {
      httpOnly: true,
      secure: true,
      sameSite: true
    }
  );
  return res.status(200).json(formatMessage(true, "Password reset request accepted"));
});

//@route  POST api/users/verifypasswordresetcode
//@desc   Takes an email address and a code, checks if email is registered and verified,
//        then validates the code and returns a jwt if valid.
//@access Public
const verifyPasswordResetCode = asyncHandler(async (req, res) => {
  const { code } = req.body;

  //Verify all fields exist.
  if (!code) {
    return res.status(400).json(formatMessage(false, "Missing fields"));
  }

  //Verify valid email
  let user;
  try {
    user = await User.findById(req.userId);
    if (!user) {
      return res
        .status(400)
        .json(formatMessage(false, "Invalid user id in token"));
    }
    if (!user.verified) {
      return res
        .status(400)
        .json(formatMessage(false,"Email is not verified"));
    }
  } catch (error) {
    return res
    .status(400)
    .json(formatMessage(false, "Mongoose error finding user"));    
  }

  //Verify code
  if (user.passwordReset.code !== code ||
    user.passwordReset.createdAt + PASSWORD_RESET_CONSTANTS.CODE_EXPIRATION <= Date.now()) {
    //TODO: Check max attempts and add locking mechanism
    user.passwordReset.attemptsMade += 1;
    await user.save();
    return res
      .status(400)
      .json(formatMessage(false, "Incorrect/expired password reset code"));
  }

  return res.status(200).json(formatMessage(true, "Password reset code is valid"));
});

//@route  POST api/users/resetpassword
//@desc   Takes a new password and set user's (decides user from jwt) password to the new password.
//@access Semi-private (requires jwt)
const resetPassword = asyncHandler(async (req, res) => {
  const { newPassword } = req.body;

  //Verify all fields exist.
  if (!newPassword) {
    return res.status(400).json(formatMessage(false, "Missing fields"));
  }

  //Verify valid user
  let user;
  try {
    user = await User.findById(req.userId);
    if (!user) {
      return res
        .status(400)
        .json(formatMessage(false, "Invalid user id in token"));
    }
  } catch (error) {
    return res
    .status(400)
    .json(formatMessage(false, "Mongoose error finding user"));    
  }

  //Salt and hash new password
  const saltRounds = 10;
  genSalt(saltRounds, async (err, salt) => {
    hash(newPassword, salt, async (err, hashedPassword) => {
      if (err) return res.status(500).end(err);

      //Update password
      user.password = hashedPassword;
      user.passwordReset.code = null;
      user.passwordReset.createdAt = null;
      user.passwordReset.attemptsMade = 0;
      await user.save();
      return res.status(200).json(formatMessage(true, "Password reset successfully"));
    });
  });

});

// generate jwt
const generateToken = (id, scope) => {
  dotenv.config();
  return jwt.sign(
    { id,
      scope: [scope]
    },
    process.env.JWT_SECRET,
    {expiresIn: "30000s",}
  );
};

export {
  registerUser,
  getUsers,
  loginUser,
  logoutUser,
  verifyUserEmail,
  requestPasswordReset,
  verifyPasswordResetCode,
  resetPassword
};
