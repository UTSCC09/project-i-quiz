import asyncHandler from "express-async-handler";
import formatMessage from "../utils/utils.js";
import QuizRemark from "../models/QuizRemark.js";
import User from "../models/User.js";
import Quiz from "../models/Quiz.js";
import Course from "../models/Course.js";
import QuizResponse from "../models/QuizResponse.js";

//@route  POST api/quiz-remarks/
//@desc   Allow student to create a quiz remark request
//@access Private
const createQuizRemark = asyncHandler(async (req, res) => {
  const { quizId, questionRemarks } = req.body;
  /*
  questionRemarks: [
      {
          question: ObjectId,
          studentComment: comment,
      },
      ...
  ]
  */

  //Check if student
  let student = await User.findOne({ email: req.session.email });
  if (!student) {
    return res.status(400).json(formatMessage(false, "Invalid user"));
  } else if (student.type !== "student") {
    return res.status(400).json(formatMessage(false, "Invalid user type"));
  }

  //Verify all fields exist
  if (!quizId || !questionRemarks) {
    return res.status(400).json(formatMessage(false, "Missing fields"));
  }

  //Check if quiz remark already exists for this quiz
  const quizRemarks = await QuizRemark.find({
    quiz: quizId,
    student: student._id,
  });
  const pendingRemarks = quizRemarks.filter(
    (remark) => remark.status === "pending"
  );
  if (pendingRemarks.length > 0) {
    return res
      .status(400)
      .json(
        formatMessage(
          false,
          "Please wait for your other remark request to be resolved"
        )
      );
  }

  //Find Quiz
  let quiz = await Quiz.findById(quizId);
  if (!quiz) {
    return res.status(400).json(formatMessage(false, "Invalid quiz id"));
  } else if (
    !student.courses.some(
      (course) => course.courseId.toString() === quiz.course.toString()
    )
  ) {
    return res
      .status(403)
      .json(formatMessage(false, "Student not enrolled in course"));
  }

  //Check if quiz unreleased or locked
  const startTime = new Date(quiz.startTime);
  const endTime = new Date(quiz.endTime);
  const currentTime = new Date();

  if (startTime > currentTime) {
    return res
      .status(403)
      .json(
        formatMessage(
          false,
          "Cannot create remark request for quiz not yet released"
        )
      );
  } else if (endTime < currentTime) {
    return res
      .status(403)
      .json(
        formatMessage(false, "Cannot create remark request for quiz locked")
      );
  }

  //Verify question remarks have same questions as quiz
  const quizQuestions = quiz.questions;
  let sameQuestions = true;
  for (const remarkQuestion of questionRemarks) {
    let question = quizQuestions.filter(
      (quizQuestion) =>
        quizQuestion.question.toString() === remarkQuestion.question
    );
    if (question.length == 0) {
      sameQuestions = false;
    }
  }
  if (!sameQuestions) {
    return res
      .status(400)
      .json(
        formatMessage(false, "Remark questions do not match quiz questions")
      );
  }

  try {
    const quizRemark = await QuizRemark.create({
      quiz: quizId,
      student: student._id,
      questionRemarks: questionRemarks,
    });
    if (quizRemark) {
      return res
        .status(201)
        .json(
          formatMessage(true, "Quiz remark created successfully", quizRemark)
        );
    }
  } catch (error) {
    return res
      .status(400)
      .json(
        formatMessage(false, "Mongoose error creating quiz remark request")
      );
  }
});

//@route  GET api/quiz-remarks/my/:quizId
//@desc   Allow student to see their remark request for a specific quiz
//@access Private
const getMyQuizRemark = asyncHandler(async (req, res) => {
  const { quizId } = req.params;

  if (!quizId) {
    return res.status(400).json(formatMessage(false, "Missing fields"));
  }

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
    const quizRemark = await QuizRemark.findOne({
      quiz: quizId,
      student: student._id,
    });
    if (quizRemark) {
      return res
        .status(200)
        .json(
          formatMessage(true, "Quiz remark fetched successfully", quizRemark)
        );
    }
    return res
      .status(400)
      .json(formatMessage(false, "No response found for this quiz"));
  } catch (error) {
    return res
      .status(400)
      .json(formatMessage(false, "Mongoose error fetching quiz response"));
  }
});

