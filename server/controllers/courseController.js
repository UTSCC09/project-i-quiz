import asyncHandler from "express-async-handler";

//@route  POST api/courses
//@desc   [DESCRIPTION OF WHAT ROUTE DOES]
//@access Private
const createCourse = asyncHandler(async (req, res) => {});

//@route  GET api/courses
//@desc   [DESCRIPTION OF WHAT ROUTE DOES]
//@access Private
const getCourses = asyncHandler(async (req, res) => {});

//@route  POST api/courses/enroll
//@desc   [DESCRIPTION OF WHAT ROUTE DOES]
//@access Private
const enrollInCourse = asyncHandler(async (req, res) => {});

//@route  POST api/courses/drop
//@desc   [DESCRIPTION OF WHAT ROUTE DOES]
//@access Private
const dropCourse = asyncHandler(async (req, res) => {});

export {
  createCourse,
  getCourses,
  enrollInCourse,
  dropCourse
};