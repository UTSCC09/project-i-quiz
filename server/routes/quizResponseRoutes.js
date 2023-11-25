import { Router } from "express";
import {
  createQuizResponse,
  getAllMyQuizResponses,
  getMyResponseForQuiz,
  getAllStudentResponsesForQuiz,
  submitQuizResponse
} from "../controllers/quizResponseController.js";
import protect from "../middleware/authMiddleware.js";

const router = Router();

router.route("/")
  .post(protect, createQuizResponse)
  .get(protect, getAllMyQuizResponses);

router.route("/my/:quizId")
  .get(protect, getMyResponseForQuiz);

router.route("/all/:quizId")
  .get(protect, getAllStudentResponsesForQuiz);

router.route("/:questionResponseId")
  .patch(protect, submitQuizResponse);

export default router;