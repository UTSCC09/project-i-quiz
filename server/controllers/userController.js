import asyncHandler from "express-async-handler";
import { compare, genSalt, hash } from "bcrypt";
import dotenv from "dotenv";
import User from "../models/User.js";
import formatMessage from "../utils/utils.js";

const saltRounds = 10;
dotenv.config();

//@route  POST api/users
//@desc   Registers a new iQuiz user
//@access Public
const registerUser = asyncHandler(async (req, res) => {
  const { type, firstName, lastName, email, password} = req.body;
  
  //Verify all fields exist.
  if (!firstName || !lastName || !email || !password || !type){
    return res.status(400).json(formatMessage(false, "Missing fields"));
  }

  //Check valid type
  if (type !== "student" && type !== "instructor"){
    return res.status(400).json(formatMessage(false, "Invalid type"));
  }

  //Checks if there is a pre-existing user.
  const existsUser = await User.findOne({ email });
  if (existsUser){
    return res.status(400).json(formatMessage(false, "Email is already registered"));
  }

  //Salting password.
  genSalt(saltRounds, async function(err,salt){
    hash(password, salt, async function (err, hashedPassword){
      if (err) return res.status(500).end(err);

      //Creating user
      const user = await User.create({
        type: type,
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashedPassword
      });

      //Return user object
      if (user) {
        return res.status(200).json(formatMessage(true, "Registered Successfully"));
      }
    });
  });

});

//@route  GET api/users
//@desc   [DESCRIPTION OF WHAT ROUTE DOES]
//@access Private
const getUsers = asyncHandler(async (req, res) => {
  return res.status(200).json(formatMessage(true, "getUsers called after protect authMiddleware"));
});

//@route  POST api/users/login
//@desc   Logs in user, given a valid email and password.
//@access Public
const loginUser = asyncHandler(async (req, res) => {
  if (req.session.email){
    return res.status(400).json(formatMessage(false, "User already logged in"));
  }
  const {email, password} = req.body;

  //Verify all fields exist.
  if (!email || !password){
    return res.status(400).json(formatMessage(false, "Missing fields"));
  }

  //Verify valid user
  const user = await User.findOne({ email });
  if (!user){
    return res.status(400).json(formatMessage(false, "Email is not registered"));
  }

  compare(password, user.password, function(err, result){
    if (!result) {
      return res.status(401).json(formatMessage(false, "Incorrect password"));
    }

    //Store email in session
    req.session.email = user.email;

    //Return user object with token
    return res.json(formatMessage(true, "Login Successfully"));
  });


});

//@route  POST api/users/logout
//@desc   Logs out user, if the user is logged in.
//@access Public
const logoutUser = asyncHandler(async (req, res) => {
  if (!req.session.email){
    return res.status(400).json(formatMessage(false, "User is not logged in"));
  }

  req.session.destroy(function(err){
    if (err) return res.status(500).json(formatMessage(false, "Deleting session error"));
    return res.json(formatMessage(true, "User has successfully logged out"));
  });
});

export {
  registerUser,
  getUsers,
  loginUser,
  logoutUser
};
