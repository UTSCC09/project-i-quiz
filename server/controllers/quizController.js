import asyncHandler from "express-async-handler";
import formatMessage from "../utils/utils.js";
import Quiz from "../models/Quiz.js";
import MCQ from "../models/MCQ.js";
import MSQ from "../models/MSQ.js";
import CLO from "../models/CLO.js";
import OEQ from "../models/OEQ.js";
import User from "../models/User.js";
import Course from "../models/Course.js";
import { isValidObjectId } from "mongoose";
import QuizResponse from "../models/QuizResponse.js";

//@route  POST api/quizzes
//@desc   Allow instructor to create a quiz
//@access Private
const createQuiz = asyncHandler(async (req, res) => {
  const { quizName, startTime, endTime, isDraft, course, questions } =
    req.body;
  //Check if valid user
  try {
    const instructor = await User.findOne({ email: req.session.email });
    if (!instructor) {
      return res.status(400).json(formatMessage(false, "Invalid user"));
    } else if (instructor.type !== "instructor") {
      return res.status(400).json(formatMessage(false, "Invalid user type"));
    }
  } catch (error) {
    return res
      .status(400)
      .json(formatMessage(false, "Mongoose error finding user"));
  }

  //Verify all fields exist
  if (
    !quizName ||
    !isDraft ||
    ((!startTime || !endTime) && !isDraft) ||
    !course ||
    !questions
  ) {
    return res.status(400).json(formatMessage(false, "Missing fields"));
  }

  //Verify valid course
  let courseToAddTo;
  try {
    courseToAddTo = await Course.findById(course);
    if (!courseToAddTo) {
      return res.status(400).json(formatMessage(false, "Invalid course id"));
    }
    if (!courseToAddTo.instructor.equals(instructor._id)) {
      return res
        .status(400)
        .json(formatMessage(false, "No access to the course"));
    }
  } catch (error) {
    return res
      .status(400)
      .json(formatMessage(false, "Mongoose error finding course"));
  }

  let startTimeConverted, endTimeConverted;
  if (!isDraft) {
    //Convert startTime and endTime to Date objects
    startTimeConverted = new Date(startTime);
    endTimeConverted = new Date(endTime);

    //Verify startTime and endTime are valid dates and startTime is before endTime
    if (
      isNaN(startTimeConverted) ||
      isNaN(endTimeConverted) ||
      startTime >= endTime
    ) {
      return res
        .status(400)
        .json(formatMessage(false, "Invalid start and/or end time"));
    }
  }

  //Check if there is a pre-existing quiz
  try {
    const existingQuiz = await Quiz.findOne({
      $and: [{ quizName: quizName }, { course: course }],
    });
    if (existingQuiz) {
      return res.status(400).json(formatMessage(false, "Quiz already exists"));
    }
  } catch (error) {
    return res
      .status(400)
      .json(formatMessage(false, "Mongoose error finding existing quiz"));
  }

  //Quiz questions
  const quizQuestions = [];

  //Create questions
  for (let i = 0; i < questions.length; i++) {
    let createdQuestion;
    try {
      switch (questions[i].type) {
        case "MCQ":
          const validMCQChoices = questions[i].choices.every(
            (choice) => choice.id && choice.content
          );
          if (!validMCQChoices) {
            return res
              .status(400)
              .json(formatMessage(false, "Invalid choices in MCQ question"));
          }
          createdQuestion = await MCQ.create(questions[i]);
          break;
        case "MSQ":
          const validMSQChoices = questions[i].choices.every(
            (choice) => choice.id && choice.content
          );
          if (!validMSQChoices) {
            return res
              .status(400)
              .json(formatMessage(false, "Invalid choices in MSQ question"));
          }
          createdQuestion = await MSQ.create(questions[i]);
          break;
        case "CLO":
          createdQuestion = await CLO.create(questions[i]);
          break;
        case "OEQ":
          createdQuestion = await OEQ.create(questions[i]);
          break;
        default:
          return res
            .status(400)
            .json(
              formatMessage(
                false,
                `Invalid question type ${questions[i].type}`
              )
            );
      }
    } catch (error) {
      return res
        .status(400)
        .json(formatMessage(false, "Mongoose error creating question"));
    }

    if (!createdQuestion) {
      return res
        .status(400)
        .json(formatMessage(false, "Question creation failed"));
    } else {
      quizQuestions.push({
        question: createdQuestion._id,
        type: questions[i].type,
      });
    }
  }

  //Create quiz
  const quiz = await Quiz.create({
    quizName: quizName,
    isDraft: isDraft,
    startTime: startTimeConverted ?? undefined,
    endTime: endTimeConverted ?? undefined,
    course: course,
    questions: quizQuestions,
  });
  if (quiz) {
    courseToAddTo.quizzes.push(quiz._id);
    await courseToAddTo.save();
    return res
      .status(201)
      .json(formatMessage(true, "Quiz created successfully", quiz));
  } else {
    return res.status(400).json(formatMessage(false, "Quiz creation failed"));
  }
});

