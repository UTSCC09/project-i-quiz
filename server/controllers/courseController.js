import asyncHandler from "express-async-handler";
import Course from "../models/Course.js";
import User from "../models/User.js";
import formatMessage from "../utils/utils.js";

//@route  POST api/courses
//@desc   Allow instructor to create a course
//@access Private
const createCourse = asyncHandler(async (req, res) => {
  const { courseCode, courseName, semester, numOfSessions } = req.body;

  //Check if valid user
  const instructor = await User.findOne({ email: req.session.email });
  if (!instructor) {
    return res.status(400).json(formatMessage(false, "Invalid user"));
  }
  else if (instructor.type !== "instructor") {
    return res.status(400).json(formatMessage(false, "Invalid user type"));
  }

  //Verify all fields exist
  if (!courseCode || !courseName || !semester || !numOfSessions) {
    return res.status(400).json(formatMessage(false, "Missing fields"));
  }

  //Check if there is a pre-existing course
  const existingCourse = await Course.findOne(
    {$and: [
      {$or: [
        { courseCode: courseCode },
        { courseName: courseName }
      ]},
      { semester: semester }
    ]});
  if (existingCourse) {
    return res.status(400).json(formatMessage(false, "Course already exists"));
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
    semester: semester,
    instructor: instructor._id,
    sessions: sessions
  });
  if (course) {
    instructor.courses.push(course._id);
    await instructor.save();
    return res.status(200).json(formatMessage(true, "Course created successfully"));
  }
});

//@route  GET api/courses/instructed
//@desc   Retrieve all courses taught by signed in instructor
//@access Private
const getMyInstructedCourses = asyncHandler(async (req, res) => {
  // Check if the user is a valid instructor
  const instructor = await User.findOne({ email: req.session.email });
  if (!instructor) {
    return res.status(400).json(formatMessage(false, "Invalid user"));
  } else if (instructor.type !== "instructor") {
    return res.status(400).json(formatMessage(false, "Invalid user type"));
  }

  // Fetch courses in parallel
  const instructedCoursesPromises = instructor.courses.map(async (courseId) => {
    const course = await Course.findById(courseId);
    return fetchFormattedCourse(course, instructor);
  });

  const instructedCourses = await Promise.all(instructedCoursesPromises);

  return res
    .status(200)
    .json(formatMessage(true, "Courses retrieved successfully", instructedCourses));
});

//@route  GET api/courses/enrolled
//@desc   Retrieve all courses signed in student is enrolled in
//@access Private
const getMyEnrolledCourses = asyncHandler(async (req, res) => {
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
    const course = await Course.findById(student.courses[i]);
    const instructor = await User.findById(course.instructor);
    //Students should only be able to see the course code, course name, and instructor name
    enrolledCourses.push({
      courseCode: course.courseCode,
      courseName: course.courseName,
      instructor: instructor.firstName + " " + instructor.lastName
    });
  }

  //Retrieve courses
  return res.status(200).json(formatMessage(true, "Courses retrieved successfully", enrolledCourses));
});

//@route  GET api/courses
//@desc   Retrieve all courses
//@access Private
const getAllCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({});
  const formattedCourses = [];
  for (let i = 0; i < courses.length; i++) {
    const instructor = await User.findById(courses[i].instructor);
    const formattedSessions = [];
    for (let j = 0; j < courses[i].sessions.length; j++) {
      formattedSessions.push({
        sessionNumber: courses[i].sessions[j].sessionNumber,
        enrollment: courses[i].sessions[j].enrollment
      });
    }
    formattedCourses.push({
      courseCode: courses[i].courseCode,
      courseName: courses[i].courseName,
      instructorName: instructor.firstName + " " + instructor.lastName,
      instructorEmail: instructor.email,
      sessions: formattedSessions      
    });
  }
  return res.status(200).json(formatMessage(true, "Courses retrieved successfully", formattedCourses));
});