//@route  GET api/quiz-remarks/all/:quizId
//@desc   Allow instructor to see all remark requests for a specific quiz (both pending and resolved)
//@access Private
const getAllQuizRemarks = asyncHandler(async (req, res) => {
  const { quizId } = req.params;

  if (!quizId) {
    return res.status(400).json(formatMessage(false, "Missing fields"));
  }

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

  let course;
  try {
    course = await Course.findOne({ quizzes: quizId });
    if (!course) {
      return res
        .status(400)
        .json(formatMessage(false, "Cannot find quiz in courses"));
    }
  } catch (err) {
    return res
      .status(400)
      .json(formatMessage(false, "Mongoose fetching course"));
  }

  if (course.instructor.toString() !== instructor._id.toString()) {
    return res
      .status(400)
      .json(formatMessage(false, "Not instructor of course"));
  }

  try {
    const quizRemarks = await QuizRemark.find({ quiz: quizId });
    if (quizRemarks) {
      return res
        .status(200)
        .json(
          formatMessage(
            true,
            "All Quiz remarks fetched successfully",
            quizRemarks
          )
        );
    }
    return res
      .status(400)
      .json(formatMessage(false, "No remark request found for this quiz"));
  } catch (error) {
    return res
      .status(400)
      .json(formatMessage(false, "Mongoose error fetching quiz remark"));
  }
});

//@route  PATCH api/quiz-remarks/resolve/:quizRemarkId
//@desc   Allow instructor to resolve a remark request for a specific quiz
//@access Private
const resolveQuizRemark = asyncHandler(async (req, res) => {
  const { quizRemarkId } = req.params;
  const { questionRemarks } = req.body;
  /*
    questionRemarks: [
        {
            question: ObjectId,
            instructorComment: comment,
            score: newScore ? newScore : undefined,
        },
        ...
    ]
  */

  if (!quizRemarkId || !questionRemarks) {
    return res.status(400).json(formatMessage(false, "Missing fields"));
  }

  let instructor = await User.findOne({ email: req.session.email });
  if (!instructor) {
    return res.status(400).json(formatMessage(false, "Invalid user"));
  } else if (instructor.type !== "instructor") {
    return res.status(400).json(formatMessage(false, "Invalid user type"));
  }

  //Check quizRemark not already resolved
  let quizRemark = await QuizRemark.findById(quizRemarkId);
  if (!quizRemark) {
    return res.status(400).json(formatMessage(false, "Invalid quiz remark id"));
  } else if (quizRemark.status === "resolved") {
    return res
      .status(400)
      .json(formatMessage(false, "Remark request is already resolved"));
  }

  //Verify question remarks have same questions as quiz
  const quiz = await Quiz.findById(quizRemark.quiz);
  const quizQuestions = quiz.questions;
  let sameQuestions = true;
  for (const remarkQuestion of questionRemarks) {
    let question = quizQuestions.filter(
      (quizQuestion) =>
        quizQuestion.question.toString() === remarkQuestion.question
    );
    if (question.length == 0) {
      sameQuestions = false;
    }
  }
  if (!sameQuestions) {
    return res
      .status(400)
      .json(
        formatMessage(false, "Remark questions do not match quiz questions")
      );
  }

  //Updating student's score if necessary and remark request instructor comment
  let quizResponse = await QuizResponse.findOne({
    quiz: quizRemark.quiz,
    student: quizRemark.student,
  });
  for (const remarkQuestion of questionRemarks) {
    //Update score
    quizResponse.questionResponses = quizResponse.questionResponses.map(
      (quizQuestion) => {
        if (quizQuestion.question.toString() === remarkQuestion.question) {
          quizQuestion.score = remarkQuestion.score
            ? remarkQuestion.score
            : quizQuestion.score;
        }
        return quizQuestion;
      }
    );

    //Update instructor comment on remark request for student to see
    quizRemark.questionRemarks = quizRemark.questionRemarks.map(
      (questionRemark) => {
        if (questionRemark.question.toString() === remarkQuestion.question) {
          questionRemark.instructorComment = remarkQuestion.instructorComment;
        }
        return questionRemark;
      }
    );
  }

  //Save
  await quizResponse.save();
  quizRemark.status = "resolved";
  await quizRemark.save();

  return res
    .status(200)
    .json(formatMessage(true, "Quiz remark resolved successfully"));
});

export {
  createQuizRemark,
  getMyQuizRemark,
  getAllQuizRemarks,
  resolveQuizRemark,
};