//@route  POST api/quizzes/:quizId/release
//@desc   Allow instructor to release a quiz
//@access Private
const releaseQuiz = asyncHandler(async (req, res) => {
  const { startTime, endTime } = req.body;
  //Verify all fields exist
  if (!startTime || !endTime) {
    return res.status(400).json(formatMessage(false, "Missing fields"));
  }

  //Check if valid user
  let instructor;
  try {
    instructor = await User.findOne({ email: req.session.email });
    if (!instructor) {
      return res.status(400).json(formatMessage(false, "Invalid user"));
    } else if (instructor.type !== "instructor") {
      return res.status(400).json(formatMessage(false, "Invalid user type"));
    }
  } catch (error) {
    return res
      .status(400)
      .json(formatMessage(false, "Mongoose error finding user"));
  }

  let quiz;
  try {
    quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) {
      return res.status(400).json(formatMessage(false, "Invalid quiz id"));
    }
    if (!quiz.isDraft) {
      return res
        .status(400)
        .json(formatMessage(false, "Quiz has already been released"));
    }
  } catch (error) {
    return res
      .status(400)
      .json(formatMessage(false, "Mongoose error finding quiz"));
  }

  //Convert startTime and endTime to Date objects
  const startTimeConverted = new Date(startTime);
  const endTimeConverted = new Date(endTime);

  //Verify startTime and endTime are valid dates and startTime is before endTime
  if (
    isNaN(startTimeConverted) ||
    isNaN(endTimeConverted) ||
    startTime >= endTime
  ) {
    return res
      .status(400)
      .json(formatMessage(false, "Invalid start and/or end time"));
  }

  quiz.isDraft = false;
  quiz.startTime = startTimeConverted;
  quiz.endTime = endTimeConverted;

  await quiz.save();
  return res
    .status(200)
    .json(formatMessage(true, "Quiz released successfully", quiz));
});

//@route  POST api/quizzes/update
//@desc   Allow instructor to update a quiz
//@access Private
const updateQuiz = asyncHandler(async (req, res) => {
  const { quizId, quizName, course, questions } = req.body;

  //Verify all fields exist
  if (!quizName || !course || !questions) {
    return res.status(400).json(formatMessage(false, "Missing fields"));
  }

  //Check if valid user
  let instructor;
  try {
    instructor = await User.findOne({ email: req.session.email });
    if (!instructor) {
      return res.status(400).json(formatMessage(false, "Invalid user"));
    } else if (instructor.type !== "instructor") {
      return res.status(400).json(formatMessage(false, "Invalid user type"));
    }
  } catch (error) {
    return res
      .status(400)
      .json(formatMessage(false, "Mongoose error finding user"));
  }

  //Verify valid course
  let courseToAddTo;
  try {
    courseToAddTo = await Course.findById(course);
    if (!courseToAddTo) {
      return res.status(400).json(formatMessage(false, "Invalid course id"));
    }
    if (!courseToAddTo.instructor.equals(instructor._id)) {
      return res.status(400).json(formatMessage(false, "Access denied"));
    }
  } catch (error) {
    return res
      .status(400)
      .json(formatMessage(false, "Mongoose error finding course"));
  }

  // verify quiz id
  const existingQuiz = await Quiz.findById(quizId);
  if (!existingQuiz) {
    return res.status(400).json(formatMessage(false, "Invalid quiz id"));
  }

  const quizQuestions = await Promise.all(
    questions.map(async (question) => {
      if (question._id && isValidObjectId(question._id)) {
        const existingQuestion = await Promise.all([
          MCQ.findById(question._id),
          MSQ.findById(question._id),
          OEQ.findById(question._id),
          CLO.findById(question._id),
        ]);
        if (existingQuestion.filter((q) => q).length === 1) {
          await editQuestion(question, res);
          return { question: question._id, type: question.type };
        }
      }
      const createdQuestion = await createQuestion(question, res);
      if (!createdQuestion) {
        return res
          .status(400)
          .json(formatMessage(false, "Question creation failed"));
      } else {
        return { question: createdQuestion._id, type: question.type };
      }
    })
  );

  existingQuiz.quizName = quizName;
  existingQuiz.course = course;
  existingQuiz.questions = quizQuestions;

  await existingQuiz.save();
  return res
    .status(200)
    .json(formatMessage(true, "Quiz updated successfully"));
});

