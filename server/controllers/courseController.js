import asyncHandler from "express-async-handler";
import Course from "../models/Course.js";
import User from "../models/User.js";
import formatMessage from "../utils/utils.js";

//@route  POST api/courses
//@desc   Allow instructor to create a course
//@access Private
const createCourse = asyncHandler(async (req, res) => {
  const {
    courseCode,
    courseName,
    courseSemester,
    numOfSessions,
    accessCode,
    accentColor,
  } = req.body;

  //Verify all fields exist
  if (!courseCode || !courseName || !courseSemester || !numOfSessions) {
    return res.status(400).json(formatMessage(false, "Missing fields"));
  }

  //Check if valid user
  const instructor = await User.findOne({ email: req.session.email });
  if (!instructor) {
    return res.status(400).json(formatMessage(false, "Invalid user"));
  } else if (instructor.type !== "instructor") {
    return res.status(400).json(formatMessage(false, "Invalid user type"));
  }

  //Check if there is a pre-existing course in the instructor's course list
  const existingCourse = await Course.findOne({
    $and: [
      { $or: [{ courseCode: courseCode }, { courseName: courseName }] },
      { courseSemester: courseSemester },
    ],
  });
  if (
    existingCourse &&
    instructor.courses.findIndex((course) =>
      course.courseId.equals(existingCourse._id)
    ) !== -1
  ) {
    return res.status(400).json(formatMessage(false, "Course already exists"));
  }

  //Create sessions
  const sessions = [];
  for (let i = 0; i < numOfSessions; i++) {
    sessions.push({
      sessionNumber: i + 1,
      students: [],
      enrollment: 0,
    });
  }

  //Create course
  const course = await Course.create({
    courseCode: courseCode,
    courseName: courseName,
    courseSemester: courseSemester,
    instructor: instructor._id,
    sessions: sessions,
    accessCode: accessCode,
  });
  if (course) {
    instructor.courses.push({
      courseId: course._id,
      accentColor: accentColor,
    });
    await instructor.save();
    return res
      .status(200)
      .json(formatMessage(true, "Course created successfully", course));
  } else {
    return res.status(400).json(formatMessage(false, "Course creation failed"));
  }
});

//@route  POST api/courses/access_code
//@desc   Allow instructor to update access code for a course
//@access Private
const setAccessCode = asyncHandler(async (req, res) => {
  const { courseId, accessCode } = req.body;

  // Verify all fields exist
  if (!courseId || !accessCode) {
    return res.status(400).json(formatMessage(false, "Missing fields"));
  }

  // Check if valid user
  const instructor = await User.findOne({ email: req.session.email });
  if (!instructor) {
    return res.status(400).json(formatMessage(false, "Invalid user"));
  } else if (instructor.type !== "instructor") {
    return res.status(400).json(formatMessage(false, "Invalid user type"));
  }

  const courseObject = await Course.findById(courseId);

  // Check if valid course
  if (!courseObject) {
    return res.status(400).json(formatMessage(false, "Invalid courseId"));
  }

  // Check if the user is the course instructor
  if (!courseObject.instructor.equals(instructor._id)) {
    return res.status(400).json(formatMessage(false, "Access denied"));
  }

  // Check if the access code already exists
  const targetCourse = await Course.findOne({ accessCode: accessCode });
  if (targetCourse) {
    return res
      .status(400)
      .json(
        formatMessage(
          false,
          `Access code "${accessCode}" is unavailable. Try another one.`
        )
      );
  }

  const updatedCourse = await Course.updateOne(
    { _id: courseId },
    { $set: { accessCode: accessCode } }
  );
  if (updatedCourse) {
    await courseObject.save();
    return res
      .status(200)
      .json(
        formatMessage(true, "Access code updated successfully", accessCode)
      );
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

  const instructedCourses = await getInstructedCourses(instructor.email);

  return res
    .status(200)
    .json(
      formatMessage(true, "Courses retrieved successfully", instructedCourses)
    );
});

//@route  POST api/courses/instructed/availability
//@desc   Allow instructor to get a course by course name
//@access Private
const checkNewCourseAvailability = asyncHandler(async (req, res) => {
  const { courseCode, courseName, courseSemester } = req.body;
  if (!((courseName && courseSemester) || (courseCode && courseSemester))) {
    return res.status(400).json(formatMessage(false, "Missing fields"));
  }

  //Check if valid user
  const instructor = await User.findOne({ email: req.session.email });
  if (!instructor) {
    return res.status(400).json(formatMessage(false, "Invalid user"));
  } else if (instructor.type !== "instructor") {
    return res.status(400).json(formatMessage(false, "Invalid user type"));
  }

  //Check if there is a pre-existing course in the instructor's course list
  const existingCourse = await Course.findOne({
    $and: [
      { $or: [{ courseCode: courseCode }, { courseName: courseName }] },
      { courseSemester: courseSemester },
    ],
  });
  if (!existingCourse || !existingCourse.instructor.equals(instructor._id)) {
    return res
      .status(200)
      .json(
        formatMessage(
          true,
          "You are able to create the course with the provided properties"
        )
      );
  }
  return res
    .status(400)
    .json(
      formatMessage(
        false,
        "The course already exists in your course list",
        existingCourse
      )
    );
});

//@route  GET api/courses/enrolled
//@desc   Retrieve all courses signed in student is enrolled in
//@access Private
const getMyEnrolledCourses = asyncHandler(async (req, res) => {
  // Check if the user is a valid student
  const student = await User.findOne({ email: req.session.email });
  if (!student) {
    return res.status(400).json(formatMessage(false, "Invalid user"));
  } else if (student.type !== "student") {
    return res.status(400).json(formatMessage(false, "Invalid user type"));
  }

  const enrolledCourses = await getEnrolledCourses(req.session.email);

  //Retrieve courses
  return res
    .status(200)
    .json(
      formatMessage(true, "Courses retrieved successfully", enrolledCourses)
    );
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
        enrollment: courses[i].sessions[j].enrollment,
      });
    }
    formattedCourses.push({
      courseCode: courses[i].courseCode,
      courseName: courses[i].courseName,
      instructorName: instructor.firstName + " " + instructor.lastName,
      instructorEmail: instructor.email,
      sessions: formattedSessions,
    });
  }
  return res
    .status(200)
    .json(
      formatMessage(true, "Courses retrieved successfully", formattedCourses)
    );
});

