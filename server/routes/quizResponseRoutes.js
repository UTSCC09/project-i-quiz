import { Router } from "express";
import {
  attemptQuiz,
  getAllMyQuizResponses,
  getQuizResponsesForQuiz,
  submitQuiz
} from "../controllers/quizResponseController.js";
import protect from "../middleware/authMiddleware.js";

const router = Router();

router.route("/")
  .post(protect, attemptQuiz)
  .get(protect, getAllMyQuizResponses);

router.route("/quiz/:quizId")
  .get(protect, getQuizResponsesForQuiz);

router.route("/:questionResponseId")
  .patch(protect, submitQuiz);

export default router;