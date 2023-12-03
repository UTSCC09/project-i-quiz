import { Router } from "express";
import {
  createQuiz,

  getQuiz,
  getQuizObject,
  getMyQuizzes,
  getQuizzesForInstructedCourse,
  getQuizzesForEnrolledCourse,

  basicUpdateQuiz,
  updateQuiz,
  addQuizQuestions,
  updateQuizQuestion,
  releaseQuiz,
  deleteDraftQuiz,
  generateQuizPDF,
  releaseQuizGrades
} from "../controllers/quizController.js";
import protect from "../middleware/authMiddleware.js";

const router = Router();

router.route("/")
  .post(protect, createQuiz)
  .patch(protect, basicUpdateQuiz);

router.route("/:quizId/questions")
  .get(protect, getQuizObject);

router.route("/:status").
  get(protect, getMyQuizzes);

router.route("/course/instructed/:courseId")
  .get(protect, getQuizzesForInstructedCourse);

router.route("/course/enrolled/:courseId")
  .get(protect, getQuizzesForEnrolledCourse);

router.route("/update")
  .post(protect, updateQuiz);

router.route("/question")
  .post(protect, addQuizQuestions)
  .patch(protect, updateQuizQuestion);

router.route("/:quizId")
  .get(protect, getQuiz)
  .delete(protect, deleteDraftQuiz);

router.route("/:quizId/release")
  .post(protect, releaseQuiz);

router.route("/:quizId/grades-release")
  .patch(protect, releaseQuizGrades);

router.route("/generate/:quizId")
  .get(protect, generateQuizPDF);

export default router;