//@route  DELETE api/quizzes/:quizId
//@desc   Allow instructor to update a quiz
//@access Private
const deleteDraftQuiz = asyncHandler(async (req, res) => {
  const { quizId } = req.params;

  //Verify all fields exist
  if (!quizId) {
    return res.status(400).json(formatMessage(false, "Missing parameter"));
  }

  //Check if valid user
  let instructor;
  try {
    instructor = await User.findOne({ email: req.session.email });
    if (!instructor) {
      return res.status(400).json(formatMessage(false, "Invalid user"));
    } else if (instructor.type !== "instructor") {
      return res.status(400).json(formatMessage(false, "Invalid user type"));
    }
  } catch (error) {
    return res
      .status(400)
      .json(formatMessage(false, "Mongoose error finding user"));
  }

  // verify quiz id
  const existingQuiz = await Quiz.findById(quizId);
  if (!existingQuiz) {
    return res.status(400).json(formatMessage(false, "Invalid quiz id"));
  }

  // verify quiz status
  if (!existingQuiz.isDraft) {
    return res
      .status(400)
      .json(formatMessage(false, "Cannot delete released quizzes"));
  }

  // verify access to the quiz
  let course;
  try {
    course = await Course.findById(existingQuiz.course);
    if (!course) {
      return res.status(400).json(formatMessage(false, "Invalid course id"));
    }
    if (!course.instructor.equals(instructor._id)) {
      return res.status(400).json(formatMessage(false, "Access denied"));
    }
  } catch (error) {
    return res
      .status(400)
      .json(formatMessage(false, "Mongoose error finding course"));
  }
  await Quiz.deleteOne({ _id: quizId });
  await Course.updateOne({ _id: course }, { $pull: { quizzes: quizId } });

  return res
    .status(200)
    .json(formatMessage(true, "Quiz deleted successfully"));
});

//@route  GET api/quizzes/:quizId
//@desc   Allow instructor get a specific quiz
//@access Private
const getQuiz = asyncHandler(async (req, res) => {
  //Check if valid user
  let instructor;
  try {
    instructor = await User.findOne({ email: req.session.email });
    if (!instructor) {
      return res.status(400).json(formatMessage(false, "Invalid user"));
    } else if (instructor.type !== "instructor") {
      return res.status(400).json(formatMessage(false, "Invalid user type"));
    }
  } catch (error) {
    return res
      .status(400)
      .json(formatMessage(false, "Mongoose error finding user"));
  }

  let quiz;
  try {
    quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) {
      return res.status(400).json(formatMessage(false, "Invalid quiz id"));
    }
  } catch (error) {
    return res
      .status(400)
      .json(formatMessage(false, "Mongoose error finding quiz"));
  }

  let course;
  try {
    course = await Course.findById(quiz.course);
    if (!course) {
      return res
        .status(400)
        .json(formatMessage(false, "Invalid course id in quiz"));
    }
  } catch (error) {
    return res
      .status(400)
      .json(formatMessage(false, "Mongoose error finding quiz course"));
  }

  //Check if instructor teaches course
  if (course.instructor.toString() !== instructor._id.toString()) {
    return res
      .status(403)
      .json(formatMessage(false, "Instructor does not teach course"));
  }

  return res.status(200).json(formatMessage(true, "Quiz found", quiz));
});

