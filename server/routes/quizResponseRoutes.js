import { Router } from "express";
import {
  attemptQuiz
} from "../controllers/quizResponseController.js";
import protect from "../middleware/authMiddleware.js";

const router = Router();

router.route("/")
  .post(protect, attemptQuiz);

export default router;