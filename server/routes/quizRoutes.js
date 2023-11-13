import { Router } from "express";
import {
  createQuiz,
  getQuiz,
  getQuizzesForInstructedCourse,
  getQuizzesForEnrolledCourse,
  basicUpdateQuiz,
  updateQuizQuestion,
  addQuizQuestions,
  getQuizObject,
  getUpcomingQuizzesForEnrolledCourses,
  getUpcomingQuizzesForInstructedCourses
} from "../controllers/quizController.js";
import protect from "../middleware/authMiddleware.js";

const router = Router();

router.route("/")
  .post(protect, createQuiz)
  .patch(protect, basicUpdateQuiz);

router.route("/question")
  .post(protect, addQuizQuestions)
  .patch(protect, updateQuizQuestion);

router.route("/upcoming/student")
  .get(protect, getUpcomingQuizzesForEnrolledCourses);

router.route("/upcoming/instructor")
  .get(protect, getUpcomingQuizzesForInstructedCourses);

router.route("/:quizId")
  .get(protect, getQuiz)

router.route("/:quizId/questions")
  .get(protect, getQuizObject)

router.route("/course/instructed/:courseId")
  .get(protect, getQuizzesForInstructedCourse);

  router.route("/course/enrolled/:courseId")
  .get(protect, getQuizzesForEnrolledCourse);

export default router;