//@route  GET api/quizzes/course/instructed/:courseId
//@desc   Allow instructor get all quizzes for a course they teach
//@access Private
const getQuizzesForInstructedCourse = asyncHandler(async (req, res) => {
  //Check if valid user
  let instructor;
  try {
    instructor = await User.findOne({ email: req.session.email });
    if (!instructor) {
      return res.status(400).json(formatMessage(false, "Invalid user"));
    } else if (instructor.type !== "instructor") {
      return res.status(400).json(formatMessage(false, "Invalid user type"));
    }
  } catch (error) {
    return res
      .status(400)
      .json(formatMessage(false, "Mongoose error finding user"));
  }

  //Check if valid course
  let course;
  try {
    course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(400).json(formatMessage(false, "Invalid course id"));
    }
  } catch (error) {
    return res
      .status(400)
      .json(formatMessage(false, "Mongoose error finding course"));
  }

  //Check if instructor teaches course
  if (course.instructor.toString() !== instructor._id.toString()) {
    return res
      .status(403)
      .json(formatMessage(false, "Instructor does not teach course"));
  }

  //Get quizzes for course
  try {
    const quizzes = await Quiz.find({ course: req.params.courseId });
    if (!quizzes) {
      return res.status(400).json(formatMessage(false, "Invalid course"));
    }
    return res.status(200).json(
      formatMessage(
        true,
        "Quizzes found",
        quizzes.map((quiz) => {
          return {
            quizId: quiz._id,
            quizName: quiz.quizName,
            isDraft: quiz.isDraft,
            startTime: quiz.startTime,
            endTime: quiz.endTime,
          };
        })
      )
    );
  } catch (error) {
    return res
      .status(400)
      .json(formatMessage(false, "Mongoose error finding quizzes for course"));
  }
});

//@route  GET api/quizzes/course/enrolled/:courseId
//@desc   Allow student to get all quizzes for a course they are enrolled in
//@access Private
const getQuizzesForEnrolledCourse = asyncHandler(async (req, res) => {
  //Check if valid user
  let student;
  try {
    student = await User.findOne({ email: req.session.email });
    if (!student) {
      return res.status(400).json(formatMessage(false, "Invalid user"));
    } else if (student.type !== "student") {
      return res.status(400).json(formatMessage(false, "Invalid user type"));
    }
  } catch (error) {
    return res
      .status(400)
      .json(formatMessage(false, "Mongoose error finding user"));
  }

  //Check if valid course
  let course;
  try {
    course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(400).json(formatMessage(false, "Invalid course id"));
    }
  } catch (error) {
    return res
      .status(400)
      .json(formatMessage(false, "Mongoose error finding course"));
  }

  //Check if student is enrolled in course
  if (
    !student.courses.some(
      (course) => course.courseId.toString() === req.params.courseId.toString()
    )
  ) {
    return res
      .status(403)
      .json(formatMessage(false, "Student not enrolled in course"));
  }

  const formattedQuizzes = [];
  //Get quizzes for course
  for (let i = 0; i < course.quizzes.length; i++) {
    try {
      const quiz = await Quiz.findById(course.quizzes[i]);
      if (!quiz) {
        return res.status(400).json(formatMessage(false, "Invalid quiz id"));
      }
      if (!quiz.isDraft) {
        const currentDateTime = new Date();
        let currentQuizStatus = "";
        if (currentDateTime < quiz.startTime) {
          currentQuizStatus = "Upcoming";
        } else if (currentDateTime > quiz.endTime) {
          currentQuizStatus = "Past";
        } else {
          currentQuizStatus = "Active";
        }

        const quizResponse = await QuizResponse.findOne({
          quiz: quiz._id,
          student: student._id,
        });

        formattedQuizzes.push({
          quizId: quiz._id,
          quizName: quiz.quizName,
          status: currentQuizStatus,
          responseStatus: quizResponse ? quizResponse.status : "",
          startTime: quiz.startTime,
          endTime: quiz.endTime,
        });
      }
    } catch (error) {
      return res
        .status(400)
        .json(
          formatMessage(false, "Mongoose error finding quizzes for course")
        );
    }
  }

  return res
    .status(200)
    .json(formatMessage(true, "Quizzes found", formattedQuizzes));
});