//@route  GET api/courses/:courseId
//@desc   Retrieve course by courseId
//@access Private
const getCourse = asyncHandler(async (req, res) => {
  const courseId = req.params.courseId;

  const user = await User.findOne({ email: req.session.email });
  // Check if the user is valid
  if (!user) {
    return res.status(400).json(formatMessage(false, "Invalid user"));
  }
  let course;

  if (user.type === "student") {
    const enrolledCourses = await getEnrolledCourses(user.email);
    course = enrolledCourses.find(
      (course) => course.courseId.toString() === courseId
    );
  } else {
    const instructedCourses = await getInstructedCourses(user.email);
    course = instructedCourses.find(
      (course) => course.courseId.toString() === courseId
    );
  }

  if (!course) {
    return res.status(400).json(formatMessage(false, "Access denied"));
  }

  return res
    .status(200)
    .json(formatMessage(true, "Course retrieved successfully", course));
});

//@route  POST api/courses/enroll
//@desc   Add student to their desired course session
//@access Private
const enrollInCourse = asyncHandler(async (req, res) => {
  const { courseId, sessionNumber, accentColor } = req.body;

  //Check if valid user
  const student = await User.findOne({ email: req.session.email });
  if (!student) {
    return res.status(400).json(formatMessage(false, "Invalid user"));
  } else if (student.type !== "student") {
    return res.status(400).json(formatMessage(false, "Invalid user type"));
  }

  //Verify all fields exist
  if (!courseId || !sessionNumber) {
    return res.status(400).json(formatMessage(false, "Missing fields"));
  }

  //Check if valid course and session
  const course = await Course.findById(courseId);
  if (!course || !course.sessions[sessionNumber - 1]) {
    return res
      .status(400)
      .json(formatMessage(false, "Invalid course or session"));
  }

  //Check if student is already enrolled in the specified course
  if (
    student.courses.findIndex((course) => course.courseId == courseId) !== -1
  ) {
    //Check if student is already enrolled in the specified session
    if (course.sessions[sessionNumber - 1].students.includes(student._id)) {
      return res
        .status(400)
        .json(formatMessage(false, "Student already enrolled in course"));
    }

    //Remove student from the other session they're enrolled in
    for (let i = 0; i < course.sessions.length; i++) {
      if (course.sessions[i].students.includes(student._id)) {
        course.sessions[i].students = course.sessions[i].students.filter(
          (studentId) => studentId.toString() !== student._id.toString()
        );
        course.sessions[i].enrollment--;
        await course.save();
        break;
      }
    }
  } else {
    student.courses.push({ courseId: courseId, accentColor: accentColor });
    await student.save();
    //Enroll student
    course.sessions[sessionNumber - 1].students.push(student._id);
    course.sessions[sessionNumber - 1].enrollment++;
    await course.save();

    return res.status(200).json(
      formatMessage(true, "Student enrolled successfully", {
        courseCode: course.courseCode,
        courseSemester: course.courseSemester,
      })
    );
  }
});

