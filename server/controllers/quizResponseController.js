import asyncHandler from "express-async-handler";
import formatMessage from "../utils/utils.js";
import QuizResponse from "../models/QuizResponse.js";
import User from "../models/User.js";
import Quiz from "../models/Quiz.js";

//@route  POST api/quiz-responses
//@desc   Allow student to create a quiz response
//@access Private
const attemptQuiz = asyncHandler(async (req, res) => {
  const { quizId, questionResponses } = req.body;

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

  //Verify all fields exist
  if (!quizId || !questionResponses) {
    return res.status(400).json(formatMessage(false, "Missing fields"));
  }

  let quiz;
  try {
    quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(400).json(formatMessage(false, "Invalid quiz id"));
    } else if (!student.courses.some(
      (course) => course.courseId.toString() === quiz.course.toString()
      )) {
      return res.status(403).json(formatMessage(false, "Student not enrolled in course"));
    }
    const startTime = new Date(quiz.startTime);
    const endTime = new Date(quiz.endTime);
    const currentTime = new Date();

    if (startTime > currentTime) {
      return res.status(403).json(formatMessage(false, "Quiz not yet released"));
    } else if (endTime < currentTime) {
      return res.status(403).json(formatMessage(false, "Quiz locked"));
    }

  } catch (error) {
    return res
      .status(400)
      .json(formatMessage(false, "Mongoose error finding quiz"));
  }

  //Verify question responses have same questions as quiz
  const quizQuestions = JSON.stringify(quiz.questions.map((question) => question.question.toString()));
  const questionResponsesQuestions = JSON.stringify(questionResponses.map((questionResponse) => questionResponse.question.toString()));
  if (quizQuestions !== questionResponsesQuestions) {
    return res.status(400).json(formatMessage(false, "Response questions do not match quiz questions"));
  }

  try {
    const quizResponse = await QuizResponse.create({
      quiz: quizId,
      questionResponses: questionResponses,
    });
    if (quizResponse) {
      return res.status(201).json(formatMessage(true, "Quiz response created successfully", quizResponse));
    }
  } catch (error) {
    return res.status(400).json(formatMessage(false, "Mongoose error creating quiz response"));
  }
});

export {
  attemptQuiz
};