//@route  PATCH api/quizzes
//@desc   Allow instructor to update a quiz (not all fields)
//@access Private
const basicUpdateQuiz = asyncHandler(async (req, res) => {
  const { quizId, newQuizName, newStartTime, newEndTime } = req.body;

  //Check if valid user
  let instructor;
  try {
    instructor = await User.findOne({ email: req.session.email });
    if (!instructor) {
      return res.status(400).json(formatMessage(false, "Invalid user"));
    } else if (instructor.type !== "instructor") {
      return res.status(400).json(formatMessage(false, "Invalid user type"));
    }
  } catch (error) {
    return res
      .status(400)
      .json(formatMessage(false, "Mongoose error finding user"));
  }

  //Verify all fields exist
  if (!quizId || !newQuizName || !newStartTime || !newEndTime) {
    return res.status(400).json(formatMessage(false, "Missing fields"));
  }

  //Convert startTime and endTime to Date objects
  const startTimeConverted = new Date(newStartTime);
  const endTimeConverted = new Date(newEndTime);

  //Verify startTime and endTime are valid dates and startTime is before endTime
  if (
    isNaN(startTimeConverted) ||
    isNaN(endTimeConverted) ||
    newStartTime >= newEndTime
  ) {
    return res
      .status(400)
      .json(formatMessage(false, "Invalid start and/or end time"));
  }

  let quiz;
  try {
    quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(400).json(formatMessage(false, "Invalid quiz id"));
    }
  } catch (error) {
    return res
      .status(400)
      .json(formatMessage(false, "Mongoose error finding quiz"));
  }

  //Check if there is a pre-existing quiz with new name
  try {
    const existingQuiz = await Quiz.findOne({
      $and: [{ quizName: newQuizName }, { course: quiz.course }],
    });
    if (existingQuiz) {
      return res.status(400).json(formatMessage(false, "Quiz name taken"));
    }
  } catch (error) {
    return res
      .status(400)
      .json(formatMessage(false, "Mongoose error finding existing quiz"));
  }

  let course;
  try {
    course = await Course.findById(quiz.course);
    if (!course) {
      return res
        .status(400)
        .json(formatMessage(false, "Invalid course id in quiz"));
    }
  } catch (error) {
    return res
      .status(400)
      .json(formatMessage(false, "Mongoose error finding quiz course"));
  }

  //Check if instructor teaches course
  if (course.instructor.toString() !== instructor._id.toString()) {
    return res
      .status(403)
      .json(formatMessage(false, "Instructor does not teach course"));
  }

  //Update quiz
  quiz.quizName = newQuizName;
  quiz.startTime = startTimeConverted;
  quiz.endTime = endTimeConverted;
  await quiz.save();

  return res
    .status(200)
    .json(formatMessage(true, "Quiz updated successfully"));
});

