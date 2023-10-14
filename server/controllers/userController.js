import asyncHandler from "express-async-handler";

//@route  POST api/users
//@desc   [DESCRIPTION OF WHAT ROUTE DOES]
//@access Public
const registerUser = asyncHandler(async (req, res) => {});

//@route  GET api/users
//@desc   [DESCRIPTION OF WHAT ROUTE DOES]
//@access Private
const getUsers = asyncHandler(async (req, res) => {});

//@route  POST api/users/login
//@desc   [DESCRIPTION OF WHAT ROUTE DOES]
//@access Public
const loginUser = asyncHandler(async (req, res) => {});

export {
  registerUser,
  getUsers,
  loginUser
};