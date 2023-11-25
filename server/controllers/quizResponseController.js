import asyncHandler from "express-async-handler";
import formatMessage from "../utils/utils.js";
import QuizResponse from "../models/QuizResponse.js";
import User from "../models/User.js";
import Quiz from "../models/Quiz.js";

//@route  POST api/quiz-responses
//@desc   Allow student to create a quiz response
//@access Private
const createQuizResponse = asyncHandler(async (req, res) => {
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

  //Check if quiz response already exists
  try {
    const quizResponse = await QuizResponse.findOne({ quiz: quizId, student: student._id });
    if (quizResponse) {
      return res.status(400).json(formatMessage(false, "Quiz response already exists"));
    }
  } catch (error) {
    return res.status(400).json(formatMessage(false, "Mongoose error finding existing quiz response"));
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
  const quizQuestions = JSON.stringify(quiz.questions
    .map((question) => question.question.toString()));
  const questionResponsesQuestions = JSON.stringify(questionResponses
    .map((questionResponse) => questionResponse.question.toString()));
  if (quizQuestions !== questionResponsesQuestions) {
    return res.status(400).json(formatMessage(false, "Response questions do not match quiz questions"));
  }

  try {
    const quizResponse = await QuizResponse.create({
      quiz: quizId,
      student: student._id,
      questionResponses: questionResponses
    });
    if (quizResponse) {
      return res.status(201).json(formatMessage(true, "Quiz response created successfully", quizResponse));
    }
  } catch (error) {
    return res.status(400).json(formatMessage(false, "Mongoose error creating quiz response"));
  }
});

//@route  GET api/quiz-responses
//@desc   Allow student to fetch all of their quiz responses
//@access Private
const getAllMyQuizResponses = asyncHandler(async (req, res) => {
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

  try {
    const quizResponses = await QuizResponse.find({ student: student._id });
    return res.status(200).json(formatMessage(true, "Quiz responses fetched successfully", quizResponses));
  } catch (error) {
    return res.status(400).json(formatMessage(false, "Mongoose error fetching quiz responses"));
  }
});

//@route  GET api/quiz-responses/my/:quizId
//@desc   Allow student to fetch their response for a specific quiz
//@access Private
const getMyResponseForQuiz = asyncHandler(async (req, res) => {
  const { quizId } = req.params;

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

  try {
    const quizResponse = await QuizResponse.findOne({ quiz: quizId, student: student._id });
    if (quizResponse) {
      return res.status(200).json(formatMessage(true, "Quiz response fetched successfully", quizResponse));
    }
    return res.status(400).json(formatMessage(true, "No response found for this quiz"));
  } catch (error) {
    return res.status(400).json(formatMessage(false, "Mongoose error fetching quiz response"));
  }
});

//@route  PATCH api/quiz-responses/my/:quizId
//@desc   Allow student to edit their response for a specific quiz
//@access Private
const editMyResponseForQuiz = asyncHandler(async (req, res) => {
  const { quizId } = req.params;
  const { questionResponses } = req.body;

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

  //Find quiz response if it exists
  let quizResponse;
  try {
    quizResponse = await QuizResponse.findOne({ quiz: quizId, student: student._id });
    if (!quizResponse) {
      return res.status(400).json(formatMessage(false, "Invalid quiz response"));
    }
    if (quizResponse.status === "submitted") {
      return res.status(400).json(formatMessage(false, "Quiz response already submitted"));
    }
  } catch (error) {
    return res.status(400).json(formatMessage(false, "Mongoose error finding existing quiz response"));
  }

  let quiz;
  try {
    quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(400).json(formatMessage(false, "Invalid quiz id"));
    }

    const endTime = new Date(quiz.endTime);
    const currentTime = new Date();

    if (endTime < currentTime) {
      return res.status(403).json(formatMessage(false, "Quiz locked"));
    }
  
  } catch (error) {
    return res
      .status(400)
      .json(formatMessage(false, "Mongoose error finding quiz"));
  }

  //Verify question responses have same questions as quiz
  const quizQuestions = JSON.stringify(quiz.questions
    .map((question) => question.question.toString()));
  const questionResponsesQuestions = JSON.stringify(questionResponses
    .map((questionResponse) => questionResponse.question.toString()));
  if (quizQuestions !== questionResponsesQuestions) {
    return res.status(400).json(formatMessage(false, "Response questions do not match quiz questions"));
  }

  //Update quiz response
  quizResponse.questionResponses = questionResponses;
  await quizResponse.save();
  return res.status(200).json(formatMessage(true, "Quiz response updated successfully", quizResponse));
});

//@route  PATCH api/quiz-responses/:questionResponseId
//@desc   Allow student to submit a quiz response
//@access Private
const submitQuizResponse = asyncHandler(async (req, res) => {
  const { questionResponseId } = req.params;

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

  //Verify question response validity
  try {
    const quizResponse = await QuizResponse.findById(questionResponseId);
    if (!quizResponse) {
      return res.status(400).json(formatMessage(false, "Invalid quiz response id"));
    } else if (quizResponse.student.toString() !== student._id.toString()) {
      return res.status(403).json(formatMessage(false, "Quiz response does not belong to student"));
    } else if (quizResponse.status === "submitted") {
      return res.status(400).json(formatMessage(false, "Quiz response already submitted"));
    }

    const quiz = await Quiz.findById(quizResponse.quiz);
    const startTime = new Date(quiz.startTime);
    const endTime = new Date(quiz.endTime);
    const currentTime = new Date();

    if (startTime > currentTime) {
      return res.status(403).json(formatMessage(false, "Quiz not yet released"));
    } else if (endTime < currentTime) {
      return res.status(403).json(formatMessage(false, "Quiz locked"));
    }

    quizResponse.status = "submitted";
    await quizResponse.save();
    return res.status(200).json(formatMessage(true, "Quiz response submitted successfully"));
  
  } catch (error) {
    return res.status(400).json(formatMessage(false, "Mongoose error verifying quiz response validity", null, error));
  }
});

//@route  GET api/quiz-responses/all/:quizId
//@desc   Allow instructor to fetch all quiz responses for a specific quiz
//@access Private
const getAllStudentResponsesForQuiz = asyncHandler(async (req, res) => {
  const { quizId } = req.params;

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

  try {
    const quiz = await Quiz.findById(quizId);
    const quizCourse = quiz.course;
    if (!instructor.courses.some(
      (course) => course.courseId.toString() === quizCourse.toString()
      )) {
      return res.status(403).json(formatMessage(false, "Instructor does not instruct course"));
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json(formatMessage(false, "Mongoose error finding quiz"));
  }

  try {
    const quizResponses = await QuizResponse.find({ quiz: quizId });
    if (quizResponses) {
      return res.status(200).json(formatMessage(true, "Quiz responses fetched successfully", quizResponses));
    }
  } catch (error) {
    return res.status(400).json(formatMessage(false, "Mongoose error fetching quiz responses"));
  }
});

export {
  createQuizResponse,
  getAllMyQuizResponses,
  getMyResponseForQuiz,
  editMyResponseForQuiz,
  getAllStudentResponsesForQuiz,
  submitQuizResponse
};