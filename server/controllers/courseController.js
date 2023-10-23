import asyncHandler from "express-async-handler";
import Course from "../models/Course.js";
import User from "../models/User.js";
import formatMessage from "../utils/utils.js";

//@route  POST api/courses
//@desc   Allow instructor to create a course
//@access Private
const createCourse = asyncHandler(async (req, res) => {
  const { courseCode, courseName, numOfSessions } = req.body;

  //Verify all fields exist
  if (!courseCode || !courseName || !numOfSessions) {
    return res.status(400).json(formatMessage(false, "Missing fields"));
  }

  //Check if there is a pre-existing course
  const existingCourse = await Course.findOne(
    { $or: [
      { courseCode: courseCode },
      { courseName: courseName }
    ] });
  if (existingCourse) {
    return res.status(400).json(formatMessage(false, "Course already exists"));
  }

  //Check if valid user
  const instructor = await User.findOne({ email: req.session.email });
  if (!instructor) {
    return res.status(400).json(formatMessage(false, "Invalid user"));
  }
  else if (instructor.type !== "instructor") {
    return res.status(400).json(formatMessage(false, "Invalid user type"));
  }

  //Create sessions
  const sessions = [];
  for (let i = 0; i < numOfSessions; i++) {
    sessions.push({
      sessionNumber: i + 1,
      students: [],
      enrollment: 0
    });
  }

  //Create course
  const course = await Course.create({
    courseCode: courseCode,
    courseName: courseName,
    instructor: instructor._id,
    sessions: sessions
  });
  if (course) {
    instructor.courses.push(course._id);
    await instructor.save();
    return res.status(200).json(formatMessage(true, "Course created successfully"));
  }
});

//@route  GET api/courses/instructed/:instructorId
//@desc   Retrieve all courses taught by particular instructor
//@access Private
const getCoursesInstructedBy = asyncHandler(async (req, res) => {
  const instructorId = req.params.instructorId;

  //Check if valid user
  const instructor = await User.findById(instructorId);
  if (!instructor) {
    return res.status(400).json(formatMessage(false, "Invalid user"));
  }
  else if (instructor.type !== "instructor") {
    return res.status(400).json(formatMessage(false, "Invalid user type"));
  }

  const instructedCourses = [];
  for (let i = 0; i < instructor.courses.length; i++) {
    instructedCourses.push(await Course.findById(instructor.courses[i]));
  }

  //Retrieve courses
  return res.status(200).json(formatMessage(true, "Courses retrieved successfully", instructedCourses));
});

//@route  GET api/courses/enrolled
//@desc   Retrieve all courses particular student is enrolled in
//@access Private
const getCoursesEnrolledIn = asyncHandler(async (req, res) => {
  //Check if valid user
  const student = await User.findOne({ email: req.session.email });
  if (!student) {
    return res.status(400).json(formatMessage(false, "Invalid user"));
  }
  else if (student.type !== "student") {
    return res.status(400).json(formatMessage(false, "Invalid user type"));
  }

  const enrolledCourses = [];
  for (let i = 0; i < student.courses.length; i++) {
    enrolledCourses.push(await Course.findById(student.courses[i]));
  }

  //Retrieve courses
  return res.status(200).json(formatMessage(true, "Courses retrieved successfully", enrolledCourses));
});

//@route  POST api/courses/enroll
//@desc   [DESCRIPTION OF WHAT ROUTE DOES]
//@access Private
const enrollInCourse = asyncHandler(async (req, res) => {
  
});

//@route  POST api/courses/drop
//@desc   [DESCRIPTION OF WHAT ROUTE DOES]
//@access Private
const dropCourse = asyncHandler(async (req, res) => {});

export {
  createCourse,
  getCoursesInstructedBy,
  getCoursesEnrolledIn,
  enrollInCourse,
  dropCourse
};