//@route  GET api/courses/enroll_info/:accessCode
//@desc   Get courseId and [sessionNumber] given accessCode
//@access Private
const getCourseEnrollInfo = asyncHandler(async (req, res) => {
  const { accessCode } = req.params;

  //Check if valid user
  const student = await User.findOne({ email: req.session.email });
  if (!student) {
    return res.status(400).json(formatMessage(false, "Invalid user"));
  } else if (student.type !== "student") {
    return res.status(400).json(formatMessage(false, "Invalid user type"));
  }

  //Check if valid course and session
  const course = await Course.findOne({ accessCode: accessCode });
  if (!course) {
    return res
      .status(400)
      .json(formatMessage(false, "Invalid course access code"));
  }

  //Check if student is already enrolled in the specified course
  if (
    student.courses.findIndex((studentCourse) =>
      studentCourse.courseId.equals(course._id)
    ) !== -1
  ) {
    return res
      .status(400)
      .json(
        formatMessage(
          false,
          `You have already enrolled in ${course.courseCode} ${course.courseSemester}`
        )
      );
  }

  const instructor = await User.findOne({
    _id: course.instructor,
  });

  return res.status(200).json({
    success: true,
    courseId: course._id,
    courseCode: course.courseCode,
    courseSemester: course.courseSemester,
    instructor: instructor.firstName + " " + instructor.lastName,
    sessions: course.sessions.map((session) => session.sessionNumber),
  });
});

//@route  POST api/courses/drop
//@desc   Remove student from the course
//@access Private
const dropCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.body;

  // Verify all fields exist
  if (!courseId) {
    return res.status(400).json(formatMessage(false, "Missing fields"));
  }

  // Check if valid user
  const student = await User.findOne({ email: req.session.email });
  if (!student) {
    return res.status(400).json(formatMessage(false, "Invalid user"));
  } else if (student.type !== "student") {
    return res.status(400).json(formatMessage(false, "Invalid user type"));
  }

  // Check if valid course
  const course = await Course.findById(courseId);
  if (!course) {
    return res.status(400).json(formatMessage(false, "Invalid course"));
  }

  // Remove course from student enrolled course list
  const courseIndex = student.courses.findIndex(
    (course) => course.courseId.toString() === courseId
  );
  if (courseIndex === -1) {
    return res
      .status(400)
      .json(formatMessage(false, "Student not enrolled in the course"));
  }
  student.courses.splice(courseIndex, 1);
  await student.save();

  // Remove student from the course
  for (let i = 0; i < course.sessions.length; i++) {
    if (course.sessions[i].students.includes(student._id)) {
      course.sessions[i].students = course.sessions[i].students.filter(
        (studentId) => studentId.toString() !== student._id.toString()
      );
      course.sessions[i].enrollment--;
      await course.save();
      break;
    }
  }

  return res
    .status(200)
    .json(formatMessage(true, "Student dropped successfully"));
});

//@route  POST api/courses/archive
//@desc   Archive or unarchive course (flips boolean value).
//@access Private
const archiveCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.body;

  if (!courseId) {
    return res.status(400).json(formatMessage(false, "Missing fields"));
  }

  const user = await User.findOne({ email: req.session.email });

  if (!user) {
    return res.status(400).json(formatMessage(false, "Invalid user"));
  }

  const courseIndex = user.courses.findIndex(
    (course) => course.courseId.toString() === courseId
  );

  if (courseIndex === -1) {
    return res.status(400).json(formatMessage(false, "Not enrolled in course"));
  }

  if (user.courses[courseIndex].archived) {
    user.courses[courseIndex].archived = false;
    await user.save();
    return res.json(
      formatMessage(true, "Successfully unarchived user's course")
    );
  } else {
    user.courses[courseIndex].archived = true;
    await user.save();
    return res.json(formatMessage(true, "Successfully archived user's course"));
  }
});