//@route  POST api/courses/enroll
//@desc   Add student to their desired course session
//@access Private
const enrollInCourse = asyncHandler(async (req, res) => {
  const { courseId, sessionNumber } = req.body;

  //Check if valid user
  const student = await User.findOne({ email: req.session.email });
  if (!student) {
    return res.status(400).json(formatMessage(false, "Invalid user"));
  }
  else if (student.type !== "student") {
    return res.status(400).json(formatMessage(false, "Invalid user type"));
  }

  //Verify all fields exist
  if (!courseId || !sessionNumber) {
    return res.status(400).json(formatMessage(false, "Missing fields"));
  }

  //Check if valid course and session
  const course = await Course.findById(courseId);
  if (!course || !course.sessions[sessionNumber - 1]) {
    return res.status(400).json(formatMessage(false, "Invalid course or session"));
  }

  //Check if student is already enrolled in the specified course
  if (student.courses.includes(courseId)) {
    //Check if student is already enrolled in the specified session
    if (course.sessions[sessionNumber - 1].students.includes(student._id)) {
      return res.status(400).json(formatMessage(false, "Student already enrolled in course"));
    }

    //Remove student from the other session they're enrolled in
    for (let i = 0; i < course.sessions.length; i++) {
      if (course.sessions[i].students.includes(student._id)) {
        course.sessions[i].students = course.sessions[i].students.filter(studentId => studentId.toString() !== student._id.toString());
        course.sessions[i].enrollment--;
        await course.save();
        break;
      }
    }
  }
  else {
    student.courses.push(courseId);
    await student.save();
  }

  //Enroll student
  course.sessions[sessionNumber - 1].students.push(student._id);
  course.sessions[sessionNumber - 1].enrollment++;
  await course.save();

  return res.status(200).json(formatMessage(true, "Student enrolled successfully"));
});

//@route  POST api/courses/drop
//@desc   Remove student from the course
//@access Private
const dropCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.body;

  //Check if valid user
  const student = await User.findOne({ email: req.session.email });
  if (!student) {
    return res.status(400).json(formatMessage(false, "Invalid user"));
  }
  else if (student.type !== "student") {
    return res.status(400).json(formatMessage(false, "Invalid user type"));
  }

  //Verify all fields exist
  if (!courseId) {
    return res.status(400).json(formatMessage(false, "Missing fields"));
  }

  //Check if valid course
  const course = await Course.findById(courseId);
  if (!course) {
    return res.status(400).json(formatMessage(false, "Invalid course"));
  }

  //Check if student is enrolled in the specified course
  if (student.courses.includes(courseId)) {
    //Remove course from student's courses
    student.courses = student.courses.filter(courseId => courseId.toString() !== course._id.toString());
    await student.save();

    //Remove student from the course
    for (let i = 0; i < course.sessions.length; i++) {
      if (course.sessions[i].students.includes(student._id)) {
        course.sessions[i].students = course.sessions[i].students.filter(studentId => studentId.toString() !== student._id.toString());
        course.sessions[i].enrollment--;
        await course.save();
        break;
      }
    }
  }
  else {
    return res.status(400).json(formatMessage(false, "Student not enrolled in course"));
  }

  return res.status(200).json(formatMessage(true, "Student dropped successfully"));
});

// ------------------------------ Helper functions ------------------------------
async function fetchFormattedCourse(course, instructor) {
  const formattedSessionsPromises = course.sessions.map(async (session) => {
    const formattedStudentsPromises = session.students.map(async (studentId) => {
      const student = await User.findById(studentId);
      return {
        studentName: student.firstName + " " + student.lastName,
        studentEmail: student.email,
      };
    });

    const formattedStudents = await Promise.all(formattedStudentsPromises);

    return {
      sessionNumber: session.sessionNumber,
      enrollment: session.enrollment,
      students: formattedStudents,
    };
  });

  const formattedSessions = await Promise.all(formattedSessionsPromises);

  return {
    courseCode: course.courseCode,
    courseName: course.courseName,
    semester: course.semester,
    instructor: instructor.firstName + " " + instructor.lastName + " (Me)",
    sessions: formattedSessions,
  };
}

export {
  createCourse,
  getMyInstructedCourses,
  getMyEnrolledCourses,
  getAllCourses,
  enrollInCourse,
  dropCourse
};
