import { Router } from "express";
import {
  createQuiz,
  getQuiz,
  getQuizzesForInstructedCourse,
  getQuizzesForEnrolledCourse,
  basicUpdateQuiz
} from "../controllers/quizController.js";
import protect from "../middleware/authMiddleware.js";

const router = Router();

router.route("/")
  .post(protect, createQuiz)
  .put(protect, basicUpdateQuiz);

router.route("/:quizId")
  .get(protect, getQuiz)

router.route("/course/instructed/:courseId")
  .get(protect, getQuizzesForInstructedCourse);

  router.route("/course/enrolled/:courseId")
  .get(protect, getQuizzesForEnrolledCourse);

export default router;