//@route  POST api/courses/accent_color
//@desc   Set accent color for a specific course
//@access Private
const setAccentColor = asyncHandler(async (req, res) => {
  const { courseId, accentColor } = req.body;

  // Verify all fields exist
  if (!courseId || !accentColor) {
    return res.status(400).json(formatMessage(false, "Missing fields"));
  }

  // Check if valid user
  const user = await User.findOne({ email: req.session.email });

  // Check if valid course
  const course = await Course.findById(courseId);
  if (!course) {
    return res.status(400).json(formatMessage(false, "Invalid courseId"));
  }

  // Check if the student is enrolled in the course
  const courseIndex = user.courses.findIndex(
    (course) => course.courseId.toString() === courseId
  );

  if (courseIndex === -1) {
    return res
      .status(400)
      .json(
        formatMessage(
          false,
          "The user has not enrolled in or instructed the course"
        )
      );
  }
  const updatedUser = await User.updateOne(
    { _id: user._id, "courses.courseId": courseId },
    { $set: { "courses.$.accentColor": accentColor } }
  );
  if (updatedUser) {
    await user.save();
    return res
      .status(200)
      .json(formatMessage(true, "Accent color set successfully", updatedUser));
  } else {
    return res
      .status(500)
      .json(formatMessage(false, "Could not update the color", updatedUser));
  }
});

// ------------------------------ Helper functions ------------------------------

async function getEnrolledCourses(studentEmail) {
  const student = await User.findOne({ email: studentEmail });
  if (!student || student.type !== "student") {
    return [];
  }

  const enrolledCourses = [];

  for (let i = 0; i < student.courses.length; i++) {
    const course = await Course.findById(student.courses[i].courseId);
    const instructor = await User.findById(course.instructor);
    //Students should only be able to see the course code, course name, and instructor name
    enrolledCourses.push({
      courseId: course._id,
      courseCode: course.courseCode,
      courseName: course.courseName,
      courseSemester: course.courseSemester,
      instructor: instructor.firstName + " " + instructor.lastName,
      accentColor: student.courses[i].accentColor,
      archived: student.courses[i].archived,
    });
  }
  return enrolledCourses;
}

async function getInstructedCourses(instructorEmail) {
  const instructor = await User.findOne({ email: instructorEmail });
  if (!instructor || instructor.type !== "instructor") {
    return [];
  }

  const instructedCoursesPromises = instructor.courses.map(async (course) => {
    const courseObject = await Course.findById(course.courseId);
    return fetchFormattedCourse(
      courseObject,
      course.accentColor,
      instructor,
      course.archived
    );
  });

  const instructedCourses = await Promise.all(instructedCoursesPromises);
  return instructedCourses;
}

async function fetchFormattedCourse(course, accentColor, instructor, archived) {
  if (!course) {
    return {};
  }
  const formattedSessionsPromises = course.sessions.map(async (session) => {
    const formattedStudentsPromises = session.students.map(
      async (studentId) => {
        const student = await User.findById(studentId);
        if (student) {
          return {
            studentName: student.firstName + " " + student.lastName,
            studentEmail: student.email,
          };
        }
      }
    );

    const formattedStudents = await Promise.all(formattedStudentsPromises);

    return {
      sessionNumber: session.sessionNumber,
      enrollment: session.enrollment,
      students: formattedStudents,
    };
  });

  const formattedSessions = await Promise.all(formattedSessionsPromises);

  return {
    courseId: course._id,
    courseCode: course.courseCode,
    courseName: course.courseName,
    courseSemester: course.courseSemester,
    accentColor: accentColor,
    accessCode: course.accessCode,
    instructor: instructor.firstName + " " + instructor.lastName + " (Me)",
    sessions: formattedSessions,
    quizzes: course.quizzes,
    archived: archived,
  };
}

export {
  createCourse,
  setAccessCode,
  getMyInstructedCourses,
  getMyEnrolledCourses,
  getAllCourses,
  enrollInCourse,
  dropCourse,
  archiveCourse,
  setAccentColor,
  getCourseEnrollInfo,
  getCourse,
  checkNewCourseAvailability,
};