//@route  PATCH api/quizzes/question
//@desc   Allow instructor to edit or remove a question from a quiz
//@access Private
const updateQuizQuestion = asyncHandler(async (req, res) => {
  const { quizId, action, question } = req.body;

  //Check if valid user
  let instructor;
  try {
    instructor = await User.findOne({ email: req.session.email });
    if (!instructor) {
      return res.status(400).json(formatMessage(false, "Invalid user"));
    } else if (instructor.type !== "instructor") {
      return res.status(400).json(formatMessage(false, "Invalid user type"));
    }
  } catch (error) {
    return res
      .status(400)
      .json(formatMessage(false, "Mongoose error finding user"));
  }

  //Verify all fields exist
  if (
    !quizId ||
    !question ||
    !action ||
    (action !== "edit" && action !== "remove")
  ) {
    return res
      .status(400)
      .json(formatMessage(false, "Missing/invalid fields"));
  }

  //Verify valid question
  if (action === "edit") {
    if (!question._id || !question.type) {
      return res
        .status(400)
        .json(formatMessage(false, "Missing fields in question"));
    }
  } else {
    //assume action === "remove", since we checked that earlier
    if (!question._id || !question.type) {
      return res
        .status(400)
        .json(formatMessage(false, "Missing fields in question"));
    }
  }

  let quiz;
  try {
    quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(400).json(formatMessage(false, "Invalid quiz id"));
    }
  } catch (error) {
    return res
      .status(400)
      .json(formatMessage(false, "Mongoose error finding quiz"));
  }

  let course;
  try {
    course = await Course.findById(quiz.course);
    if (!course) {
      return res
        .status(400)
        .json(formatMessage(false, "Invalid course id in quiz"));
    }
  } catch (error) {
    return res
      .status(400)
      .json(formatMessage(false, "Mongoose error finding quiz course"));
  }

  //Check if instructor teaches course
  if (course.instructor.toString() !== instructor._id.toString()) {
    return res
      .status(403)
      .json(formatMessage(false, "Instructor does not teach course"));
  }

  //Check if question exists in quiz
  const questionIndex = quiz.questions.findIndex(
    (currQuestion) =>
      currQuestion.toString() === question._id &&
      currQuestion.type === question.type
  );
  if (questionIndex === -1) {
    return res
      .status(400)
      .json(formatMessage(false, "Question not found in quiz"));
  }

  //Edit or remove question
  if (action === "remove") {
    try {
      switch (question.type) {
        case "MCQ":
          await MCQ.findByIdAndDelete(question._id);
          break;
        case "MSQ":
          await MSQ.findByIdAndDelete(question._id);
          break;
        case "CLO":
          await CLO.findByIdAndDelete(question._id);
          break;
        case "OEQ":
          await OEQ.findByIdAndDelete(question._id);
          break;
        default:
          return res
            .status(400)
            .json(formatMessage(false, "Invalid question type"));
      }
    } catch (error) {
      return res
        .status(400)
        .json(formatMessage(false, "Mongoose error editing question"));
    }
    quiz.questions.splice(questionIndex, 1);
    await quiz.save();
    return res
      .status(200)
      .json(formatMessage(true, "Question removed successfully"));
  } else {
    //assume action === "edit", since we checked that earlier
    try {
      switch (question.type) {
        case "MCQ":
          const validMCQChoices = question.choices.every(
            (choice) => choice.id && choice.content
          );
          if (!validMCQChoices) {
            return res
              .status(400)
              .json(formatMessage(false, "Invalid choices in MCQ question"));
          }
          await MCQ.findByIdAndUpdate(question._id, question);
          break;
        case "MSQ":
          const validMSQChoices = question.choices.every(
            (choice) => choice.id && choice.content
          );
          if (!validMSQChoices) {
            return res
              .status(400)
              .json(formatMessage(false, "Invalid choices in MSQ question"));
          }
          await MSQ.findByIdAndUpdate(question._id, question);
          break;
        case "CLO":
          await CLO.findByIdAndUpdate(question._id, question);
          break;
        case "OEQ":
          await OEQ.findByIdAndUpdate(question._id, question);
          break;
        default:
          return res
            .status(400)
            .json(formatMessage(false, "Invalid question type"));
      }
    } catch (error) {
      return res.status(400).json(formatMessage(false, error.message));
    }
    return res
      .status(200)
      .json(formatMessage(true, "Question edited successfully"));
  }
});

//@route  POST api/quizzes/question
//@desc   Allow instructor to add (a) question(s) to a quiz
//@access Private
const addQuizQuestions = asyncHandler(async (req, res) => {
  const { quizId, questions } = req.body;

  //Check if valid user
  let instructor;
  try {
    instructor = await User.findOne({ email: req.session.email });
    if (!instructor) {
      return res.status(400).json(formatMessage(false, "Invalid user"));
    } else if (instructor.type !== "instructor") {
      return res.status(400).json(formatMessage(false, "Invalid user type"));
    }
  } catch (error) {
    return res
      .status(400)
      .json(formatMessage(false, "Mongoose error finding user"));
  }

  //Verify all fields exist
  if (!quizId || !questions) {
    return res.status(400).json(formatMessage(false, "Missing fields"));
  }

  let quiz;
  try {
    quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(400).json(formatMessage(false, "Invalid quiz id"));
    }
  } catch (error) {
    return res
      .status(400)
      .json(formatMessage(false, "Mongoose error finding quiz"));
  }

  let course;
  try {
    course = await Course.findById(quiz.course);
    if (!course) {
      return res
        .status(400)
        .json(formatMessage(false, "Invalid course id in quiz"));
    }
  } catch (error) {
    return res
      .status(400)
      .json(formatMessage(false, "Mongoose error finding quiz course"));
  }

  //Check if instructor teaches course
  if (course.instructor.toString() !== instructor._id.toString()) {
    return res
      .status(403)
      .json(formatMessage(false, "Instructor does not teach course"));
  }

  //Create questions
  for (let i = 0; i < questions.length; i++) {
    let createdQuestion;
    try {
      switch (questions[i].type) {
        case "MCQ":
          const validMCQChoices = questions[i].choices.every(
            (choice) => choice.id && choice.content
          );
          if (!validMCQChoices) {
            return res
              .status(400)
              .json(formatMessage(false, "Invalid choices in MCQ question"));
          }
          createdQuestion = await MCQ.create(questions[i]);
          break;
        case "MSQ":
          const validMSQChoices = questions[i].choices.every(
            (choice) => choice.id && choice.content
          );
          if (!validMSQChoices) {
            return res
              .status(400)
              .json(formatMessage(false, "Invalid choices in MSQ question"));
          }
          createdQuestion = await MSQ.create(questions[i]);
          break;
        case "CLO":
          createdQuestion = await CLO.create(questions[i]);
          break;
        case "OEQ":
          createdQuestion = await OEQ.create(questions[i]);
          break;
        default:
          return res
            .status(400)
            .json(formatMessage(false, "Invalid question type"));
      }
    } catch (error) {
      return res
        .status(400)
        .json(formatMessage(false, "Mongoose error creating question"));
    }

    if (!createdQuestion) {
      return res
        .status(400)
        .json(formatMessage(false, "Question creation failed"));
    } else {
      try {
        quiz.questions.push({
          question: createdQuestion._id,
          type: questions[i].type,
        });
      } catch (error) {
        return res.status(400).json(formatMessage(false, error.message));
      }
    }
  }
  await quiz.save();
  return res
    .status(200)
    .json(formatMessage(true, "Questions added successfully"));
});

