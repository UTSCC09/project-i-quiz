import { Router } from "express";
import {
  createQuizResponse,
  getAllMyQuizResponses,
  getMyResponseForQuiz,
  editMyResponseForQuiz,
  getAllStudentResponsesForQuiz,
  submitMyResponseForQuiz,
  gradeStudentQuizResponse
} from "../controllers/quizResponseController.js";
import protect from "../middleware/authMiddleware.js";

const router = Router();

router.route("/")
  .post(protect, createQuizResponse)
  .get(protect, getAllMyQuizResponses);

router.route("/my/:quizId")
  .get(protect, getMyResponseForQuiz)
  .patch(protect, editMyResponseForQuiz);

router.route("/submit/:quizId")
  .patch(protect, submitMyResponseForQuiz);

router.route("/all/:quizId")
  .get(protect, getAllStudentResponsesForQuiz);

router.route("/grade")
  .patch(protect, gradeStudentQuizResponse);

export default router;