//@route  GET api/quizzes/:quizId/questions
//@desc   Allow any authenticated user to get any full quiz with questions
//@access Private
const getQuizObject = asyncHandler(async (req, res) => {
  let quiz;
  try {
    quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) {
      return res.status(400).json(formatMessage(false, "Invalid quiz id"));
    }
  } catch (error) {
    return res
      .status(400)
      .json(formatMessage(false, "Mongoose error finding quiz"));
  }

  //Get questions for quiz
  const formattedQuesions = [];
  for (let i = 0; i < quiz.questions.length; i++) {
    try {
      let question;
      switch (quiz.questions[i].type) {
        case "MCQ":
          question = await MCQ.findById(quiz.questions[i].question);
          break;
        case "MSQ":
          question = await MSQ.findById(quiz.questions[i].question);
          break;
        case "CLO":
          question = await CLO.findById(quiz.questions[i].question);
          break;
        case "OEQ":
          question = await OEQ.findById(quiz.questions[i].question);
          break;
        default:
          return res
            .status(400)
            .json(formatMessage(false, "Invalid question type"));
      }
      if (!question) {
        return res
          .status(400)
          .json(formatMessage(false, "Invalid question id"));
      }
      formattedQuesions.push({
        ...question.toObject(),
        type: quiz.questions[i].type,
      });
    } catch (error) {
      return res
        .status(400)
        .json(formatMessage(false, "Mongoose error finding question"));
    }
  }

  let course;
  try {
    course = await Course.findById(quiz.course);
    if (!course) {
      return res
        .status(400)
        .json(formatMessage(false, "Invalid course id in quiz"));
    }
  } catch (error) {
    return res
      .status(400)
      .json(formatMessage(false, "Mongoose error finding quiz course"));
  }

  return res.status(200).json(
    formatMessage(true, "Quiz found", {
      quizName: quiz.quizName,
      isDraft: quiz.isDraft,
      courseCode: course.courseCode,
      courseId: course._id,
      startTime: quiz.startTime,
      endTime: quiz.endTime,
      questions: formattedQuesions,
    })
  );
});

//@route  GET api/quizzes/:status
//@desc   Allow users to get draft, active, or upcoming quizzes for their enrolled or instructed courses
//@access Private
const getMyQuizzes = asyncHandler(async (req, res) => {
  const { status } = req.params;

  if (status !== "draft" && status !== "active" && status !== "upcoming") {
    return res.status(400).json(formatMessage(false, "Invalid parameter"));
  }

  //Check if valid user
  let user;
  try {
    user = await User.findOne({ email: req.session.email });
    if (!user) {
      return res.status(400).json(formatMessage(false, "Invalid user"));
    }
  } catch (error) {
    return res
      .status(400)
      .json(formatMessage(false, "Mongoose error finding user"));
  }

  let formattedQuizzes = [];

  //Get quizzes for every course
  for (let j = 0; j < user.courses.length; j++) {
    const accentColor = user.courses[j].accentColor;
    let course;
    try {
      course = await Course.findById(user.courses[j].courseId);
      if (!course) {
        return res
          .status(400)
          .json(formatMessage(false, "Invalid course id in quiz"));
      }
    } catch (error) {
      return res
        .status(400)
        .json(formatMessage(false, "Mongoose error finding quiz course"));
    }

    for (let i = 0; i < course.quizzes.length; i++) {
      try {
        const quiz = await Quiz.findById(course.quizzes[i]);
        if (!quiz) {
          return res.status(400).json(formatMessage(false, "Invalid quiz id"));
        }
        const currentDateTime = new Date();
        let flag;
        switch (status) {
          case "draft":
            flag = quiz.isDraft && user.type === "instructor";
            break;
          case "active":
            flag =
              !quiz.isDraft &&
              currentDateTime >= quiz.startTime &&
              currentDateTime <= quiz.endTime;
            break;
          case "upcoming":
            flag = !quiz.isDraft && currentDateTime < quiz.startTime;
            break;
          default:
            break;
        }

        if (flag) {
          let quizResponse;
          if (user.type === "student") {
            quizResponse = await QuizResponse.findOne({
              quiz: quiz._id,
              student: user._id,
            });
            console.log(quizResponse);
          }
          formattedQuizzes.push({
            quizId: quiz._id,
            quizName: quiz.quizName,
            courseCode: course.courseCode,
            courseId: course._id,
            accentColor: accentColor,
            startTime: quiz.startTime,
            endTime: quiz.endTime,
            isDraft: quiz.isDraft,
            responseStatus: quizResponse ? quizResponse.status : undefined,
          });
        }
      } catch (error) {
        return res
          .status(400)
          .json(
            formatMessage(false, "Mongoose error finding quizzes for course")
          );
      }
    }
  }

  return res
    .status(200)
    .json(
      formatMessage(
        true,
        `${status} quizzes fetched for the user`,
        formattedQuizzes
      )
    );
});

/* --- helper functions --- */

/* Edit a question in the database */
async function editQuestion(question, res) {
  try {
    switch (question.type) {
      case "MCQ":
        const validMCQChoices = question.choices.every(
          (choice) => choice.id && choice.content
        );
        if (!validMCQChoices) {
          return res
            .status(400)
            .json(formatMessage(false, "Invalid choices in MCQ question"));
        }
        await MCQ.findByIdAndUpdate(question._id, question);
        break;
      case "MSQ":
        const validMSQChoices = question.choices.every(
          (choice) => choice.id && choice.content
        );
        if (!validMSQChoices) {
          return res
            .status(400)
            .json(formatMessage(false, "Invalid choices in MSQ question"));
        }
        await MSQ.findByIdAndUpdate(question._id, question);
        break;
      case "CLO":
        await CLO.findByIdAndUpdate(question._id, question);
        break;
      case "OEQ":
        await OEQ.findByIdAndUpdate(question._id, question);
        break;
      default:
        return res
          .status(400)
          .json(formatMessage(false, "Invalid question type"));
    }
  } catch (error) {
    return res.status(400).json(formatMessage(false, error.message));
  }
}

/* Create a question object in the database and return */
async function createQuestion(question, res) {
  if (question._id && !isValidObjectId(question._id)) {
    delete question._id;
  }
  let createdQuestion;
  try {
    switch (question.type) {
      case "MCQ":
        const validMCQChoices = question.choices.every(
          (choice) => choice.id && choice.content
        );
        if (!validMCQChoices) {
          return res
            .status(400)
            .json(formatMessage(false, "Invalid choices in MCQ question"));
        }
        createdQuestion = await MCQ.create(question);
        break;
      case "MSQ":
        const validMSQChoices = question.choices.every(
          (choice) => choice.id && choice.content
        );
        if (!validMSQChoices) {
          return res
            .status(400)
            .json(formatMessage(false, "Invalid choices in MSQ question"));
        }
        createdQuestion = await MSQ.create(question);
        break;
      case "CLO":
        createdQuestion = await CLO.create(question);
        break;
      case "OEQ":
        createdQuestion = await OEQ.create(question);
        break;
      default:
        return res
          .status(400)
          .json(formatMessage(false, "Invalid question type"));
    }
  } catch (error) {
    return res.status(400).json(formatMessage(false, error.message));
  }
  return createdQuestion;
}

export {
  createQuiz,
  updateQuiz,
  releaseQuiz,
  deleteDraftQuiz,
  getQuiz,
  getQuizzesForInstructedCourse,
  getQuizzesForEnrolledCourse,
  basicUpdateQuiz,
  updateQuizQuestion,
  addQuizQuestions,
  getQuizObject,
  getMyQuizzes,
};
